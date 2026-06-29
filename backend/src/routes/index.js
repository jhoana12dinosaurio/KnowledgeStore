// ── Enrollments ──────────────────────────────────────────────────────────────
const enrollRouter = require('express').Router();
const enCtrl = require('../controllers/enrollmentController');
const { authenticate } = require('../middleware/auth');
const { body } = require('express-validator');
const { validateRequest } = require('../middleware/errorHandler');

enrollRouter.post('/',
  authenticate,
  body('course_id').isUUID(),
  validateRequest,
  enCtrl.enroll
);
enrollRouter.get('/my', authenticate, enCtrl.myEnrollments);
enrollRouter.get('/:courseId/check', authenticate, enCtrl.checkEnrollment);
enrollRouter.patch('/:id/progress',
  authenticate,
  body('lesson_id').isUUID(),
  body('watch_pct').optional().isFloat({ min: 0, max: 100 }),
  validateRequest,
  enCtrl.updateProgress
);

// ── Plans / Subscriptions ────────────────────────────────────────────────────
const planRouter = require('express').Router();
const pCtrl = require('../controllers/planController');

planRouter.get('/', pCtrl.getPlans);
planRouter.get('/my', authenticate, pCtrl.mySubscription);
planRouter.post('/',
  authenticate,
  body('plan_id').isInt(),
  validateRequest,
  pCtrl.subscribe
);
planRouter.delete('/:id', authenticate, pCtrl.cancelSubscription);

// ── Admin ────────────────────────────────────────────────────────────────────
const adminRouter = require('express').Router();
const aCtrl = require('../controllers/adminController');
const { authorize } = require('../middleware/auth');

const adminOnly = [authenticate, authorize('admin')];

adminRouter.get('/stats',           ...adminOnly, aCtrl.getDashboardStats);
adminRouter.get('/users',           ...adminOnly, aCtrl.getUsers);
adminRouter.patch('/users/:id/toggle', ...adminOnly, aCtrl.toggleUser);
adminRouter.get('/courses',         ...adminOnly, aCtrl.getAdminCourses);


// ── Companies / Enterprise ─────────────────────────────────────────────────
const companyRouter = require('express').Router();
const cCtrl = require('../controllers/companyController');

companyRouter.get('/', cCtrl.getCompanies);
companyRouter.get('/:id', cCtrl.getCompanyById);
companyRouter.post('/',
  ...adminOnly,
  body('name').trim().notEmpty().withMessage('El nombre de la empresa es requerido'),
  body('employees').optional().isInt({ min: 0 }),
  body('contact_email').optional().isEmail(),
  validateRequest,
  cCtrl.createCompany
);
companyRouter.patch('/:id',
  ...adminOnly,
  body('name').optional().trim().notEmpty(),
  body('employees').optional().isInt({ min: 0 }),
  body('contact_email').optional().isEmail(),
  validateRequest,
  cCtrl.updateCompany
);
companyRouter.delete('/:id', ...adminOnly, cCtrl.deleteCompany);

module.exports = { enrollRouter, planRouter, adminRouter, companyRouter };
