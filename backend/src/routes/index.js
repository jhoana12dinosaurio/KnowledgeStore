const { body, param } = require('express-validator');
const { authenticate, authorize } = require('../middleware/auth');
const { validateRequest } = require('../middleware/errorHandler');

const uuidParam = (name) => param(name).isUUID().withMessage(`${name} inválido`);

// ── Enrollments ──────────────────────────────────────────────────────────────
const enrollRouter = require('express').Router();
const enCtrl = require('../controllers/enrollmentController');

enrollRouter.post('/',
  authenticate,
  body('course_id').isUUID().withMessage('course_id inválido'),
  validateRequest,
  enCtrl.enroll
);
enrollRouter.get('/my', authenticate, enCtrl.myEnrollments);
enrollRouter.get('/:courseId/check', authenticate, uuidParam('courseId'), validateRequest, enCtrl.checkEnrollment);
enrollRouter.patch('/:id/progress',
  authenticate,
  uuidParam('id'),
  body('lesson_id').isUUID().withMessage('lesson_id inválido'),
  body('watch_pct').optional().isFloat({ min: 0, max: 100 }),
  body('completed').optional().isBoolean().toBoolean(),
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
  body('plan_id').isInt({ min: 1 }).withMessage('plan_id inválido'),
  validateRequest,
  pCtrl.subscribe
);
planRouter.delete('/:id', authenticate, uuidParam('id'), validateRequest, pCtrl.cancelSubscription);

// ── Admin ────────────────────────────────────────────────────────────────────
const adminRouter = require('express').Router();
const aCtrl = require('../controllers/adminController');

const adminOnly = [authenticate, authorize('admin')];

adminRouter.get('/stats', ...adminOnly, aCtrl.getDashboardStats);
adminRouter.get('/users', ...adminOnly, aCtrl.getUsers);
adminRouter.patch('/users/:id/toggle', ...adminOnly, uuidParam('id'), validateRequest, aCtrl.toggleUser);
adminRouter.get('/courses', ...adminOnly, aCtrl.getAdminCourses);

// ── Companies / Enterprise ─────────────────────────────────────────────────
const companyRouter = require('express').Router();
const cCtrl = require('../controllers/companyController');

companyRouter.get('/', cCtrl.getCompanies);
companyRouter.get('/:id', uuidParam('id'), validateRequest, cCtrl.getCompanyById);
companyRouter.post('/',
  ...adminOnly,
  body('name').trim().notEmpty().withMessage('El nombre de la empresa es requerido'),
  body('employees').optional({ nullable: true }).isInt({ min: 0 }),
  body('contact_email').optional({ nullable: true }).isEmail(),
  validateRequest,
  cCtrl.createCompany
);
companyRouter.patch('/:id',
  ...adminOnly,
  uuidParam('id'),
  body('name').optional().trim().notEmpty(),
  body('employees').optional({ nullable: true }).isInt({ min: 0 }),
  body('contact_email').optional({ nullable: true }).isEmail(),
  validateRequest,
  cCtrl.updateCompany
);
companyRouter.delete('/:id', ...adminOnly, uuidParam('id'), validateRequest, cCtrl.deleteCompany);

module.exports = { enrollRouter, planRouter, adminRouter, companyRouter };
