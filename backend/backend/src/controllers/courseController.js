const { query, getClient } = require('../config/database');

// ── GET /api/courses ─────────────────────────────────────────────────────────
const getCourses = async (req, res, next) => {
  try {
    const {
      category,       // nombre de categoría
      level,          // Principiante | Intermedio | Avanzado
      price,          // free | paid
      featured,       // true
      search,         // texto libre
      page     = 1,
      limit    = 12,
      sort     = 'featured',  // featured | newest | rating | students | price_asc | price_desc
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const params = [];
    const conds  = ["c.status = 'published'"];

    if (category) {
      params.push(category);
      conds.push(`cat.name = $${params.length}`);
    }
    if (level) {
      params.push(level);
      conds.push(`c.level = $${params.length}`);
    }
    if (price === 'free') {
      conds.push('c.price = 0');
    } else if (price === 'paid') {
      conds.push('c.price > 0');
    }
    if (featured === 'true') {
      conds.push('c.featured = TRUE');
    }
    if (search) {
      params.push(`%${search}%`);
      conds.push(`(c.title ILIKE $${params.length} OR cat.name ILIKE $${params.length} OR u.name ILIKE $${params.length})`);
    }

    const whereClause = conds.length ? `WHERE ${conds.join(' AND ')}` : '';

    const sortMap = {
      featured:    'c.featured DESC, COALESCE(cr.avg_rating,0) DESC',
      newest:      'c.created_at DESC',
      rating:      'COALESCE(cr.avg_rating,0) DESC',
      students:    'COALESCE(e.cnt,0) DESC',
      price_asc:   'c.price ASC',
      price_desc:  'c.price DESC',
    };
    const orderBy = sortMap[sort] || sortMap.featured;

    const baseSQL = `
      FROM courses c
      LEFT JOIN categories cat ON cat.id = c.category_id
      LEFT JOIN users u        ON u.id   = c.instructor_id
      LEFT JOIN (
        SELECT course_id, ROUND(AVG(rating)::numeric,1) AS avg_rating, COUNT(*) AS total_reviews
        FROM reviews GROUP BY course_id
      ) cr ON cr.course_id = c.id
      LEFT JOIN (
        SELECT course_id, COUNT(*) AS cnt FROM enrollments GROUP BY course_id
      ) e ON e.course_id = c.id
      ${whereClause}
    `;

    // Total para paginación
    const countRes = await query(`SELECT COUNT(*) ${baseSQL}`, params);
    const total    = parseInt(countRes.rows[0].count);

    // Datos
    params.push(parseInt(limit), offset);
    const dataRes = await query(
      `SELECT
         c.id, c.title, c.slug, c.price, c.level, c.duration_hrs,
         c.featured, c.thumbnail_url, c.created_at,
         cat.name                          AS category,
         u.name                            AS instructor,
         COALESCE(cr.avg_rating, 0)        AS rating,
         COALESCE(cr.total_reviews, 0)     AS total_reviews,
         COALESCE(e.cnt, 0)                AS total_students
       ${baseSQL}
       ORDER BY ${orderBy}
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    res.json({
      data:       dataRes.rows,
      pagination: {
        total,
        page:       parseInt(page),
        limit:      parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/courses/:slug ───────────────────────────────────────────────────
const getCourseBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const result = await query(
      `SELECT
         c.*,
         cat.name                       AS category,
         u.id                           AS instructor_id,
         u.name                         AS instructor_name,
         u.bio                          AS instructor_bio,
         u.avatar_url                   AS instructor_avatar,
         COALESCE(cr.avg_rating,  0)    AS rating,
         COALESCE(cr.total_reviews, 0)  AS total_reviews,
         COALESCE(e.cnt, 0)             AS total_students
       FROM courses c
       LEFT JOIN categories cat ON cat.id = c.category_id
       LEFT JOIN users u        ON u.id   = c.instructor_id
       LEFT JOIN (
         SELECT course_id, ROUND(AVG(rating)::numeric,1) AS avg_rating, COUNT(*) AS total_reviews
         FROM reviews GROUP BY course_id
       ) cr ON cr.course_id = c.id
       LEFT JOIN (
         SELECT course_id, COUNT(*) AS cnt FROM enrollments GROUP BY course_id
       ) e ON e.course_id = c.id
       WHERE c.slug = $1 AND c.status = 'published'`,
      [slug]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }

    const course = result.rows[0];

    // Lecciones (con flag de acceso libre)
    const lessons = await query(
      `SELECT id, title, description, duration_min, position, is_free
       FROM lessons WHERE course_id = $1 ORDER BY position`,
      [course.id]
    );

    // Reseñas recientes
    const reviews = await query(
      `SELECT r.rating, r.comment, r.created_at, u.name AS reviewer_name, u.avatar_url
       FROM reviews r
       JOIN users u ON u.id = r.user_id
       WHERE r.course_id = $1
       ORDER BY r.created_at DESC
       LIMIT 5`,
      [course.id]
    );

    res.json({
      course: {
        ...course,
        lessons:  lessons.rows,
        reviews:  reviews.rows,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/courses  (admin/instructor) ────────────────────────────────────
const createCourse = async (req, res, next) => {
  try {
    const {
      title, description, category_id,
      level, price, duration_hrs,
      thumbnail_url, preview_url, featured,
    } = req.body;

    const slugStr = title.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const result = await query(
      `INSERT INTO courses
         (title, slug, description, category_id, instructor_id,
          level, price, duration_hrs, thumbnail_url, preview_url, featured, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'published')
       RETURNING *`,
      [
        title, slugStr, description, category_id,
        req.user.id, level, price || 0,
        duration_hrs || 0, thumbnail_url, preview_url,
        featured || false,
      ]
    );

    res.status(201).json({ course: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /api/courses/:id  (admin/instructor propietario) ───────────────────
const updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verificar propiedad
    const own = await query('SELECT instructor_id FROM courses WHERE id = $1', [id]);
    if (!own.rows.length) return res.status(404).json({ error: 'Curso no encontrado' });
    if (own.rows[0].instructor_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'No tienes permiso para editar este curso' });
    }

    const fields = ['title','description','category_id','level','price',
                    'duration_hrs','thumbnail_url','preview_url','featured','status'];
    const sets   = [];
    const params = [];

    for (const f of fields) {
      if (req.body[f] !== undefined) {
        params.push(req.body[f]);
        sets.push(`${f} = $${params.length}`);
      }
    }

    if (!sets.length) return res.status(400).json({ error: 'Nada que actualizar' });

    params.push(id);
    const result = await query(
      `UPDATE courses SET ${sets.join(', ')} WHERE id = $${params.length} RETURNING *`,
      params
    );

    res.json({ course: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/courses/:id  (admin) ────────────────────────────────────────
const deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    await query("UPDATE courses SET status = 'archived' WHERE id = $1", [id]);
    res.json({ message: 'Curso archivado exitosamente' });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/courses/categories ──────────────────────────────────────────────
const getCategories = async (req, res, next) => {
  try {
    const result = await query(
      `SELECT cat.id, cat.name, cat.slug, cat.description,
              COUNT(c.id) AS course_count
       FROM categories cat
       LEFT JOIN courses c ON c.category_id = cat.id AND c.status = 'published'
       GROUP BY cat.id
       ORDER BY cat.name`
    );
    res.json({ categories: result.rows });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCourses, getCourseBySlug,
  createCourse, updateCourse, deleteCourse,
  getCategories,
};
