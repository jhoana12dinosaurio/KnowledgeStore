const { query } = require('../config/database');

const canManageCourse = async (courseId, user) => {
  const result = await query('SELECT id, instructor_id FROM courses WHERE id = $1', [courseId]);
  if (!result.rows.length) return { allowed: false, status: 404, error: 'Curso no encontrado' };
  const course = result.rows[0];
  if (user.role !== 'admin' && course.instructor_id !== user.id) {
    return { allowed: false, status: 403, error: 'No tienes permiso para administrar este curso' };
  }
  return { allowed: true, course };
};

const refreshTotalLessons = async (courseId) => {
  await query(
    `UPDATE courses
     SET total_lessons = (SELECT COUNT(*) FROM lessons WHERE course_id = $1)
     WHERE id = $1`,
    [courseId]
  );
};

// ── GET /api/courses/:courseId/lessons ──────────────────────────────────────
const getLessonsByCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const result = await query(
      `SELECT id, course_id, title, description, video_url, duration_min, position, is_free, created_at
       FROM lessons
       WHERE course_id = $1
       ORDER BY position ASC, created_at ASC`,
      [courseId]
    );

    res.json({ lessons: result.rows });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/courses/:courseId/lessons  (instructor/admin) ─────────────────
const createLesson = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const permission = await canManageCourse(courseId, req.user);
    if (!permission.allowed) return res.status(permission.status).json({ error: permission.error });

    const { title, description, video_url, duration_min, position, is_free } = req.body;

    const result = await query(
      `INSERT INTO lessons (course_id, title, description, video_url, duration_min, position, is_free)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [courseId, title, description || null, video_url || null, duration_min || 0, position || 1, !!is_free]
    );

    await refreshTotalLessons(courseId);

    res.status(201).json({ lesson: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /api/courses/:courseId/lessons/:lessonId ──────────────────────────
const updateLesson = async (req, res, next) => {
  try {
    const { courseId, lessonId } = req.params;
    const permission = await canManageCourse(courseId, req.user);
    if (!permission.allowed) return res.status(permission.status).json({ error: permission.error });

    const fields = ['title', 'description', 'video_url', 'duration_min', 'position', 'is_free'];
    const sets = [];
    const params = [];

    for (const field of fields) {
      if (req.body[field] !== undefined) {
        params.push(req.body[field]);
        sets.push(`${field} = $${params.length}`);
      }
    }

    if (!sets.length) return res.status(400).json({ error: 'Nada que actualizar' });

    params.push(lessonId, courseId);
    const result = await query(
      `UPDATE lessons
       SET ${sets.join(', ')}
       WHERE id = $${params.length - 1} AND course_id = $${params.length}
       RETURNING *`,
      params
    );

    if (!result.rows.length) return res.status(404).json({ error: 'Lección no encontrada' });

    res.json({ lesson: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/courses/:courseId/lessons/:lessonId ─────────────────────────
const deleteLesson = async (req, res, next) => {
  try {
    const { courseId, lessonId } = req.params;
    const permission = await canManageCourse(courseId, req.user);
    if (!permission.allowed) return res.status(permission.status).json({ error: permission.error });

    const result = await query(
      'DELETE FROM lessons WHERE id = $1 AND course_id = $2 RETURNING id',
      [lessonId, courseId]
    );

    if (!result.rows.length) return res.status(404).json({ error: 'Lección no encontrada' });

    await refreshTotalLessons(courseId);

    res.json({ message: 'Lección eliminada exitosamente' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getLessonsByCourse, createLesson, updateLesson, deleteLesson };
