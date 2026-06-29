const { query } = require('../config/database');

// ── GET /api/companies ──────────────────────────────────────────────────────
const getCompanies = async (req, res, next) => {
  try {
    const result = await query(
      `SELECT id, name, industry, description, employees, logo_url, contact_email, created_at
       FROM companies
       ORDER BY employees DESC NULLS LAST, name ASC`
    );

    res.json({ companies: result.rows });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/companies/:id ──────────────────────────────────────────────────
const getCompanyById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query(
      `SELECT id, name, industry, description, employees, logo_url, contact_email, created_at
       FROM companies
       WHERE id = $1`,
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: 'Empresa no encontrada' });
    }

    res.json({ company: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/companies  (solo admin) ───────────────────────────────────────
const createCompany = async (req, res, next) => {
  try {
    const { name, industry, description, employees, logo_url, contact_email } = req.body;

    const result = await query(
      `INSERT INTO companies (name, industry, description, employees, logo_url, contact_email)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, industry, description, employees || null, logo_url || null, contact_email || null]
    );

    res.status(201).json({ company: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /api/companies/:id  (solo admin) ──────────────────────────────────
const updateCompany = async (req, res, next) => {
  try {
    const { id } = req.params;
    const fields = ['name', 'industry', 'description', 'employees', 'logo_url', 'contact_email'];
    const sets = [];
    const params = [];

    for (const field of fields) {
      if (req.body[field] !== undefined) {
        params.push(req.body[field]);
        sets.push(`${field} = $${params.length}`);
      }
    }

    if (!sets.length) {
      return res.status(400).json({ error: 'Nada que actualizar' });
    }

    params.push(id);
    const result = await query(
      `UPDATE companies SET ${sets.join(', ')} WHERE id = $${params.length} RETURNING *`,
      params
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: 'Empresa no encontrada' });
    }

    res.json({ company: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/companies/:id  (solo admin) ─────────────────────────────────
const deleteCompany = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM companies WHERE id = $1 RETURNING id', [id]);

    if (!result.rows.length) {
      return res.status(404).json({ error: 'Empresa no encontrada' });
    }

    res.json({ message: 'Empresa eliminada exitosamente' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getCompanies, getCompanyById, createCompany, updateCompany, deleteCompany };
