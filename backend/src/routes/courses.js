const router = require('express').Router();
const { body } = require('express-validator');
const ctrl   = require('../controllers/courseController');
const rCtrl  = require('../controllers/reviewController');
const { authenticate, authorize, optionalAuth } = require('../middleware/auth');
const { validateRequest } = require('../middleware/errorHandler');

// GET /api/courses/categories
router.get('/categories', ctrl.getCategories);

// GET /api/courses
router.get('/', optionalAuth, ctrl.getCourses);

// GET /api/courses/:slug
router.get('/:slug', optionalAuth, ctrl.getCourseBySlug);

// POST /api/courses  (instructor o admin)
router.post('/',
  authenticate,
  authorize('instructor', 'admin'),
  body('title').trim().notEmpty(),
  body('level').isIn(['Principiante','Intermedio','Avanzado']),
  body('price').optional().isFloat({ min: 0 }),
  validateRequest,
  ctrl.createCourse
);

// PATCH /api/courses/:id
router.patch('/:id',
  authenticate,
  authorize('instructor', 'admin'),
  ctrl.updateCourse
);

// DELETE /api/courses/:id  (solo admin)
router.delete('/:id', authenticate, authorize('admin'), ctrl.deleteCourse);

// ── Reseñas ──────────────────────────────────────────────────────────────────
// GET /api/courses/:courseId/reviews
router.get('/:courseId/reviews', rCtrl.getCourseReviews);

// POST /api/courses/:courseId/reviews
router.post('/:courseId/reviews',
  authenticate,
  body('rating').isInt({ min: 1, max: 5 }),
  validateRequest,
  rCtrl.createReview
);

module.exports = router;