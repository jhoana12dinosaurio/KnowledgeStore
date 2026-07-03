const jwt = require('jsonwebtoken');
const { query } = require('../config/database');
const { getJwtSecret } = require('../utils/jwt');

/**
 * Verifica el JWT del header Authorization: Bearer <token>
 * Adjunta req.user con { id, email, role }
 */
const authenticate = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token de autenticación requerido' });
  }

  const token = header.slice(7);

  try {
    const payload = jwt.verify(token, getJwtSecret());

    // Verificar que el usuario sigue activo en BD
    const result = await query(
      'SELECT id, email, role, active FROM users WHERE id = $1',
      [payload.id]
    );

    if (!result.rows.length || !result.rows[0].active) {
      return res.status(401).json({ error: 'Usuario no encontrado o inactivo' });
    }

    req.user = result.rows[0];
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    }
    return res.status(401).json({ error: 'Token inválido' });
  }
};

/**
 * Requiere uno o varios roles específicos.
 * Usar después de authenticate.
 */
const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      error: `Acceso denegado. Se requiere rol: ${roles.join(' o ')}`,
    });
  }
  next();
};

/**
 * Middleware opcional: adjunta el usuario si hay token, pero no bloquea.
 */
const optionalAuth = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return next();

  try {
    const payload = jwt.verify(header.slice(7), getJwtSecret());
    const result  = await query('SELECT id, email, role, active FROM users WHERE id = $1', [payload.id]);
    if (result.rows.length && result.rows[0].active) req.user = result.rows[0];
  } catch (_) { /* silencioso */ }

  next();
};

module.exports = { authenticate, authorize, optionalAuth };