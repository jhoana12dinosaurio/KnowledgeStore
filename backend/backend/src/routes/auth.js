const router = require('express').Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { validateRequest } = require('../middleware/errorHandler');

// Validaciones reutilizables
const passwordRules = body('password')
  .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres');

// POST /api/auth/register
router.post('/register',
  body('name').trim().notEmpty().withMessage('El nombre es requerido'),
  body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
  passwordRules,
  validateRequest,
  ctrl.register
);

// POST /api/auth/login
router.post('/login',
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  validateRequest,
  ctrl.login
);

// GET /api/auth/me
router.get('/me', authenticate, ctrl.me);

// PATCH /api/auth/me
router.patch('/me',
  authenticate,
  body('name').optional().trim().notEmpty(),
  validateRequest,
  ctrl.updateMe
);

// PATCH /api/auth/change-password
router.patch('/change-password',
  authenticate,
  body('current_password').notEmpty(),
  body('new_password').isLength({ min: 8 }),
  validateRequest,
  ctrl.changePassword
);

module.exports = router;
