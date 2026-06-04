/**
 * seed.js
 * Puebla la base de datos con datos iniciales alineados al frontend.
 * Ejecutar con: npm run db:seed
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const { pool } = require('./database');

// ── Helpers ─────────────────────────────────────────────────────────────────
const slug = (str) =>
  str.toLowerCase()
     .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
     .replace(/[^a-z0-9]+/g, '-')
     .replace(/^-|-$/g, '');

// ── Datos ────────────────────────────────────────────────────────────────────
const categoriesData = [
  { name: 'Desarrollo Web',    description: 'HTML, CSS, JavaScript, frameworks modernos y más' },
  { name: 'Data Science',      description: 'Python, Machine Learning, visualización y análisis de datos' },
  { name: 'Marketing Digital', description: 'SEO, SEM, redes sociales y estrategia digital' },
  { name: 'Inglés',            description: 'Inglés para profesionales, developers y negocios' },
  { name: 'Diseño UX/UI',      description: 'Figma, UX Research, Design Systems y prototipado' },
  { name: 'DevOps & Cloud',    description: 'Docker, Kubernetes, AWS, CI/CD e infraestructura' },
  { name: 'Mobile',            description: 'React Native, Flutter, Swift y Kotlin' },
];

const instructorsData = [
  { name: 'Ana García',      email: 'ana.garcia@learnix.io' },
  { name: 'Carlos Ruiz',     email: 'carlos.ruiz@learnix.io' },
  { name: 'María López',     email: 'maria.lopez@learnix.io' },
  { name: 'Pedro Sánchez',   email: 'pedro.sanchez@learnix.io' },
  { name: 'Laura Martín',    email: 'laura.martin@learnix.io' },
  { name: 'Diego Torres',    email: 'diego.torres@learnix.io' },
  { name: 'Roberto Silva',   email: 'roberto.silva@learnix.io' },
  { name: 'Elena Vargas',    email: 'elena.vargas@learnix.io' },
  { name: 'Miguel Ángel',    email: 'miguel.angel@learnix.io' },
  { name: 'Sofía Ramos',     email: 'sofia.ramos@learnix.io' },
  { name: 'Andrés Mejía',    email: 'andres.mejia@learnix.io' },
  { name: 'Patricia Gómez',  email: 'patricia.gomez@learnix.io' },
  { name: 'Fernando Castro', email: 'fernando.castro@learnix.io' },
  { name: 'Camila Herrera',  email: 'camila.herrera@learnix.io' },
  { name: 'Ricardo Peña',    email: 'ricardo.pena@learnix.io' },
  { name: 'Valentina Cruz',  email: 'valentina.cruz@learnix.io' },
  { name: 'John Smith',      email: 'john.smith@learnix.io' },
  { name: 'Sarah Johnson',   email: 'sarah.johnson@learnix.io' },
  { name: 'Michael Brown',   email: 'michael.brown@learnix.io' },
  { name: 'Emily Davis',     email: 'emily.davis@learnix.io' },
  { name: 'Isabella Moreno', email: 'isabella.moreno@learnix.io' },
  { name: 'Nicolás Fuentes', email: 'nicolas.fuentes@learnix.io' },
  { name: 'Gabriela Ortiz',  email: 'gabriela.ortiz@learnix.io' },
  { name: 'Sebastián Vega',  email: 'sebastian.vega@learnix.io' },
  { name: 'Alejandro Díaz',  email: 'alejandro.diaz@learnix.io' },
  { name: 'Daniela Ríos',    email: 'daniela.rios@learnix.io' },
  { name: 'Martín Acosta',   email: 'martin.acosta@learnix.io' },
  { name: 'Paula Medina',    email: 'paula.medina@learnix.io' },
  { name: 'Jorge Mendoza',   email: 'jorge.mendoza@learnix.io' },
  { name: 'Lucía Fernández', email: 'lucia.fernandez@learnix.io' },
  { name: 'Cristian Torres', email: 'cristian.torres@learnix.io' },
  { name: 'Andrea Guzmán',   email: 'andrea.guzman@learnix.io' },
];

// Coincide 1:1 con allCourses del frontend
const coursesData = [
  { title: 'React desde Cero',            cat: 'Desarrollo Web',    instructor: 'Ana García',       level: 'Principiante', duration: 12,  price: 0,    featured: true,  students: 45200, rating: 4.9 },
  { title: 'Node.js Profesional',         cat: 'Desarrollo Web',    instructor: 'Carlos Ruiz',      level: 'Intermedio',   duration: 18,  price: 29,   featured: false, students: 32100, rating: 4.8 },
  { title: 'TypeScript Avanzado',         cat: 'Desarrollo Web',    instructor: 'María López',      level: 'Avanzado',     duration: 15,  price: 39,   featured: false, students: 18500, rating: 4.7 },
  { title: 'Next.js Full Stack',          cat: 'Desarrollo Web',    instructor: 'Pedro Sánchez',    level: 'Intermedio',   duration: 20,  price: 49,   featured: true,  students: 28900, rating: 4.9 },
  { title: 'CSS Grid y Flexbox',          cat: 'Desarrollo Web',    instructor: 'Laura Martín',     level: 'Principiante', duration: 8,   price: 0,    featured: false, students: 52300, rating: 4.6 },
  { title: 'Vue.js 3 Completo',           cat: 'Desarrollo Web',    instructor: 'Diego Torres',     level: 'Intermedio',   duration: 16,  price: 35,   featured: false, students: 21400, rating: 4.8 },
  { title: 'Python para Data Science',    cat: 'Data Science',      instructor: 'Roberto Silva',    level: 'Principiante', duration: 25,  price: 0,    featured: true,  students: 67800, rating: 4.9 },
  { title: 'Machine Learning Práctico',   cat: 'Data Science',      instructor: 'Elena Vargas',     level: 'Avanzado',     duration: 30,  price: 59,   featured: false, students: 34200, rating: 4.8 },
  { title: 'SQL para Análisis de Datos',  cat: 'Data Science',      instructor: 'Miguel Ángel',     level: 'Principiante', duration: 10,  price: 0,    featured: false, students: 89100, rating: 4.7 },
  { title: 'Visualización con Python',    cat: 'Data Science',      instructor: 'Sofía Ramos',      level: 'Intermedio',   duration: 14,  price: 29,   featured: false, students: 23400, rating: 4.6 },
  { title: 'Deep Learning con TensorFlow',cat: 'Data Science',      instructor: 'Andrés Mejía',     level: 'Avanzado',     duration: 35,  price: 69,   featured: true,  students: 19800, rating: 4.9 },
  { title: 'Google Ads Certificación',    cat: 'Marketing Digital', instructor: 'Patricia Gómez',   level: 'Principiante', duration: 12,  price: 0,    featured: false, students: 56700, rating: 4.8 },
  { title: 'SEO Avanzado 2026',           cat: 'Marketing Digital', instructor: 'Fernando Castro',  level: 'Avanzado',     duration: 18,  price: 45,   featured: true,  students: 41200, rating: 4.9 },
  { title: 'Social Media Marketing',      cat: 'Marketing Digital', instructor: 'Camila Herrera',   level: 'Principiante', duration: 10,  price: 0,    featured: false, students: 78400, rating: 4.5 },
  { title: 'Email Marketing Pro',         cat: 'Marketing Digital', instructor: 'Ricardo Peña',     level: 'Intermedio',   duration: 8,   price: 25,   featured: false, students: 29800, rating: 4.7 },
  { title: 'Analytics y Métricas',        cat: 'Marketing Digital', instructor: 'Valentina Cruz',   level: 'Intermedio',   duration: 14,  price: 35,   featured: false, students: 35600, rating: 4.8 },
  { title: 'Inglés para Developers',      cat: 'Inglés',            instructor: 'John Smith',       level: 'Principiante', duration: 20,  price: 0,    featured: true,  students: 92300, rating: 4.9 },
  { title: 'Business English',            cat: 'Inglés',            instructor: 'Sarah Johnson',    level: 'Intermedio',   duration: 25,  price: 39,   featured: false, students: 45600, rating: 4.8 },
  { title: 'English Conversation',        cat: 'Inglés',            instructor: 'Michael Brown',    level: 'Principiante', duration: 15,  price: 0,    featured: false, students: 67800, rating: 4.7 },
  { title: 'Technical Writing',           cat: 'Inglés',            instructor: 'Emily Davis',      level: 'Avanzado',     duration: 12,  price: 29,   featured: false, students: 18900, rating: 4.6 },
  { title: 'Figma desde Cero',            cat: 'Diseño UX/UI',      instructor: 'Isabella Moreno',  level: 'Principiante', duration: 14,  price: 0,    featured: true,  students: 73400, rating: 4.9 },
  { title: 'UX Research',                 cat: 'Diseño UX/UI',      instructor: 'Nicolás Fuentes',  level: 'Intermedio',   duration: 16,  price: 45,   featured: false, students: 28900, rating: 4.8 },
  { title: 'Design Systems',              cat: 'Diseño UX/UI',      instructor: 'Gabriela Ortiz',   level: 'Avanzado',     duration: 20,  price: 55,   featured: false, students: 19200, rating: 4.7 },
  { title: 'Prototipado Avanzado',        cat: 'Diseño UX/UI',      instructor: 'Sebastián Vega',   level: 'Intermedio',   duration: 12,  price: 35,   featured: false, students: 24500, rating: 4.8 },
  { title: 'Docker y Kubernetes',         cat: 'DevOps & Cloud',    instructor: 'Alejandro Díaz',   level: 'Intermedio',   duration: 22,  price: 49,   featured: true,  students: 38700, rating: 4.9 },
  { title: 'AWS Cloud Practitioner',      cat: 'DevOps & Cloud',    instructor: 'Daniela Ríos',     level: 'Principiante', duration: 18,  price: 0,    featured: false, students: 52100, rating: 4.8 },
  { title: 'CI/CD con GitHub Actions',    cat: 'DevOps & Cloud',    instructor: 'Martín Acosta',    level: 'Intermedio',   duration: 10,  price: 29,   featured: false, students: 21300, rating: 4.7 },
  { title: 'Terraform Infrastructure',    cat: 'DevOps & Cloud',    instructor: 'Paula Medina',     level: 'Avanzado',     duration: 25,  price: 59,   featured: false, students: 15600, rating: 4.8 },
  { title: 'React Native Masterclass',    cat: 'Mobile',            instructor: 'Jorge Mendoza',    level: 'Intermedio',   duration: 28,  price: 55,   featured: true,  students: 41200, rating: 4.9 },
  { title: 'Flutter Completo',            cat: 'Mobile',            instructor: 'Lucía Fernández',  level: 'Principiante', duration: 24,  price: 45,   featured: false, students: 35800, rating: 4.8 },
  { title: 'Swift para iOS',              cat: 'Mobile',            instructor: 'Cristian Torres',  level: 'Intermedio',   duration: 20,  price: 49,   featured: false, students: 18900, rating: 4.7 },
  { title: 'Kotlin Android',              cat: 'Mobile',            instructor: 'Andrea Guzmán',    level: 'Principiante', duration: 22,  price: 0,    featured: false, students: 27400, rating: 4.6 },
];

const plansData = [
  {
    name: 'Básico', plan_type: 'basic', price_monthly: 0,
    description: 'Perfecto para comenzar tu aprendizaje',
    features: ['Acceso a cursos gratuitos','Comunidad de estudiantes','Certificados básicos','Soporte por email'],
  },
  {
    name: 'Pro', plan_type: 'pro', price_monthly: 29,
    description: 'Todo lo que necesitas para crecer profesionalmente',
    features: ['Acceso a todos los cursos','Descargas offline','Certificados verificados','Proyectos prácticos','Mentoría grupal mensual','Soporte prioritario 24/7'],
  },
  {
    name: 'Empresas', plan_type: 'enterprise', price_monthly: 99,
    description: 'Solución completa para equipos y empresas',
    features: ['Todo lo de Pro incluido','Panel de administración','Reportes y analytics','Rutas personalizadas','API de integración','Account manager dedicado','Facturación unificada'],
  },
];

const companiesData = [
  { name: 'Nexa Talent', industry: 'Consultoría en RRHH',  description: 'Mejorando la formación de equipos con proyectos en soft skills y data-driven learning.', employees: 450 },
  { name: 'CloudNova',   industry: 'Cloud & DevOps',         description: 'Capacitación a medida para equipos de infraestructura y automatización de despliegues.',  employees: 230 },
  { name: 'MercaLab',    industry: 'Marketing Digital',      description: 'Workshops especializados para campañas, SEO y análisis de rendimiento comercial.',          employees: 310 },
  { name: 'EduSoft',     industry: 'Software y UX',          description: 'Rutas de aprendizaje en diseño de productos digitales y experiencia de usuario.',           employees: 180 },
];

// ── Seed principal ────────────────────────────────────────────────────────────
async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    console.log('🌱 Iniciando seed...');

    // 1. Categorías
    const catMap = {};
    for (const c of categoriesData) {
      const res = await client.query(
        `INSERT INTO categories (name, slug, description)
         VALUES ($1, $2, $3)
         ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description
         RETURNING id`,
        [c.name, slug(c.name), c.description]
      );
      catMap[c.name] = res.rows[0].id;
    }
    console.log(`  ✔ ${categoriesData.length} categorías`);

    // 2. Instructores (rol = instructor)
    const passwordHash = await bcrypt.hash('Learnix2026!', 12);
    const instrMap = {};
    for (const i of instructorsData) {
      const res = await client.query(
        `INSERT INTO users (name, email, password_hash, role)
         VALUES ($1, $2, $3, 'instructor')
         ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
         RETURNING id`,
        [i.name, i.email, passwordHash]
      );
      instrMap[i.name] = res.rows[0].id;
    }
    console.log(`  ✔ ${instructorsData.length} instructores`);

    // 3. Admin de prueba
    await client.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ('Admin Learnix', 'admin@learnix.io', $1, 'admin')
       ON CONFLICT (email) DO NOTHING`,
      [passwordHash]
    );

    // 4. Estudiante de prueba
    const studentHash = await bcrypt.hash('Student2026!', 12);
    await client.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ('Estudiante Demo', 'demo@learnix.io', $1, 'student')
       ON CONFLICT (email) DO NOTHING`,
      [studentHash]
    );
    console.log('  ✔ Admin y estudiante demo creados');

    // 5. Cursos + lecciones demo
    for (const c of coursesData) {
      const courseSlug = slug(c.title);
      const description = `Aprende ${c.title} con una ruta práctica de nivel ${c.level}. Incluye conceptos clave, ejercicios guiados y aplicación profesional.`;

      const courseRes = await client.query(
        `INSERT INTO courses
           (title, slug, description, category_id, instructor_id, level, price, duration_hrs, featured, status)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'published')
         ON CONFLICT (slug) DO UPDATE
           SET description = EXCLUDED.description,
               category_id = EXCLUDED.category_id,
               instructor_id = EXCLUDED.instructor_id,
               level = EXCLUDED.level,
               price = EXCLUDED.price,
               duration_hrs = EXCLUDED.duration_hrs,
               featured = EXCLUDED.featured
         RETURNING id`,
        [
          c.title, courseSlug, description,
          catMap[c.cat],
          instrMap[c.instructor],
          c.level,
          c.price,
          c.duration,
          c.featured,
        ]
      );

      const courseId = courseRes.rows[0].id;
      const lessons = [
        { title: `Introducción a ${c.title}`, description: 'Objetivos, herramientas y primeros conceptos del curso.', duration: 20, position: 1, isFree: true },
        { title: `Fundamentos prácticos`, description: 'Desarrollo de los temas centrales con ejemplos aplicados.', duration: 35, position: 2, isFree: c.price === 0 },
        { title: `Proyecto final guiado`, description: 'Aplicación integral de lo aprendido en un caso práctico.', duration: 45, position: 3, isFree: false },
      ];

      for (const l of lessons) {
        await client.query(
          `INSERT INTO lessons (course_id, title, description, duration_min, position, is_free)
           VALUES ($1,$2,$3,$4,$5,$6)
           ON CONFLICT (course_id, position) DO UPDATE
             SET title = EXCLUDED.title,
                 description = EXCLUDED.description,
                 duration_min = EXCLUDED.duration_min,
                 is_free = EXCLUDED.is_free`,
          [courseId, l.title, l.description, l.duration, l.position, l.isFree]
        );
      }

      await client.query(
        `UPDATE courses
         SET total_lessons = (SELECT COUNT(*) FROM lessons WHERE course_id = $1)
         WHERE id = $1`,
        [courseId]
      );
    }
    console.log(`  ✔ ${coursesData.length} cursos con lecciones demo`);

    // 6. Planes
    for (const p of plansData) {
      await client.query(
        `INSERT INTO plans (name, plan_type, price_monthly, description, features)
         VALUES ($1,$2,$3,$4,$5)
         ON CONFLICT (plan_type) DO UPDATE
           SET price_monthly = EXCLUDED.price_monthly,
               description   = EXCLUDED.description,
               features      = EXCLUDED.features`,
        [p.name, p.plan_type, p.price_monthly, p.description, JSON.stringify(p.features)]
      );
    }
    console.log(`  ✔ ${plansData.length} planes`);

    // 7. Empresas
    for (const co of companiesData) {
      await client.query(
        `INSERT INTO companies (name, industry, description, employees)
         VALUES ($1,$2,$3,$4)
         ON CONFLICT (name) DO UPDATE
           SET industry = EXCLUDED.industry,
               description = EXCLUDED.description,
               employees = EXCLUDED.employees`,
        [co.name, co.industry, co.description, co.employees]
      );
    }
    console.log(`  ✔ ${companiesData.length} empresas`);

    await client.query('COMMIT');
    console.log('\n✅ Seed completado exitosamente');
    console.log('────────────────────────────────');
    console.log('  👤 Admin:     admin@learnix.io   / Learnix2026!');
    console.log('  👤 Demo:      demo@learnix.io    / Student2026!');
    console.log('  🔑 Instructores: <email>         / Learnix2026!');

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error en seed:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
