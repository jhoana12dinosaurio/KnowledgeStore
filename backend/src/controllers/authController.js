const bcrypt = require('bcryptjs');
const { query } = require('../config/database');
const { generateToken, userResponse } = require('../utils/jwt');

// ── POST /api/auth/register ──────────────────────────────────────────────────
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Verificar si el email ya existe
    const exists = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (exists.rows.length) {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }

    const password_hash = await bcrypt.hash(password, 12);

    const result = await query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, 'student')
       RETURNING id, name, email, role, avatar_url, bio, created_at`,
      [name.trim(), email.toLowerCase().trim(), password_hash]
    );

    const user  = result.rows[0];
    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    res.status(201).json({
      message: 'Registro exitoso',
      token,
      user: userResponse(user),
    });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/auth/login ─────────────────────────────────────────────────────
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await query(
      `SELECT id, name, email, password_hash, role, avatar_url, bio, active, created_at
       FROM users WHERE email = $1`,
      [email.toLowerCase().trim()]
    );

    if (!result.rows.length) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = result.rows[0];

    if (!user.active) {
      return res.status(403).json({ error: 'Cuenta desactivada. Contacta soporte.' });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: userResponse(user),
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/auth/me ─────────────────────────────────────────────────────────
const me = async (req, res, next) => {
  try {
    const result = await query(
      `SELECT id, name, email, role, avatar_url, bio, created_at
       FROM users WHERE id = $1`,
      [req.user.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ user: userResponse(result.rows[0]) });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /api/auth/me ───────────────────────────────────────────────────────
const updateMe = async (req, res, next) => {
  try {
    const { name, bio, avatar_url } = req.body;

    const result = await query(
      `UPDATE users
       SET name       = COALESCE($1, name),
           bio        = COALESCE($2, bio),
           avatar_url = COALESCE($3, avatar_url)
       WHERE id = $4
       RETURNING id, name, email, role, avatar_url, bio, created_at`,
      [name, bio, avatar_url, req.user.id]
    );

    res.json({ user: userResponse(result.rows[0]) });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /api/auth/change-password ─────────────────────────────────────────
const changePassword = async (req, res, next) => {
  try {
    const { current_password, new_password } = req.body;

    const result = await query(
      'SELECT password_hash FROM users WHERE id = $1',
      [req.user.id]
    );

    const match = await bcrypt.compare(current_password, result.rows[0].password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Contraseña actual incorrecta' });
    }

    const new_hash = await bcrypt.hash(new_password, 12);
    await query('UPDATE users SET password_hash = $1 WHERE id = $2', [new_hash, req.user.id]);

    res.json({ message: 'Contraseña actualizada exitosamente' });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, me, updateMe, changePassword };