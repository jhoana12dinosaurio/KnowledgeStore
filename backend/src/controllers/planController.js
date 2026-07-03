const { query, getClient } = require('../config/database');

// ── GET /api/plans ───────────────────────────────────────────────────────────
const getPlans = async (req, res, next) => {
  try {
    const result = await query(
      `SELECT id, name, plan_type, price_monthly, price_yearly, description, features
       FROM plans WHERE is_active = TRUE ORDER BY price_monthly ASC`
    );
    res.json({ plans: result.rows });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/subscriptions/my ────────────────────────────────────────────────
const mySubscription = async (req, res, next) => {
  try {
    const result = await query(
      `SELECT s.*, p.name AS plan_name, p.plan_type, p.price_monthly, p.features
       FROM subscriptions s
       JOIN plans p ON p.id = s.plan_id
       WHERE s.user_id = $1
         AND (s.ends_at IS NULL OR s.ends_at > NOW())
       ORDER BY s.created_at DESC
       LIMIT 1`,
      [req.user.id]
    );

    res.json({ subscription: result.rows[0] || null });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/subscriptions ──────────────────────────────────────────────────
const subscribe = async (req, res, next) => {
  const client = await getClient();

  try {
    const { plan_id } = req.body;

    await client.query('BEGIN');

    const planRes = await client.query(
      'SELECT * FROM plans WHERE id = $1 AND is_active = TRUE',
      [plan_id]
    );
    if (!planRes.rows.length) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Plan no encontrado' });
    }

    const plan = planRes.rows[0];

    const activeRes = await client.query(
      `SELECT s.*, p.plan_type
       FROM subscriptions s
       JOIN plans p ON p.id = s.plan_id
       WHERE s.user_id = $1 AND (s.ends_at IS NULL OR s.ends_at > NOW())
       ORDER BY s.created_at DESC
       LIMIT 1`,
      [req.user.id]
    );

    if (activeRes.rows.length && activeRes.rows[0].plan_id === Number(plan_id)) {
      await client.query('COMMIT');
      return res.json({
        message: `Ya tienes activo el plan ${plan.name}`,
        subscription: activeRes.rows[0],
      });
    }

    // Cerrar cualquier suscripción activa previa antes de crear una nueva.
    await client.query(
      `UPDATE subscriptions
       SET auto_renew = FALSE, ends_at = NOW()
       WHERE user_id = $1 AND (ends_at IS NULL OR ends_at > NOW())`,
      [req.user.id]
    );

    // Calcular fecha de expiración (+1 mes). El plan básico no expira.
    const endsAt = new Date();
    endsAt.setMonth(endsAt.getMonth() + 1);

    const result = await client.query(
      `INSERT INTO subscriptions (user_id, plan_id, ends_at)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [req.user.id, plan_id, plan.plan_type === 'basic' ? null : endsAt]
    );

    await client.query('COMMIT');

    res.status(201).json({
      message:      `Suscripción al plan ${plan.name} activada`,
      subscription: result.rows[0],
    });
  } catch (err) {
    await client.query('ROLLBACK').catch(() => null);
    next(err);
  } finally {
    client.release();
  }
};

// ── DELETE /api/subscriptions/:id ───────────────────────────────────────────
const cancelSubscription = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await query(
      `UPDATE subscriptions
       SET auto_renew = FALSE, ends_at = NOW()
       WHERE id = $1 AND user_id = $2
       RETURNING id`,
      [id, req.user.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: 'Suscripción no encontrada' });
    }

    res.json({ message: 'Suscripción cancelada' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getPlans, mySubscription, subscribe, cancelSubscription };
