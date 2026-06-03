require('dotenv').config();
const express  = require('express');
const helmet   = require('helmet');
const cors     = require('cors');
const morgan   = require('morgan');

const authRoutes             = require('./routes/auth');
const courseRoutes           = require('./routes/courses');
const { enrollRouter, planRouter, adminRouter } = require('./routes/index');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Seguridad y utilidades ────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin:      process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods:     ['GET','POST','PATCH','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status:  'ok',
    service: 'Learnix API',
    version: '1.0.0',
    time:    new Date().toISOString(),
  });
});

// ── Rutas principales ─────────────────────────────────────────────────────────
app.use('/api/auth',          authRoutes);
app.use('/api/courses',       courseRoutes);
app.use('/api/enrollments',   enrollRouter);
app.use('/api/subscriptions', planRouter);
app.use('/api/plans',         planRouter);
app.use('/api/admin',         adminRouter);

// ── 404 y manejo de errores ───────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Iniciar servidor ──────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Learnix API corriendo en http://localhost:${PORT}`);
  console.log(`📋 Endpoints disponibles:`);
  console.log(`   POST   /api/auth/register`);
  console.log(`   POST   /api/auth/login`);
  console.log(`   GET    /api/auth/me`);
  console.log(`   GET    /api/courses`);
  console.log(`   GET    /api/courses/:slug`);
  console.log(`   GET    /api/courses/categories`);
  console.log(`   GET    /api/plans`);
  console.log(`   POST   /api/enrollments`);
  console.log(`   GET    /api/enrollments/my`);
  console.log(`   GET    /api/admin/stats`);
  console.log(`\n🔑 Health check: http://localhost:${PORT}/health\n`);
});

module.exports = app;
