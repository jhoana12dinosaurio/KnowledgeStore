# Backend Learnix / KnowledgeStore

Backend desarrollado con Node.js, Express y PostgreSQL para una plataforma de cursos online.

## Requisitos

- Node.js 18+
- PostgreSQL 14+
- npm

## Instalación

```bash
cd backend/backend
npm install
```

## Configuración

Copia el archivo de ejemplo:

```bash
cp .env.example .env
```

Configura tus variables:

```env
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
DB_HOST=localhost
DB_PORT=5432
DB_NAME=learnix_db
DB_USER=postgres
DB_PASSWORD=tu_password
JWT_SECRET=cambia_esto_por_una_clave_larga_y_segura
JWT_EXPIRES_IN=7d
```

Crea la base de datos en PostgreSQL:

```sql
CREATE DATABASE learnix_db;
```

## Migraciones y datos iniciales

```bash
npm run db:migrate
npm run db:seed
```

Usuarios de prueba generados por el seed:

```txt
Admin:      admin@learnix.io / Learnix2026!
Estudiante: demo@learnix.io  / Student2026!
Instructores: revisar correos en src/config/seed.js / Learnix2026!
```

## Ejecutar servidor

```bash
npm run dev
```

Servidor:

```txt
http://localhost:3000
```

Health check:

```txt
GET http://localhost:3000/health
```

## Endpoints principales

### Auth

```txt
POST  /api/auth/register
POST  /api/auth/login
GET   /api/auth/me
PATCH /api/auth/me
PATCH /api/auth/change-password
```

### Cursos

```txt
GET    /api/courses
GET    /api/courses/categories
GET    /api/courses/:slug
POST   /api/courses
PATCH  /api/courses/:id
DELETE /api/courses/:id
```

### Lecciones

```txt
GET    /api/courses/:courseId/lessons
POST   /api/courses/:courseId/lessons
PATCH  /api/courses/:courseId/lessons/:lessonId
DELETE /api/courses/:courseId/lessons/:lessonId
```

### Reseñas

```txt
GET  /api/courses/:courseId/reviews
POST /api/courses/:courseId/reviews
```

### Inscripciones

```txt
POST  /api/enrollments
GET   /api/enrollments/my
GET   /api/enrollments/:courseId/check
PATCH /api/enrollments/:id/progress
```

### Planes / Suscripciones

```txt
GET    /api/plans
GET    /api/subscriptions/my
POST   /api/subscriptions
DELETE /api/subscriptions/:id
```

### Empresas

```txt
GET    /api/companies
GET    /api/companies/:id
POST   /api/companies
PATCH  /api/companies/:id
DELETE /api/companies/:id
```

### Admin

```txt
GET   /api/admin/stats
GET   /api/admin/users
PATCH /api/admin/users/:id/toggle
GET   /api/admin/courses
```

## Autenticación

Las rutas privadas requieren JWT en el header:

```txt
Authorization: Bearer <token>
```

## Cambios realizados para completar backend

- Se agregó `package.json` propio para el backend.
- Se cambió el backend a CommonJS con `"type": "commonjs"`.
- Se agregó `.env.example` y se retiró `.env` del entregable.
- Se agregó `.env` al `.gitignore`.
- Se agregaron endpoints de empresas para la sección Enterprise.
- Se agregaron endpoints CRUD de lecciones.
- Se mejoró el seed para crear descripciones y lecciones demo para cada curso.
- Se corrigió la tabla `companies` para evitar duplicados por nombre.
- Se ajustó `payments.user_id` para que sea coherente con `ON DELETE SET NULL`.
