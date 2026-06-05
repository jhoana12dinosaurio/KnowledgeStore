const { query } = require('../config/database');

// ── GET /api/courses/:courseId/reviews ───────────────────────────────────────
const getCourseReviews = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const result = await query(
      `SELECT r.id, r.rating, r.comment, r.created_at,
              u.name AS reviewer_name, u.avatar_url
       FROM reviews r
       JOIN users u ON u.id = r.user_id
       WHERE r.course_id = $1
       ORDER BY r.created_at DESC
       LIMIT $2 OFFSET $3`,
      [courseId, parseInt(limit), offset]
    );

    const stats = await query(
      `SELECT
         ROUND(AVG(rating)::numeric,1) AS avg_rating,
         COUNT(*) AS total,
         COUNT(*) FILTER (WHERE rating=5) AS five,
         COUNT(*) FILTER (WHERE rating=4) AS four,
         COUNT(*) FILTER (WHERE rating=3) AS three,
         COUNT(*) FILTER (WHERE rating=2) AS two,
         COUNT(*) FILTER (WHERE rating=1) AS one
       FROM reviews WHERE course_id = $1`,
      [courseId]
    );

    res.json({ reviews: result.rows, stats: stats.rows[0] });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/courses/:courseId/reviews ──────────────────────────────────────
const createReview = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { rating, comment } = req.body;

    // Verificar que el usuario está inscrito
    const enrolled = await query(
      "SELECT id FROM enrollments WHERE user_id=$1 AND course_id=$2 AND status IN ('active','completed')",
      [req.user.id, courseId]
    );
    if (!enrolled.rows.length) {
      return res.status(403).json({ error: 'Debes estar inscrito en el curso para reseñarlo' });
    }

    const result = await query(
      `INSERT INTO reviews (user_id, course_id, rating, comment)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT (user_id, course_id) DO UPDATE
         SET rating = EXCLUDED.rating, comment = EXCLUDED.comment, updated_at = NOW()
       RETURNING *`,
      [req.user.id, courseId, rating, comment]
    );

    res.status(201).json({ review: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

module.exports = { getCourseReviews, createReview };