/**
 * migrate.js
 * Crea todas las tablas de la base de datos Learnix.
 * Ejecutar con: npm run db:migrate
 */

require('dotenv').config();
const { pool } = require('./database');

const migrations = `

-- ════════════════════════════════════════════
--  EXTENSIONES
-- ════════════════════════════════════════════
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ════════════════════════════════════════════
--  TIPOS ENUM
-- ════════════════════════════════════════════
DO $$ BEGIN
  CREATE TYPE user_role      AS ENUM ('student', 'instructor', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE course_level   AS ENUM ('Principiante', 'Intermedio', 'Avanzado');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE course_status  AS ENUM ('draft', 'published', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE plan_type      AS ENUM ('basic', 'pro', 'enterprise');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE enrollment_status AS ENUM ('active', 'completed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ════════════════════════════════════════════
--  USUARIOS
-- ════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS users (
  id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(120)  NOT NULL,
  email         VARCHAR(255)  NOT NULL UNIQUE,
  password_hash VARCHAR(255)  NOT NULL,
  role          user_role     NOT NULL DEFAULT 'student',
  avatar_url    TEXT,
  bio           TEXT,
  active        BOOLEAN       NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role  ON users(role);

-- ════════════════════════════════════════════
--  CATEGORÍAS
-- ════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS categories (
  id          SERIAL        PRIMARY KEY,
  name        VARCHAR(100)  NOT NULL UNIQUE,
  slug        VARCHAR(100)  NOT NULL UNIQUE,
  description TEXT,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ════════════════════════════════════════════
--  CURSOS
-- ════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS courses (
  id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  title         VARCHAR(200)  NOT NULL,
  slug          VARCHAR(220)  NOT NULL UNIQUE,
  description   TEXT,
  category_id   INT           REFERENCES categories(id) ON DELETE SET NULL,
  instructor_id UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  level         course_level  NOT NULL DEFAULT 'Principiante',
  status        course_status NOT NULL DEFAULT 'draft',
  price         NUMERIC(10,2) NOT NULL DEFAULT 0,   -- 0 = gratis
  duration_hrs  NUMERIC(5,1)  NOT NULL DEFAULT 0,
  thumbnail_url TEXT,
  preview_url   TEXT,
  featured      BOOLEAN       NOT NULL DEFAULT FALSE,
  total_lessons INT           NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_courses_category    ON courses(category_id);
CREATE INDEX IF NOT EXISTS idx_courses_instructor  ON courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_courses_status      ON courses(status);
CREATE INDEX IF NOT EXISTS idx_courses_featured    ON courses(featured);

-- ════════════════════════════════════════════
--  LECCIONES
-- ════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS lessons (
  id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id    UUID         NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title        VARCHAR(200) NOT NULL,
  description  TEXT,
  video_url    TEXT,
  duration_min INT          NOT NULL DEFAULT 0,  -- minutos
  position     INT          NOT NULL DEFAULT 1,
  is_free      BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  UNIQUE (course_id, position)
);

CREATE INDEX IF NOT EXISTS idx_lessons_course ON lessons(course_id);

-- ════════════════════════════════════════════
--  MEMBRESÍAS / PLANES
-- ════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS plans (
  id              SERIAL        PRIMARY KEY,
  name            VARCHAR(60)   NOT NULL UNIQUE,
  plan_type       plan_type     NOT NULL UNIQUE,
  price_monthly   NUMERIC(10,2) NOT NULL DEFAULT 0,
  price_yearly    NUMERIC(10,2),
  description     TEXT,
  features        JSONB         NOT NULL DEFAULT '[]',
  is_active       BOOLEAN       NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ════════════════════════════════════════════
--  SUSCRIPCIONES DE USUARIOS
-- ════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS subscriptions (
  id             UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_id        INT          NOT NULL REFERENCES plans(id),
  starts_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  ends_at        TIMESTAMPTZ,
  auto_renew     BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan ON subscriptions(plan_id);

-- ════════════════════════════════════════════
--  INSCRIPCIONES A CURSOS
-- ════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS enrollments (
  id              UUID              PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID              NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id       UUID              NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  status          enrollment_status NOT NULL DEFAULT 'active',
  progress_pct    NUMERIC(5,2)      NOT NULL DEFAULT 0,
  enrolled_at     TIMESTAMPTZ       NOT NULL DEFAULT NOW(),
  completed_at    TIMESTAMPTZ,
  UNIQUE (user_id, course_id)
);

CREATE INDEX IF NOT EXISTS idx_enrollments_user   ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);

-- ════════════════════════════════════════════
--  PROGRESO DE LECCIONES
-- ════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS lesson_progress (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id    UUID        NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed    BOOLEAN     NOT NULL DEFAULT FALSE,
  watch_pct    NUMERIC(5,2) NOT NULL DEFAULT 0,
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, lesson_id)
);

-- ════════════════════════════════════════════
--  RESEÑAS
-- ════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS reviews (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id    UUID        NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  rating       SMALLINT    NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment      TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, course_id)
);

CREATE INDEX IF NOT EXISTS idx_reviews_course ON reviews(course_id);

-- ════════════════════════════════════════════
--  PAGOS
-- ════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS payments (
  id               UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID           REFERENCES users(id) ON DELETE SET NULL,
  course_id        UUID           REFERENCES courses(id) ON DELETE SET NULL,
  subscription_id  UUID           REFERENCES subscriptions(id) ON DELETE SET NULL,
  amount           NUMERIC(10,2)  NOT NULL,
  currency         CHAR(3)        NOT NULL DEFAULT 'USD',
  status           payment_status NOT NULL DEFAULT 'pending',
  provider         VARCHAR(50)    NOT NULL DEFAULT 'stripe',
  provider_tx_id   VARCHAR(255),
  metadata         JSONB          DEFAULT '{}',
  created_at       TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_user   ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- ════════════════════════════════════════════
--  CERTIFICADOS
-- ════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS certificates (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id    UUID        NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  issued_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  cert_url     TEXT,
  UNIQUE (user_id, course_id)
);

-- ════════════════════════════════════════════
--  EMPRESAS (plan enterprise)
-- ════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS companies (
  id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  name         VARCHAR(150) NOT NULL UNIQUE,
  industry     VARCHAR(100),
  description  TEXT,
  employees    INT,
  logo_url     TEXT,
  contact_email VARCHAR(255),
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS company_members (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id   UUID        NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  user_id      UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role         VARCHAR(60) NOT NULL DEFAULT 'member',
  joined_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (company_id, user_id)
);

-- ════════════════════════════════════════════
--  TRIGGER: updated_at automático
-- ════════════════════════════════════════════
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['users','courses','lessons','subscriptions','enrollments','reviews','payments'] LOOP
    EXECUTE format('
      DROP TRIGGER IF EXISTS trg_%1$s_updated_at ON %1$s;
      CREATE TRIGGER trg_%1$s_updated_at
        BEFORE UPDATE ON %1$s
        FOR EACH ROW EXECUTE FUNCTION update_updated_at();
    ', t);
  END LOOP;
END $$;

-- ════════════════════════════════════════════
--  VISTA: rating promedio por curso
-- ════════════════════════════════════════════
CREATE OR REPLACE VIEW course_ratings AS
SELECT
  course_id,
  ROUND(AVG(rating)::numeric, 1) AS avg_rating,
  COUNT(*)                        AS total_reviews
FROM reviews
GROUP BY course_id;

-- ════════════════════════════════════════════
--  VISTA: estadísticas de inscripciones
-- ════════════════════════════════════════════
CREATE OR REPLACE VIEW course_stats AS
SELECT
  c.id,
  c.title,
  c.slug,
  c.price,
  c.featured,
  c.status,
  cat.name        AS category,
  u.name          AS instructor,
  COALESCE(cr.avg_rating, 0)     AS rating,
  COALESCE(cr.total_reviews, 0)  AS total_reviews,
  COALESCE(e.total_students, 0)  AS total_students
FROM courses c
LEFT JOIN categories          cat ON cat.id   = c.category_id
LEFT JOIN users               u   ON u.id     = c.instructor_id
LEFT JOIN course_ratings      cr  ON cr.course_id = c.id
LEFT JOIN (
  SELECT course_id, COUNT(*) AS total_students
  FROM enrollments
  GROUP BY course_id
) e ON e.course_id = c.id;
`;

async function migrate() {
  const client = await pool.connect();
  try {
    console.log('🔄 Ejecutando migraciones...');
    await client.query(migrations);
    console.log('✅ Migraciones completadas exitosamente');
  } catch (err) {
    console.error('❌ Error en migración:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();