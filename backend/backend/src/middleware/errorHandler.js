const { validationResult } = require('express-validator');

/**
 * Maneja errores de express-validator.
 * Usar como middleware después de los validators.
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: 'Datos de entrada inválidos',
      details: errors.array().map(e => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

/**
 * Middleware global de errores. Debe ser el último app.use().
 */
const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);

  // Error de restricción única en PostgreSQL (e.g. email duplicado)
  if (err.code === '23505') {
    return res.status(409).json({ error: 'El recurso ya existe (duplicado)' });
  }

  // Error de FK violation
  if (err.code === '23503') {
    return res.status(400).json({ error: 'Referencia inválida (foreign key)' });
  }

  const status = err.status || 500;
  res.status(status).json({
    error: status === 500 ? 'Error interno del servidor' : err.message,
  });
};

/**
 * Ruta no encontrada — 404.
 */
const notFound = (req, res) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.path}` });
};

module.exports = { validateRequest, errorHandler, notFound };
