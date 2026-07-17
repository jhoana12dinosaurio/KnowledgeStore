const { query, getClient } = require('../config/database');

// ── POST /api/enrollments  (inscribirse a un curso) ──────────────────────────
const enroll = async (req, res, next) => {
  const client = await getClient();
  try {
    const { course_id } = req.body;

    // Verificar que el curso existe y está publicado
    const courseRes = await client.query(
      "SELECT id, price, title FROM courses WHERE id = $1 AND status = 'published'",
      [course_id]
    );
    if (!courseRes.rows.length) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }

    const course = courseRes.rows[0];

    // Si el curso es de pago, verificar suscripción Pro/Enterprise
    if (parseFloat(course.price) > 0) {
      const subRes = await client.query(
        `SELECT s.id FROM subscriptions s
         JOIN plans p ON p.id = s.plan_id
         WHERE s.user_id = $1
           AND p.plan_type IN ('pro','enterprise')
           AND (s.ends_at IS NULL OR s.ends_at > NOW())
         LIMIT 1`,
        [req.user.id]
      );
      if (!subRes.rows.length) {
        return res.status(402).json({
          error: 'Se requiere plan Pro o Empresas para acceder a este curso',
          course_price: course.price,
        });
      }
    }

    // Insertar inscripción (o recuperar existente)
    const result = await client.query(
      `INSERT INTO enrollments (user_id, course_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, course_id) DO UPDATE SET status = 'active'
       RETURNING *`,
      [req.user.id, course_id]
    );

    res.status(201).json({
      message:    `Inscripción exitosa en "${course.title}"`,
      enrollment: result.rows[0],
    });
  } catch (err) {
    next(err);
  } finally {
    client.release();
  }
};

// ── GET /api/enrollments/my  (mis cursos) ────────────────────────────────────
const myEnrollments = async (req, res, next) => {
  try {
    const result = await query(
      `SELECT
         e.id             AS enrollment_id,
         e.enrolled_at,
         e.progress_pct,
         e.status,
         c.id             AS course_id,
         c.title,
         c.slug,
         c.thumbnail_url,
         c.duration_hrs,
         cat.name         AS category,
         u.name           AS instructor
       FROM enrollments e
       JOIN courses    c   ON c.id   = e.course_id
       LEFT JOIN categories cat ON cat.id = c.category_id
       LEFT JOIN users u   ON u.id  = c.instructor_id
       WHERE e.user_id = $1 AND e.status = 'active'
       ORDER BY e.enrolled_at DESC`,
      [req.user.id]
    );

    res.json({ enrollments: result.rows });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /api/enrollments/:id/progress  (actualizar progreso) ───────────────
const updateProgress = async (req, res, next) => {
  try {
    const { id }           = req.params;
    const { lesson_id, watch_pct, completed } = req.body;

    // Verificar que la inscripción pertenece al usuario
    const enroll = await query(
      'SELECT id, course_id FROM enrollments WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );
    if (!enroll.rows.length) {
      return res.status(404).json({ error: 'Inscripción no encontrada' });
    }

    // Verificar que la lección pertenece al curso inscrito
    const lessonRes = await query(
      'SELECT id FROM lessons WHERE id = $1 AND course_id = $2',
      [lesson_id, enroll.rows[0].course_id]
    );
    if (!lessonRes.rows.length) {
      return res.status(400).json({ error: 'La lección no pertenece al curso de esta inscripción' });
    }

    const safeCompleted = completed === true || completed === 'true';
    const safeWatchPct = watch_pct === undefined ? 0 : Number(watch_pct);

    // Upsert progreso de lección
    await query(
      `INSERT INTO lesson_progress (user_id, lesson_id, completed, watch_pct)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, lesson_id) DO UPDATE
         SET completed = EXCLUDED.completed,
             watch_pct = EXCLUDED.watch_pct,
             updated_at = NOW()`,
      [req.user.id, lesson_id, safeCompleted, safeWatchPct]
    );

    // Recalcular progreso global del curso
    const totalLessons = await query(
      'SELECT COUNT(*) FROM lessons WHERE course_id = $1',
      [enroll.rows[0].course_id]
    );
    const completedLessons = await query(
      `SELECT COUNT(*) FROM lesson_progress lp
       JOIN lessons l ON l.id = lp.lesson_id
       WHERE lp.user_id = $1 AND l.course_id = $2 AND lp.completed = TRUE`,
      [req.user.id, enroll.rows[0].course_id]
    );

    const total     = parseInt(totalLessons.rows[0].count)    || 1;
    const done      = parseInt(completedLessons.rows[0].count) || 0;
    const progress  = Math.round((done / total) * 100);

    const updated = await query(
      `UPDATE enrollments
       SET progress_pct  = $1,
           completed_at  = CASE WHEN $1 = 100 THEN NOW() ELSE NULL END,
           status        = CASE WHEN $1 = 100 THEN 'completed' ELSE 'active' END
       WHERE id = $2
       RETURNING *`,
      [progress, id]
    );

    // Emitir certificado si completo
    if (progress === 100) {
      await query(
        `INSERT INTO certificates (user_id, course_id)
         VALUES ($1, $2)
         ON CONFLICT (user_id, course_id) DO NOTHING`,
        [req.user.id, enroll.rows[0].course_id]
      );
    }

    res.json({ enrollment: updated.rows[0], progress_pct: progress });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/enrollments/:courseId/check  (¿está inscrito?) ─────────────────
const checkEnrollment = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const result = await query(
      `SELECT
         e.id,
         e.progress_pct,
         e.status,
         COALESCE(
           json_agg(
             json_build_object(
               'lesson_id', lp.lesson_id,
               'completed', lp.completed,
               'watch_pct', lp.watch_pct
             )
             ORDER BY l.position
           ) FILTER (WHERE lp.lesson_id IS NOT NULL),
           '[]'::json
         ) AS lesson_progress
       FROM enrollments e
       LEFT JOIN lessons l ON l.course_id = e.course_id
       LEFT JOIN lesson_progress lp
         ON lp.user_id = e.user_id AND lp.lesson_id = l.id
       WHERE e.user_id = $1 AND e.course_id = $2
       GROUP BY e.id, e.progress_pct, e.status`,
      [req.user.id, courseId]
    );

    const enrollment = result.rows[0] || null;

    res.json({
      enrolled: enrollment !== null,
      enrollment: enrollment
        ? {
            id: enrollment.id,
            progress_pct: enrollment.progress_pct,
            status: enrollment.status,
          }
        : null,
      lesson_progress: enrollment?.lesson_progress || [],
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { enroll, myEnrollments, updateProgress, checkEnrollment };