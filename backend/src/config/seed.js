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
  {
    title: 'React desde Cero',
    cat: 'Desarrollo Web',
    instructor: 'Ana García',
    level: 'Principiante',
    duration: 12,
    price: 0,
    featured: true,
    students: 45200,
    rating: 4.9,
    lessons: [
      { title: 'Introducción a React', description: 'Qué es React y por qué elegirlo para construir interfaces modernas.', duration: 15, free: true },
      { title: 'Instalación y entorno', description: 'Configura Node.js, VS Code y crea el proyecto con Vite.', duration: 20, free: true },
      { title: 'JSX y renderizado', description: 'Sintaxis JSX y cómo React renderiza componentes en el DOM.', duration: 25, free: true },
      { title: 'Componentes funcionales', description: 'Crea componentes reutilizables y organiza tu interfaz.', duration: 30, free: false },
      { title: 'Props y comunicación', description: 'Pasa datos entre componentes con props y reutiliza lógica.', duration: 35, free: false },
      { title: 'State local', description: 'Controla el estado con useState y actualiza la UI dinámicamente.', duration: 30, free: false },
      { title: 'Hooks básicos', description: 'Aprende useEffect, useMemo y buenas prácticas de React.', duration: 40, free: false },
      { title: 'React Router', description: 'Agrega navegación entre páginas con React Router.', duration: 35, free: false },
      { title: 'Consumo de APIs', description: 'Solicita datos desde APIs REST y muestra resultados en React.', duration: 40, free: false },
      { title: 'Proyecto final', description: 'Construye una aplicación completa usando React y consumo de datos.', duration: 45, free: false },
    ],
  },
  {
    title: 'Node.js Profesional',
    cat: 'Desarrollo Web',
    instructor: 'Carlos Ruiz',
    level: 'Intermedio',
    duration: 18,
    price: 29,
    featured: false,
    students: 32100,
    rating: 4.8,
    lessons: [
      { title: 'Introducción a Node.js', description: 'Principios del runtime y cómo funciona JavaScript en el servidor.', duration: 20, free: true },
      { title: 'Node Runtime y Event Loop', description: 'Comprende el ciclo de eventos y la arquitectura asíncrona.', duration: 25, free: true },
      { title: 'npm y paquetes', description: 'Gestiona dependencias y scripts con npm.', duration: 20, free: false },
      { title: 'Modularidad en Node', description: 'Organiza tu proyecto con módulos y patterns de diseño.', duration: 30, free: false },
      { title: 'Express y rutas básicas', description: 'Crea servidores HTTP y define rutas con Express.', duration: 35, free: false },
      { title: 'Middleware y errores', description: 'Usa middleware, validación y manejo de errores.', duration: 30, free: false },
      { title: 'Controladores y MVC', description: 'Separa la lógica en controladores y servicios.', duration: 35, free: false },
      { title: 'Autenticación con JWT', description: 'Protege rutas con JSON Web Tokens y usuarios autenticados.', duration: 40, free: false },
      { title: 'PostgreSQL con Node', description: 'Conecta Node.js a PostgreSQL y realiza consultas seguras.', duration: 40, free: false },
      { title: 'Despliegue en producción', description: 'Prepara la app para producción con variables y escalado.', duration: 30, free: false },
      { title: 'Proyecto final', description: 'Construye una API real con autenticación y persistencia.', duration: 45, free: false },
    ],
  },
  {
    title: 'TypeScript Avanzado',
    cat: 'Desarrollo Web',
    instructor: 'María López',
    level: 'Avanzado',
    duration: 15,
    price: 39,
    featured: false,
    students: 18500,
    rating: 4.7,
    lessons: [
      { title: 'Introducción a TypeScript', description: 'Ventajas de TypeScript sobre JavaScript y configuración inicial.', duration: 20, free: true },
      { title: 'Tipos básicos y avanzados', description: 'Trabaja con tipos primitivos, uniones y literales.', duration: 25, free: true },
      { title: 'Interfaces y tipos', description: 'Define contratos sólidos con interfaces y tipos personalizados.', duration: 30, free: false },
      { title: 'Funciones y genéricos', description: 'Crea funciones tipadas y componentes reutilizables con genéricos.', duration: 35, free: false },
      { title: 'Tipos condicionales', description: 'Implementa tipos complejos y condicionales para seguridad adicional.', duration: 30, free: false },
      { title: 'Mapped types', description: 'Transforma tipos y mejora la inferencia del compilador.', duration: 30, free: false },
      { title: 'Decoradores y metaprogramación', description: 'Aplica patrones avanzados para decoradores y reflexión.', duration: 35, free: false },
      { title: 'Integración con React/Node', description: 'Usa TypeScript en proyectos frontend y backend.', duration: 35, free: false },
      { title: 'Testing con TypeScript', description: 'Configura pruebas tipadas con herramientas modernas.', duration: 30, free: false },
      { title: 'Proyecto final', description: 'Crea un proyecto avanzado usando TypeScript en todo el stack.', duration: 45, free: false },
    ],
  },
  {
    title: 'Next.js Full Stack',
    cat: 'Desarrollo Web',
    instructor: 'Pedro Sánchez',
    level: 'Intermedio',
    duration: 20,
    price: 49,
    featured: true,
    students: 28900,
    rating: 4.9,
    lessons: [
      { title: 'Introducción a Next.js', description: 'Arquitectura y ventajas de Next.js para aplicaciones full stack.', duration: 20, free: true },
      { title: 'Páginas y rutas', description: 'Crea páginas, rutas dinámicas y navegación del lado del servidor.', duration: 30, free: true },
      { title: 'Estilos y CSS Modules', description: 'Aplica CSS y estilos modulares en tu app.', duration: 25, free: false },
      { title: 'Data fetching SSR', description: 'Carga datos con getServerSideProps y renderizado en servidor.', duration: 35, free: false },
      { title: 'API Routes', description: 'Define endpoints integrados en tu aplicación Next.js.', duration: 30, free: false },
      { title: 'Autenticación y sesiones', description: 'Protege rutas y gestiona usuarios con autenticación.', duration: 35, free: false },
      { title: 'Base de datos y ORM', description: 'Conecta tu app a una base de datos con Prisma o similar.', duration: 40, free: false },
      { title: 'Implementación full stack', description: 'Sincroniza frontend y backend en una sola app.', duration: 40, free: false },
      { title: 'Despliegue en Vercel', description: 'Prepara y despliega tu aplicación a producción.', duration: 30, free: false },
      { title: 'Proyecto final', description: 'Construye una aplicación full stack completa con Next.js.', duration: 45, free: false },
    ],
  },
  {
    title: 'CSS Grid y Flexbox',
    cat: 'Desarrollo Web',
    instructor: 'Laura Martín',
    level: 'Principiante',
    duration: 8,
    price: 0,
    featured: false,
    students: 52300,
    rating: 4.6,
    lessons: [
      { title: 'Fundamentos de layout', description: 'Entiende cómo funcionan los modelos de caja y los sistemas de diseño.', duration: 15, free: true },
      { title: 'Flexbox básico', description: 'Crea layouts flexibles y controla alineación y distribución.', duration: 20, free: true },
      { title: 'Flexbox avanzado', description: 'Resuelve layouts complejos con flex-wrap y orden.', duration: 25, free: true },
      { title: 'Grid básico', description: 'Define rejillas con CSS Grid y organiza contenido en filas y columnas.', duration: 30, free: false },
      { title: 'Grid avanzado', description: 'Construye diseños responsivos y áreas complejas.', duration: 35, free: false },
      { title: 'Diseño responsivo', description: 'Combina Grid y Flexbox para interfaces adaptables.', duration: 30, free: false },
      { title: 'Animaciones y transiciones', description: 'Mejora tus layouts con interacciones suaves.', duration: 25, free: false },
      { title: 'Buenas prácticas CSS', description: 'Organiza tu CSS y mantiene tus estilos mantenibles.', duration: 25, free: false },
      { title: 'Proyecto final', description: 'Crea una página responsiva usando Grid y Flexbox.', duration: 40, free: false },
    ],
  },
  {
    title: 'Vue.js 3 Completo',
    cat: 'Desarrollo Web',
    instructor: 'Diego Torres',
    level: 'Intermedio',
    duration: 16,
    price: 35,
    featured: false,
    students: 21400,
    rating: 4.8,
    lessons: [
      { title: 'Introducción a Vue 3', description: 'Conoce la filosofía de Vue y la nueva versión 3.', duration: 20, free: true },
      { title: 'Instalación y estructura', description: 'Configura el proyecto y aprende la organización de archivos.', duration: 25, free: true },
      { title: 'Templates y reactividad', description: 'Trabaja con datos reactivos y bindings en Vue.', duration: 30, free: false },
      { title: 'Componentes y props', description: 'Construye componentes y comunica datos entre ellos.', duration: 35, free: false },
      { title: 'Computed y watch', description: 'Optimiza la lógica con propiedades computadas y watchers.', duration: 30, free: false },
      { title: 'Directivas y eventos', description: 'Usa directivas nativas y maneja eventos personalizados.', duration: 30, free: false },
      { title: 'Vue Router', description: 'Agrega navegación en múltiples pantallas.', duration: 35, free: false },
      { title: 'Pinia y estado global', description: 'Gestiona el estado de la aplicación con Pinia.', duration: 40, free: false },
      { title: 'Consumo de APIs', description: 'Solicita datos externos y actualiza la UI.', duration: 40, free: false },
      { title: 'Proyecto final', description: 'Desarrolla una SPA completa con Vue 3.', duration: 45, free: false },
    ],
  },
  {
    title: 'Python para Data Science',
    cat: 'Data Science',
    instructor: 'Roberto Silva',
    level: 'Principiante',
    duration: 25,
    price: 0,
    featured: true,
    students: 67800,
    rating: 4.9,
    lessons: [
      { title: 'Introducción a Python', description: 'Primeros pasos con Python y su uso en Data Science.', duration: 20, free: true },
      { title: 'Variables y estructuras', description: 'Maneja listas, diccionarios y estructuras de datos.', duration: 25, free: true },
      { title: 'Funciones y librerías', description: 'Define funciones y usa bibliotecas clave.', duration: 30, free: true },
      { title: 'Numpy para cálculos', description: 'Manipula arrays y realiza operaciones numéricas.', duration: 35, free: false },
      { title: 'Pandas para datos', description: 'Transforma tablas, filtra y agrupa datos.', duration: 40, free: false },
      { title: 'Limpieza de datos', description: 'Corrige valores faltantes y prepara datos reales.', duration: 35, free: false },
      { title: 'Visualización con Python', description: 'Crea gráficos explicativos con Matplotlib.', duration: 35, free: false },
      { title: 'Análisis exploratorio', description: 'Extrae conclusiones y patrones de tus datasets.', duration: 40, free: false },
      { title: 'Proyecto final', description: 'Realiza un análisis completo de un dataset real.', duration: 45, free: false },
    ],
  },
  {
    title: 'Machine Learning Práctico',
    cat: 'Data Science',
    instructor: 'Elena Vargas',
    level: 'Avanzado',
    duration: 30,
    price: 59,
    featured: false,
    students: 34200,
    rating: 4.8,
    lessons: [
      { title: 'Introducción a Machine Learning', description: 'Conceptos clave y tipos de aprendizaje automático.', duration: 20, free: true },
      { title: 'Preparación de datos', description: 'Limpieza, escalado y selección de características.', duration: 30, free: true },
      { title: 'Regresión lineal', description: 'Modela relaciones continuas y evalúa resultados.', duration: 35, free: false },
      { title: 'Clasificación', description: 'Crea modelos que predicen categorías.', duration: 35, free: false },
      { title: 'Validación y métricas', description: 'Mide el desempeño de tus modelos correctamente.', duration: 30, free: false },
      { title: 'Árboles y ensamblajes', description: 'Usa Random Forest y Boosting para mejorar precisión.', duration: 40, free: false },
      { title: 'Scikit-learn', description: 'Implementa modelos con la librería más usada.', duration: 40, free: false },
      { title: 'Proyecto práctico', description: 'Aplica ML a un caso real con datos reales.', duration: 45, free: false },
      { title: 'Proyecto final', description: 'Desarrolla un pipeline completo de Machine Learning.', duration: 50, free: false },
    ],
  },
  {
    title: 'SQL para Análisis de Datos',
    cat: 'Data Science',
    instructor: 'Miguel Ángel',
    level: 'Principiante',
    duration: 10,
    price: 0,
    featured: false,
    students: 89100,
    rating: 4.7,
    lessons: [
      { title: 'Introducción a SQL', description: 'Conceptos básicos y estructura de consultas SQL.', duration: 20, free: true },
      { title: 'SELECT avanzado', description: 'Filtra, ordena y transforma tus resultados.', duration: 25, free: true },
      { title: 'Joins y relaciones', description: 'Combina tablas para análisis de datos relacionales.', duration: 30, free: false },
      { title: 'Subconsultas', description: 'Anida consultas para explorar datos complejos.', duration: 30, free: false },
      { title: 'Agregaciones', description: 'Calcula totales, promedios y estadísticas.', duration: 30, free: false },
      { title: 'Window functions', description: 'Usa funciones de ventana para análisis avanzado.', duration: 35, free: false },
      { title: 'Optimización', description: 'Mejora el rendimiento de tus consultas SQL.', duration: 30, free: false },
      { title: 'Modelado de datos', description: 'Diseña esquemas eficientes para análisis.', duration: 35, free: false },
      { title: 'Proyecto final', description: 'Resuelve un caso de análisis con SQL real.', duration: 40, free: false },
    ],
  },
  {
    title: 'Visualización con Python',
    cat: 'Data Science',
    instructor: 'Sofía Ramos',
    level: 'Intermedio',
    duration: 14,
    price: 29,
    featured: false,
    students: 23400,
    rating: 4.6,
    lessons: [
      { title: 'Introducción a la visualización', description: 'Principios y mejores prácticas para comunicar datos.', duration: 20, free: true },
      { title: 'Matplotlib básico', description: 'Crea gráficos estáticos con Matplotlib.', duration: 30, free: true },
      { title: 'Gráficos avanzados', description: 'Personaliza visualizaciones y diseño de figuras.', duration: 30, free: false },
      { title: 'Seaborn', description: 'Visualiza distribuciones y relaciones con Seaborn.', duration: 35, free: false },
      { title: 'Plotly interactivo', description: 'Genera gráficos interactivos con Plotly.', duration: 40, free: false },
      { title: 'Dashboards', description: 'Crea dashboards simples para explorar datos.', duration: 40, free: false },
      { title: 'Storytelling de datos', description: 'Cuenta historias usando visualizaciones.', duration: 35, free: false },
      { title: 'Buenas prácticas', description: 'Aplica diseño efectivo y claridad en gráficos.', duration: 30, free: false },
      { title: 'Proyecto final', description: 'Prepara un dashboard completo con datos reales.', duration: 45, free: false },
    ],
  },
  {
    title: 'Deep Learning con TensorFlow',
    cat: 'Data Science',
    instructor: 'Andrés Mejía',
    level: 'Avanzado',
    duration: 35,
    price: 69,
    featured: true,
    students: 19800,
    rating: 4.9,
    lessons: [
      { title: 'Introducción a Deep Learning', description: 'Bases del aprendizaje profundo y redes neuronales.', duration: 25, free: true },
      { title: 'TensorFlow básico', description: 'Configura TensorFlow y crea tu primer modelo.', duration: 30, free: true },
      { title: 'Keras y modelos', description: 'Construye modelos secuenciales y funcionales en Keras.', duration: 35, free: false },
      { title: 'Entrenamiento y optimización', description: 'Ajusta hiperparámetros y mejora el rendimiento.', duration: 40, free: false },
      { title: 'CNN para visión', description: 'Crea redes convolucionales para imágenes.', duration: 40, free: false },
      { title: 'RNN y secuencias', description: 'Trabaja con datos secuenciales y series temporales.', duration: 40, free: false },
      { title: 'Regularización y overfitting', description: 'Evita sobreajuste y mejora generalización.', duration: 35, free: false },
      { title: 'Deploy de modelos', description: 'Publica tu red neuronal en un entorno real.', duration: 40, free: false },
      { title: 'Proyecto final', description: 'Desarrolla un modelo completo con TensorFlow.', duration: 50, free: false },
    ],
  },
  {
    title: 'Google Ads Certificación',
    cat: 'Marketing Digital',
    instructor: 'Patricia Gómez',
    level: 'Principiante',
    duration: 12,
    price: 0,
    featured: false,
    students: 56700,
    rating: 4.8,
    lessons: [
      { title: 'Introducción a Google Ads', description: 'Conceptos clave y estructura de campañas.', duration: 20, free: true },
      { title: 'Configuración de campañas', description: 'Define objetivos y configura tu primera campaña.', duration: 25, free: true },
      { title: 'Keywords y concordancias', description: 'Selecciona palabras clave y tipos de concordancia.', duration: 30, free: false },
      { title: 'Anuncios y extensiones', description: 'Crea anuncios efectivos y usa extensiones.', duration: 30, free: false },
      { title: 'Optimización de pujas', description: 'Ajusta pujas para mejorar el ROI.', duration: 30, free: false },
      { title: 'Medición y conversiones', description: 'Configura seguimiento de conversiones y análisis.', duration: 35, free: false },
      { title: 'Calidad y relevancia', description: 'Mejora el score de interacción y calidad.', duration: 35, free: false },
      { title: 'Auditoría de campañas', description: 'Revisa y optimiza campañas existentes.', duration: 30, free: false },
      { title: 'Proyecto final', description: 'Diseña una campaña completa para certificación.', duration: 40, free: false },
    ],
  },
  {
    title: 'SEO Avanzado 2026',
    cat: 'Marketing Digital',
    instructor: 'Fernando Castro',
    level: 'Avanzado',
    duration: 18,
    price: 45,
    featured: true,
    students: 41200,
    rating: 4.9,
    lessons: [
      { title: 'Introducción a SEO', description: 'Principios del SEO moderno y su importancia en 2026.', duration: 20, free: true },
      { title: 'Auditoría técnica', description: 'Revisa el rendimiento y la estructura de tu sitio.', duration: 30, free: true },
      { title: 'Palabras clave', description: 'Encuentra términos que impulsen tráfico de calidad.', duration: 35, free: false },
      { title: 'E-E-A-T y contenido', description: 'Crea contenido confiable y bien posicionado.', duration: 35, free: false },
      { title: 'SEO On Page', description: 'Optimiza títulos, metadatos y contenido interno.', duration: 30, free: false },
      { title: 'Link building', description: 'Construye enlaces de calidad y autoridad.', duration: 35, free: false },
      { title: 'SEO móvil', description: 'Optimiza para búsquedas mobile y experiencia de usuario.', duration: 30, free: false },
      { title: 'Métricas y reporting', description: 'Mide resultados con analytics y herramientas SEO.', duration: 30, free: false },
      { title: 'Proyecto final', description: 'Prepara una estrategia SEO avanzada para un sitio real.', duration: 40, free: false },
    ],
  },
  {
    title: 'Social Media Marketing',
    cat: 'Marketing Digital',
    instructor: 'Camila Herrera',
    level: 'Principiante',
    duration: 10,
    price: 0,
    featured: false,
    students: 78400,
    rating: 4.5,
    lessons: [
      { title: 'Fundamentos de social media', description: 'Comprende el ecosistema y su impacto en marcas.', duration: 20, free: true },
      { title: 'Estrategia de contenido', description: 'Planifica publicaciones con objetivos claros.', duration: 25, free: true },
      { title: 'Calendario editorial', description: 'Organiza campañas y fechas clave.', duration: 25, free: false },
      { title: 'Publicidad en redes', description: 'Diseña anuncios efectivos y segmentados.', duration: 30, free: false },
      { title: 'Community management', description: 'Gestiona comunidades y conversaciones online.', duration: 30, free: false },
      { title: 'Analítica social', description: 'Mide el rendimiento en cada plataforma.', duration: 30, free: false },
      { title: 'Branding en redes', description: 'Fortalece la identidad de marca con contenido consistente.', duration: 30, free: false },
      { title: 'Campañas creativas', description: 'Ejecuta campañas con creatividad y datos.', duration: 30, free: false },
      { title: 'Proyecto final', description: 'Lanza una estrategia social media completa.', duration: 40, free: false },
    ],
  },
  {
    title: 'Email Marketing Pro',
    cat: 'Marketing Digital',
    instructor: 'Ricardo Peña',
    level: 'Intermedio',
    duration: 8,
    price: 25,
    featured: false,
    students: 29800,
    rating: 4.7,
    lessons: [
      { title: 'Introducción al email marketing', description: 'Conoce el valor del email como canal de conversión.', duration: 20, free: true },
      { title: 'Listas y segmentación', description: 'Crea audiencias efectivas para tus campañas.', duration: 25, free: true },
      { title: 'Copy persuasivo', description: 'Escribe asuntos y contenidos que generan aperturas.', duration: 30, free: false },
      { title: 'Automatizaciones', description: 'Diseña flujos de email para cada etapa del funnel.', duration: 30, free: false },
      { title: 'Diseño de emails', description: 'Construye correos atractivos y responsivos.', duration: 25, free: false },
      { title: 'Pruebas A/B', description: 'Mejora resultados con experimentos controlados.', duration: 30, free: false },
      { title: 'Entregabilidad', description: 'Asegura que tus mensajes lleguen a la bandeja de entrada.', duration: 30, free: false },
      { title: 'Métricas clave', description: 'Analiza aperturas, clics y conversión.', duration: 25, free: false },
      { title: 'Proyecto final', description: 'Lanza una campaña de email marketing de alto impacto.', duration: 40, free: false },
    ],
  },
  {
    title: 'Analytics y Métricas',
    cat: 'Marketing Digital',
    instructor: 'Valentina Cruz',
    level: 'Intermedio',
    duration: 14,
    price: 35,
    featured: false,
    students: 35600,
    rating: 4.8,
    lessons: [
      { title: 'Introducción a analytics', description: 'Principios de medición y análisis para marketing.', duration: 20, free: true },
      { title: 'Google Analytics', description: 'Configura propiedades y métricas esenciales.', duration: 30, free: true },
      { title: 'Eventos y conversiones', description: 'Mide acciones clave de tus usuarios.', duration: 35, free: false },
      { title: 'Segmentación', description: 'Analiza grupos de usuarios para mejores decisiones.', duration: 35, free: false },
      { title: 'Informes y dashboards', description: 'Construye reportes claros y accionables.', duration: 35, free: false },
      { title: 'Funnels y embudos', description: 'Optimiza el recorrido de conversión.', duration: 35, free: false },
      { title: 'KPI para marketing', description: 'Define indicadores relevantes y medibles.', duration: 30, free: false },
      { title: 'Reporting ejecutivo', description: 'Presenta resultados a stakeholders con impacto.', duration: 30, free: false },
      { title: 'Proyecto final', description: 'Realiza un análisis integral de métricas reales.', duration: 45, free: false },
    ],
  },
  {
    title: 'Inglés para Developers',
    cat: 'Inglés',
    instructor: 'John Smith',
    level: 'Principiante',
    duration: 20,
    price: 0,
    featured: true,
    students: 92300,
    rating: 4.9,
    lessons: [
      { title: 'Introducción al inglés técnico', description: 'Vocabulario esencial para developers.', duration: 20, free: true },
      { title: 'Presentaciones técnicas', description: 'Explica proyectos y roles en inglés.', duration: 25, free: true },
      { title: 'Lectura técnica', description: 'Entiende documentación y artículos especializados.', duration: 30, free: false },
      { title: 'Redacción de documentación', description: 'Escribe instrucciones y README claros.', duration: 30, free: false },
      { title: 'Comunicación en equipo', description: 'Participa en reuniones y chats con confianza.', duration: 35, free: false },
      { title: 'Terminología de stacks', description: 'Maneja términos de frontend, backend y DevOps.', duration: 35, free: false },
      { title: 'Entrevistas técnicas', description: 'Responde preguntas comunes en entrevistas.', duration: 35, free: false },
      { title: 'Email profesional', description: 'Redacta emails claros y efectivos.', duration: 30, free: false },
      { title: 'Proyecto final', description: 'Prepara una presentación técnica en inglés.', duration: 40, free: false },
    ],
  },
  {
    title: 'Business English',
    cat: 'Inglés',
    instructor: 'Sarah Johnson',
    level: 'Intermedio',
    duration: 25,
    price: 39,
    featured: false,
    students: 45600,
    rating: 4.8,
    lessons: [
      { title: 'Introducción al inglés de negocios', description: 'Conceptos clave y contexto profesional.', duration: 20, free: true },
      { title: 'Emails corporativos', description: 'Escribe correos claros y profesionales.', duration: 30, free: true },
      { title: 'Reuniones y llamadas', description: 'Participa con confianza en reuniones.', duration: 35, free: false },
      { title: 'Presentaciones efectivas', description: 'Comunica ideas con estructura y claridad.', duration: 35, free: false },
      { title: 'Negociación', description: 'Argumenta propuestas con lenguaje corporativo.', duration: 35, free: false },
      { title: 'Networking', description: 'Conecta con contactos profesionales.', duration: 30, free: false },
      { title: 'Reportes y análisis', description: 'Redacta informes y resúmenes ejecutivos.', duration: 35, free: false },
      { title: 'Cultura empresarial', description: 'Entiende el tono y protocolo en negocios.', duration: 30, free: false },
      { title: 'Proyecto final', description: 'Elabora una propuesta de negocio en inglés.', duration: 45, free: false },
    ],
  },
  {
    title: 'English Conversation',
    cat: 'Inglés',
    instructor: 'Michael Brown',
    level: 'Principiante',
    duration: 15,
    price: 0,
    featured: false,
    students: 67800,
    rating: 4.7,
    lessons: [
      { title: 'Introducción a la conversación', description: 'Claves para hablar con fluidez en inglés.', duration: 20, free: true },
      { title: 'Small talk', description: 'Inicia conversaciones naturales y cotidianas.', duration: 25, free: true },
      { title: 'Debate y opinión', description: 'Expresa ideas y argumentos con seguridad.', duration: 30, free: false },
      { title: 'Acuerdos y desacuerdos', description: 'Usa expresiones para coincidir y disentir.', duration: 30, free: false },
      { title: 'Narrar experiencias', description: 'Cuenta eventos pasados y planes futuros.', duration: 30, free: false },
      { title: 'Vocabulario cotidiano', description: 'Aprende expresiones útiles para el día a día.', duration: 30, free: false },
      { title: 'Fluidez y pronunciación', description: 'Mejora tu pronunciación y ritmo al hablar.', duration: 35, free: false },
      { title: 'Role plays', description: 'Practica diálogos reales en situaciones comunes.', duration: 35, free: false },
      { title: 'Proyecto final', description: 'Realiza una conversación fluida con contexto real.', duration: 40, free: false },
    ],
  },
  {
    title: 'Technical Writing',
    cat: 'Inglés',
    instructor: 'Emily Davis',
    level: 'Avanzado',
    duration: 12,
    price: 29,
    featured: false,
    students: 18900,
    rating: 4.6,
    lessons: [
      { title: 'Introducción al technical writing', description: 'Qué es y por qué es clave en equipos técnicos.', duration: 20, free: true },
      { title: 'Estructura de documentación', description: 'Organiza información para que sea fácil de consumir.', duration: 30, free: true },
      { title: 'Guías y tutoriales', description: 'Escribe instrucciones claras y paso a paso.', duration: 30, free: false },
      { title: 'Especificaciones técnicas', description: 'Redacta requisitos y documentos de producto.', duration: 35, free: false },
      { title: 'Claridad y estilo', description: 'Asegura mensajes simples y directos.', duration: 30, free: false },
      { title: 'Diagramas y ejemplos', description: 'Apoya tu texto con recursos visuales.', duration: 30, free: false },
      { title: 'Revisión y edición', description: 'Mejora la calidad con revisiones efectivas.', duration: 30, free: false },
      { title: 'Publicación y mantenimiento', description: 'Mantén la documentación actualizada y accesible.', duration: 30, free: false },
      { title: 'Proyecto final', description: 'Crea un documento técnico completo y profesional.', duration: 40, free: false },
    ],
  },
  {
    title: 'Figma desde Cero',
    cat: 'Diseño UX/UI',
    instructor: 'Isabella Moreno',
    level: 'Principiante',
    duration: 14,
    price: 0,
    featured: true,
    students: 73400,
    rating: 4.9,
    lessons: [
      { title: 'Introducción a Figma', description: 'Conoce la interfaz y cómo empezar a diseñar.', duration: 20, free: true },
      { title: 'Herramientas básicas', description: 'Domina formas, texto e iconos.', duration: 25, free: true },
      { title: 'Diseño de interfaces', description: 'Crea pantallas y layouts atractivos.', duration: 30, free: false },
      { title: 'Prototipado', description: 'Agrega interacciones y transiciones.', duration: 30, free: false },
      { title: 'Componentes y estilos', description: 'Construye sistemas reutilizables en Figma.', duration: 35, free: false },
      { title: 'Diseño responsivo', description: 'Adapta tus diseños a distintos dispositivos.', duration: 35, free: false },
      { title: 'Colaboración', description: 'Trabaja en equipo y comparte tus archivos.', duration: 30, free: false },
      { title: 'Buenas prácticas UI', description: 'Usa patrones de diseño consistentes y accesibles.', duration: 30, free: false },
      { title: 'Proyecto final', description: 'Crea un prototipo completo y profesional en Figma.', duration: 45, free: false },
    ],
  },
  {
    title: 'UX Research',
    cat: 'Diseño UX/UI',
    instructor: 'Nicolás Fuentes',
    level: 'Intermedio',
    duration: 16,
    price: 45,
    featured: false,
    students: 28900,
    rating: 4.8,
    lessons: [
      { title: 'Introducción a UX Research', description: 'Métodos y objetivos de la investigación de usuario.', duration: 20, free: true },
      { title: 'Conoce a tus usuarios', description: 'Define perfiles y necesidades clave.', duration: 30, free: true },
      { title: 'Entrevistas efectivas', description: 'Diseña y conduce entrevistas cualitativas.', duration: 35, free: false },
      { title: 'Encuestas y tests', description: 'Recolección de datos cuantitativos y cualitativos.', duration: 35, free: false },
      { title: 'Mapeo de experiencia', description: 'Visualiza el recorrido del usuario con mapas.', duration: 35, free: false },
      { title: 'Análisis de insights', description: 'Extrae conclusiones accionables de los datos.', duration: 35, free: false },
      { title: 'Diseño de pruebas', description: 'Crea tests de usabilidad y prototipos validados.', duration: 35, free: false },
      { title: 'Presentación de resultados', description: 'Comunica hallazgos a stakeholders.', duration: 30, free: false },
      { title: 'Proyecto final', description: 'Completa un estudio de UX Research real.', duration: 45, free: false },
    ],
  },
  {
    title: 'Design Systems',
    cat: 'Diseño UX/UI',
    instructor: 'Gabriela Ortiz',
    level: 'Avanzado',
    duration: 20,
    price: 55,
    featured: false,
    students: 19200,
    rating: 4.7,
    lessons: [
      { title: 'Introducción a design systems', description: 'Qué son y por qué son esenciales para equipos grandes.', duration: 20, free: true },
      { title: 'Tokens y estilos', description: 'Define colores, tipografías y espaciados.', duration: 30, free: true },
      { title: 'Componentes reutilizables', description: 'Crea componentes consistentes y accesibles.', duration: 35, free: false },
      { title: 'Bibliotecas de UI', description: 'Organiza y documenta tus componentes.', duration: 35, free: false },
      { title: 'Accesibilidad', description: 'Asegura diseño usable para todos.', duration: 35, free: false },
      { title: 'Escalabilidad', description: 'Mantenible y adaptable para equipos grandes.', duration: 35, free: false },
      { title: 'Gobernanza', description: 'Define reglas para evolución del sistema.', duration: 35, free: false },
      { title: 'Implementación con Figma', description: 'Lleva el design system a tu herramienta de diseño.', duration: 35, free: false },
      { title: 'Proyecto final', description: 'Construye un design system completo y documentado.', duration: 45, free: false },
    ],
  },
  {
    title: 'Prototipado Avanzado',
    cat: 'Diseño UX/UI',
    instructor: 'Sebastián Vega',
    level: 'Intermedio',
    duration: 12,
    price: 35,
    featured: false,
    students: 24500,
    rating: 4.8,
    lessons: [
      { title: 'Introducción al prototipado', description: 'Tipos de prototipos y cuándo usarlos.', duration: 20, free: true },
      { title: 'Wireframes efectivos', description: 'Crea estructuras claras y navegables.', duration: 25, free: true },
      { title: 'Alta fidelidad', description: 'Diseña prototipos con look profesional.', duration: 30, free: false },
      { title: 'Interacciones avanzadas', description: 'Añade animaciones y transiciones realistas.', duration: 35, free: false },
      { title: 'Microinteracciones', description: 'Diseña detalles que mejoran la experiencia.', duration: 30, free: false },
      { title: 'Testeo de prototipos', description: 'Valida con usuarios y mejora el flujo.', duration: 30, free: false },
      { title: 'Herramientas colaborativas', description: 'Trabaja con equipos en tiempo real.', duration: 30, free: false },
      { title: 'Validación de diseño', description: 'Recoge feedback útil y adapta tu prototipo.', duration: 35, free: false },
      { title: 'Proyecto final', description: 'Desarrolla un prototipo avanzado y testeado.', duration: 45, free: false },
    ],
  },
  {
    title: 'Docker y Kubernetes',
    cat: 'DevOps & Cloud',
    instructor: 'Alejandro Díaz',
    level: 'Intermedio',
    duration: 22,
    price: 49,
    featured: true,
    students: 38700,
    rating: 4.9,
    lessons: [
      { title: 'Introducción a Docker', description: 'Conceptos de contenedores y beneficios para desarrollo.', duration: 20, free: true },
      { title: 'Contenedores e imágenes', description: 'Crea y administra contenedores Docker.', duration: 30, free: true },
      { title: 'Dockerfile', description: 'Escribe imágenes reproducibles con Dockerfile.', duration: 35, free: false },
      { title: 'Docker Compose', description: 'Orquesta servicios múltiples localmente.', duration: 35, free: false },
      { title: 'Redes y volúmenes', description: 'Conecta contenedores y persiste datos.', duration: 30, free: false },
      { title: 'Kubernetes básico', description: 'Comprende pods, deployments y cluster.', duration: 35, free: false },
      { title: 'Deploy con Kubernetes', description: 'Despliega aplicaciones en un clúster.', duration: 40, free: false },
      { title: 'Services e Ingress', description: 'Expón tus servicios con Kubernetes.', duration: 35, free: false },
      { title: 'Monitoreo y logs', description: 'Supervisa contenedores y detecta problemas.', duration: 35, free: false },
      { title: 'Proyecto final', description: 'Conteneriza y despliega una app con Docker y Kubernetes.', duration: 45, free: false },
    ],
  },
  {
    title: 'AWS Cloud Practitioner',
    cat: 'DevOps & Cloud',
    instructor: 'Daniela Ríos',
    level: 'Principiante',
    duration: 18,
    price: 0,
    featured: false,
    students: 52100,
    rating: 4.8,
    lessons: [
      { title: 'Introducción a AWS', description: 'Visión general de servicios y casos de uso.', duration: 20, free: true },
      { title: 'Servicios core', description: 'Conoce EC2, S3, RDS y más.', duration: 30, free: true },
      { title: 'IAM y seguridad', description: 'Gestiona usuarios, roles y políticas.', duration: 30, free: false },
      { title: 'Compute con EC2', description: 'Configura instancias y despliega apps.', duration: 35, free: false },
      { title: 'Almacenamiento en S3', description: 'Crea buckets y gestiona objetos.', duration: 30, free: false },
      { title: 'Redes VPC', description: 'Diseña redes seguras en la nube.', duration: 35, free: false },
      { title: 'Bases de datos AWS', description: 'Explora RDS, DynamoDB y servicios administrados.', duration: 35, free: false },
      { title: 'Costos y facturación', description: 'Controla gastos y optimiza recursos.', duration: 30, free: false },
      { title: 'Arquitectura bien diseñada', description: 'Crea soluciones confiables y escalables.', duration: 35, free: false },
      { title: 'Proyecto final', description: 'Construye un diseño arquitectónico en AWS.', duration: 45, free: false },
    ],
  },
  {
    title: 'CI/CD con GitHub Actions',
    cat: 'DevOps & Cloud',
    instructor: 'Martín Acosta',
    level: 'Intermedio',
    duration: 10,
    price: 29,
    featured: false,
    students: 21300,
    rating: 4.7,
    lessons: [
      { title: 'Introducción a CI/CD', description: 'Entiende los conceptos de integración y entrega continua.', duration: 20, free: true },
      { title: 'GitHub Actions', description: 'Conoce la plataforma para automatizar workflows.', duration: 25, free: true },
      { title: 'Workflows en YAML', description: 'Define pipelines con archivos YAML.', duration: 30, free: false },
      { title: 'Jobs y steps', description: 'Organiza tareas y pasos en tu pipeline.', duration: 30, free: false },
      { title: 'Testing automatizado', description: 'Ejecuta pruebas en cada commit.', duration: 30, free: false },
      { title: 'Deploy continuo', description: 'Publica cambios automáticamente a producción.', duration: 35, free: false },
      { title: 'Secretos y seguridad', description: 'Protege credenciales y variables de entorno.', duration: 30, free: false },
      { title: 'Integración con Docker', description: 'Automatiza builds y despliegues con contenedores.', duration: 35, free: false },
      { title: 'Monitorización', description: 'Visualiza el estado de tus pipelines.', duration: 30, free: false },
      { title: 'Proyecto final', description: 'Crea un workflow CI/CD completo en GitHub Actions.', duration: 40, free: false },
    ],
  },
  {
    title: 'Terraform Infrastructure',
    cat: 'DevOps & Cloud',
    instructor: 'Paula Medina',
    level: 'Avanzado',
    duration: 25,
    price: 59,
    featured: false,
    students: 15600,
    rating: 4.8,
    lessons: [
      { title: 'Introducción a Terraform', description: 'Infraestructura como código y flujo de trabajo básico.', duration: 20, free: true },
      { title: 'Instalación y setup', description: 'Configura tu entorno y archivos iniciales.', duration: 25, free: true },
      { title: 'Providers y recursos', description: 'Define recursos en AWS y otros proveedores.', duration: 35, free: false },
      { title: 'Variables y outputs', description: 'Crea configuraciones reutilizables.', duration: 30, free: false },
      { title: 'State y workspaces', description: 'Gestiona estado y entornos de Terraform.', duration: 35, free: false },
      { title: 'Modularización', description: 'Escribe módulos mantenibles y compartibles.', duration: 35, free: false },
      { title: 'AWS con Terraform', description: 'Implementa infraestructura real en AWS.', duration: 35, free: false },
      { title: 'Versionado y CI', description: 'Automatiza la infraestructura con pipelines.', duration: 35, free: false },
      { title: 'Buenas prácticas', description: 'Aplica patrones seguros y sostenibles.', duration: 30, free: false },
      { title: 'Proyecto final', description: 'Construye una infraestructura real con Terraform.', duration: 45, free: false },
    ],
  },
  {
    title: 'React Native Masterclass',
    cat: 'Mobile',
    instructor: 'Jorge Mendoza',
    level: 'Intermedio',
    duration: 28,
    price: 55,
    featured: true,
    students: 41200,
    rating: 4.9,
    lessons: [
      { title: 'Introducción a React Native', description: 'Fundamentos del desarrollo móvil con React Native.', duration: 20, free: true },
      { title: 'Configuración del entorno', description: 'Instala herramientas y configura emuladores.', duration: 30, free: true },
      { title: 'Componentes nativos', description: 'Construye pantallas con componentes React Native.', duration: 35, free: false },
      { title: 'Navegación', description: 'Agrega navegación entre pantallas.', duration: 35, free: false },
      { title: 'State management', description: 'Gestiona estado con hooks y context.', duration: 35, free: false },
      { title: 'APIs y datos', description: 'Consume servicios y muestra contenido dinámico.', duration: 40, free: false },
      { title: 'Estilos responsivos', description: 'Diseña interfaces móviles adaptables.', duration: 35, free: false },
      { title: 'Publicación en stores', description: 'Prepara tu app para App Store y Google Play.', duration: 35, free: false },
      { title: 'Proyecto final', description: 'Desarrolla una app móvil completa con React Native.', duration: 45, free: false },
    ],
  },
  {
    title: 'Flutter Completo',
    cat: 'Mobile',
    instructor: 'Lucía Fernández',
    level: 'Principiante',
    duration: 24,
    price: 45,
    featured: false,
    students: 35800,
    rating: 4.8,
    lessons: [
      { title: 'Introducción a Flutter', description: 'Conoce Flutter y el lenguaje Dart.', duration: 20, free: true },
      { title: 'Dart básico', description: 'Aprende sintaxis y conceptos esenciales de Dart.', duration: 30, free: true },
      { title: 'Widgets y layouts', description: 'Construye interfaces con widgets básicos.', duration: 35, free: false },
      { title: 'State management', description: 'Gestiona estado en aplicaciones Flutter.', duration: 35, free: false },
      { title: 'Navegación', description: 'Maneja rutas y pantallas en Flutter.', duration: 30, free: false },
      { title: 'Consumo de APIs', description: 'Integra datos externos en tus apps.', duration: 35, free: false },
      { title: 'Animaciones', description: 'Crea transiciones y efectos visuales.', duration: 30, free: false },
      { title: 'Deploy móvil', description: 'Publica tu app en tiendas móviles.', duration: 35, free: false },
      { title: 'Proyecto final', description: 'Crea una aplicación Flutter de principio a fin.', duration: 45, free: false },
    ],
  },
  {
    title: 'Swift para iOS',
    cat: 'Mobile',
    instructor: 'Cristian Torres',
    level: 'Intermedio',
    duration: 20,
    price: 49,
    featured: false,
    students: 18900,
    rating: 4.7,
    lessons: [
      { title: 'Introducción a Swift', description: 'Comprende el lenguaje Swift y su ecosistema.', duration: 20, free: true },
      { title: 'Xcode y proyecto', description: 'Configura Xcode y crea tu primer proyecto.', duration: 30, free: true },
      { title: 'Sintaxis y tipos', description: 'Trabaja con variables, estructuras y clases.', duration: 35, free: false },
      { title: 'UI con SwiftUI', description: 'Diseña interfaces declarativas con SwiftUI.', duration: 35, free: false },
      { title: 'Navegación y vistas', description: 'Gestiona stacks y transiciones entre pantallas.', duration: 30, free: false },
      { title: 'State y bindings', description: 'Mantén datos sincronizados en la UI.', duration: 35, free: false },
      { title: 'Networking', description: 'Consume APIs y muestra datos remotos.', duration: 35, free: false },
      { title: 'App Store', description: 'Prepara tu aplicación para publicación.', duration: 30, free: false },
      { title: 'Proyecto final', description: 'Desarrolla una aplicación iOS completa con Swift.', duration: 45, free: false },
    ],
  },
  {
    title: 'Kotlin Android',
    cat: 'Mobile',
    instructor: 'Andrea Guzmán',
    level: 'Principiante',
    duration: 22,
    price: 0,
    featured: false,
    students: 27400,
    rating: 4.6,
    lessons: [
      { title: 'Introducción a Kotlin', description: 'Aprende el lenguaje Kotlin para Android.', duration: 20, free: true },
      { title: 'Android Studio', description: 'Configura el entorno para desarrollo móvil.', duration: 30, free: true },
      { title: 'Layouts XML', description: 'Diseña interfaces con layouts y componentes.', duration: 35, free: false },
      { title: 'Activities y fragments', description: 'Construye pantallas y navegación básica.', duration: 35, free: false },
      { title: 'Navegación', description: 'Gestiona rutas y flujos con la librería Navigation.', duration: 30, free: false },
      { title: 'State y datos', description: 'Mantén y persiste el estado de la aplicación.', duration: 35, free: false },
      { title: 'Retrofit y APIs', description: 'Consume servicios web en Android.', duration: 35, free: false },
      { title: 'Publicación en Play Store', description: 'Prepara tu app para lanzamiento.', duration: 30, free: false },
      { title: 'Proyecto final', description: 'Lanza una app Android completa con Kotlin.', duration: 45, free: false },
    ],
  },
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

      for (const [index, lesson] of c.lessons.entries()) {
        await client.query(
          `INSERT INTO lessons (course_id, title, description, duration_min, position, is_free)
           VALUES ($1,$2,$3,$4,$5,$6)
           ON CONFLICT (course_id, position) DO UPDATE
             SET title = EXCLUDED.title,
                 description = EXCLUDED.description,
                 duration_min = EXCLUDED.duration_min,
                 is_free = EXCLUDED.is_free`,
          [courseId, lesson.title, lesson.description, lesson.duration, index + 1, lesson.free]
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