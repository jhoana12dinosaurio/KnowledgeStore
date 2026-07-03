const jwt = require('jsonwebtoken');

const DEV_JWT_SECRET = 'learnix-dev-secret-change-me';

const getJwtSecret = () => {
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET;

  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET es obligatorio en producción');
  }

  return DEV_JWT_SECRET;
};

/**
 * Genera un access token JWT.
 * @param {{ id: string, email: string, role: string }} payload
 */
const generateToken = (payload) =>
  jwt.sign(payload, getJwtSecret(), {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

/**
 * Construye el objeto de respuesta de usuario (sin password).
 */
const userResponse = (user) => ({
  id:         user.id,
  name:       user.name,
  email:      user.email,
  role:       user.role,
  avatar_url: user.avatar_url || null,
  bio:        user.bio        || null,
  created_at: user.created_at,
});

module.exports = { generateToken, getJwtSecret, userResponse };
