const router = require('express').Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { validateRequest } = require('../middleware/errorHandler');
const { createMemoryRateLimiter } = require('../middleware/rateLimit');

const authLimiter = createMemoryRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: 'Demasiados intentos de autenticación. Intenta nuevamente en unos minutos.',
});

// Validaciones reutilizables
const passwordRules = body('password')
  .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres');

// POST /api/auth/register
router.post('/register',
  authLimiter,
  body('name').trim().notEmpty().withMessage('El nombre es requerido'),
  body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
  passwordRules,
  validateRequest,
  ctrl.register
);

// POST /api/auth/login
router.post('/login',
  authLimiter,
  body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
  body('password').notEmpty().withMessage('La contraseña es requerida'),
  validateRequest,
  ctrl.login
);

// GET /api/auth/me
router.get('/me', authenticate, ctrl.me);

// PATCH /api/auth/me
router.patch('/me',
  authenticate,
  body('name').optional().trim().notEmpty(),
  body('bio').optional({ nullable: true }).trim().isLength({ max: 800 }),
  body('avatar_url').optional({ nullable: true }).isURL().withMessage('URL de avatar inválida'),
  validateRequest,
  ctrl.updateMe
);

// PATCH /api/auth/change-password
router.patch('/change-password',
  authenticate,
  body('current_password').notEmpty().withMessage('La contraseña actual es requerida'),
  body('new_password').isLength({ min: 8 }).withMessage('La nueva contraseña debe tener al menos 8 caracteres'),
  validateRequest,
  ctrl.changePassword
);

module.exports = router;
