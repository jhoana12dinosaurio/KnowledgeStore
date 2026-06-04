const jwt = require('jsonwebtoken');

/**
 * Genera un access token JWT.
 * @param {{ id: string, email: string, role: string }} payload
 */
const generateToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, {
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

module.exports = { generateToken, userResponse };
