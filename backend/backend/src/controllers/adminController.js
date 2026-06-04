const { query } = require('../config/database');

// ── GET /api/admin/stats ─────────────────────────────────────────────────────
const getDashboardStats = async (req, res, next) => {
  try {
    const [users, courses, enrollments, revenue] = await Promise.all([
      query("SELECT COUNT(*) AS total, COUNT(*) FILTER (WHERE role='student') AS students, COUNT(*) FILTER (WHERE role='instructor') AS instructors FROM users WHERE active = TRUE"),
      query("SELECT COUNT(*) AS total, COUNT(*) FILTER (WHERE status='published') AS published, COUNT(*) FILTER (WHERE featured=TRUE) AS featured FROM courses"),
      query("SELECT COUNT(*) AS total, COUNT(*) FILTER (WHERE status='completed') AS completed FROM enrollments"),
      query("SELECT COALESCE(SUM(amount),0) AS total FROM payments WHERE status='completed'"),
    ]);

    res.json({
      stats: {
        users:       users.rows[0],
        courses:     courses.rows[0],
        enrollments: enrollments.rows[0],
        revenue:     revenue.rows[0],
      },
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/admin/users ─────────────────────────────────────────────────────
const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const params = [];
    const conds  = [];

    if (role)   { params.push(role);         conds.push(`role = $${params.length}`); }
    if (search) { params.push(`%${search}%`); conds.push(`(name ILIKE $${params.length} OR email ILIKE $${params.length})`); }

    const where = conds.length ? `WHERE ${conds.join(' AND ')}` : '';

    const total = await query(`SELECT COUNT(*) FROM users ${where}`, params);

    params.push(parseInt(limit), offset);
    const result = await query(
      `SELECT id, name, email, role, active, created_at FROM users ${where}
       ORDER BY created_at DESC LIMIT $${params.length-1} OFFSET $${params.length}`,
      params
    );

    res.json({
      users:      result.rows,
      pagination: {
        total:      parseInt(total.rows[0].count),
        page:       parseInt(page),
        limit:      parseInt(limit),
        totalPages: Math.ceil(total.rows[0].count / parseInt(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /api/admin/users/:id/toggle ───────────────────────────────────────
const toggleUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id === req.user.id) {
      return res.status(400).json({ error: 'No puedes desactivar tu propia cuenta' });
    }

    const result = await query(
      'UPDATE users SET active = NOT active WHERE id = $1 RETURNING id, name, email, active',
      [id]
    );

    if (!result.rows.length) return res.status(404).json({ error: 'Usuario no encontrado' });

    res.json({
      message: result.rows[0].active ? 'Usuario activado' : 'Usuario desactivado',
      user:    result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/admin/courses ───────────────────────────────────────────────────
const getAdminCourses = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const total  = await query("SELECT COUNT(*) FROM courses");
    const result = await query(
      `SELECT c.id, c.title, c.slug, c.price, c.level, c.status, c.featured, c.created_at,
              cat.name AS category, u.name AS instructor,
              COALESCE(e.cnt,0) AS enrollments
       FROM courses c
       LEFT JOIN categories cat ON cat.id = c.category_id
       LEFT JOIN users u ON u.id = c.instructor_id
       LEFT JOIN (SELECT course_id, COUNT(*) AS cnt FROM enrollments GROUP BY course_id) e
         ON e.course_id = c.id
       ORDER BY c.created_at DESC
       LIMIT $1 OFFSET $2`,
      [parseInt(limit), offset]
    );

    res.json({
      courses:    result.rows,
      pagination: {
        total:      parseInt(total.rows[0].count),
        page:       parseInt(page),
        limit:      parseInt(limit),
        totalPages: Math.ceil(total.rows[0].count / parseInt(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getDashboardStats, getUsers, toggleUser, getAdminCourses };
