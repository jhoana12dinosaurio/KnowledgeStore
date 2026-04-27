import { useState, useMemo } from 'react';
import './App.css';

// Datos de cursos por categoría
const allCourses = [
  // Desarrollo Web
  { 
    id: 1, 
    title: 'React desde Cero', 
    category: 'Desarrollo Web', 
    level: 'Principiante', 
    duration: '12h', 
    rating: 4.9, 
    students: 45200, 
    instructor: 'Ana García', 
    image: '⚛️', 
    price: 'Gratis', 
    featured: true,
    description: 'Domina la biblioteca más popular de JavaScript para crear interfaces de usuario modernas. Aprenderás hooks, componentes funcionales y gestión de estado.',
    syllabus: [
      { title: 'Introducción a React', lessons: ['¿Qué es React?', 'Configuración del entorno', 'JSX y Renderizado'] },
      { title: 'Componentes y Props', lessons: ['Creación de componentes', 'Pasando datos con props', 'Composición de componentes'] },
      { title: 'Hooks Esenciales', lessons: ['useState para el estado', 'useEffect para efectos secundarios', 'Custom hooks'] }
    ],
    requirements: ['Conocimientos básicos de HTML y CSS', 'JavaScript básico (ES6+)'],
    whatYouWillLearn: ['Crear SPAs interactivas', 'Gestionar estados complejos', 'Consumir APIs externas']
  },
  { 
    id: 2, 
    title: 'Node.js Profesional', 
    category: 'Desarrollo Web', 
    level: 'Intermedio', 
    duration: '18h', 
    rating: 4.8, 
    students: 32100, 
    instructor: 'Carlos Ruiz', 
    image: '🟢', 
    price: '$29',
    description: 'Construye backends escalables y eficientes. Aprende arquitectura de microservicios, bases de datos y seguridad.',
    syllabus: [
      { title: 'Fundamentos de Node.js', lessons: ['Event Loop', 'Módulos nativos', 'File System'] },
      { title: 'Express y APIs', lessons: ['Routing', 'Middlewares', 'Controladores'] },
      { title: 'Bases de Datos', lessons: ['MongoDB con Mongoose', 'PostgreSQL con Sequelize'] }
    ],
    requirements: ['JavaScript avanzado', 'Conocimientos de terminal'],
    whatYouWillLearn: ['Crear REST APIs', 'Manejar bases de datos NoSQL y SQL', 'Autenticación con JWT']
  },
  { 
    id: 3, 
    title: 'TypeScript Avanzado', 
    category: 'Desarrollo Web', 
    level: 'Avanzado', 
    duration: '15h', 
    rating: 4.7, 
    students: 18500, 
    instructor: 'María López', 
    image: '📘', 
    price: '$39',
    description: 'Lleva tu JavaScript al siguiente nivel con tipos fuertes. Aprende genéricos, decoradores y patrones de diseño.',
    syllabus: [
      { title: 'Tipado Avanzado', lessons: ['Generics', 'Utility Types', 'Mapped Types'] },
      { title: 'POO con TypeScript', lessons: ['Clases e Interfaces', 'Modificadores de acceso', 'Abstract classes'] }
    ],
    requirements: ['Experiencia con JavaScript moderno'],
    whatYouWillLearn: ['Escribir código más robusto', 'Mejorar el autocompletado en IDEs', 'Escalar aplicaciones grandes']
  },
  { 
    id: 4, 
    title: 'Next.js Full Stack', 
    category: 'Desarrollo Web', 
    level: 'Intermedio', 
    duration: '20h', 
    rating: 4.9, 
    students: 28900, 
    instructor: 'Pedro Sánchez', 
    image: '▲', 
    price: '$49', 
    featured: true,
    description: 'Aprende el framework de React para producción. Domina el renderizado en el servidor (SSR), generación de sitios estáticos (SSG) y las nuevas API de App Router.',
    syllabus: [
      { title: 'Fundamentos de Next.js', lessons: ['File-based Routing', 'Data Fetching strategies', 'Server Components'] },
      { title: 'Optimización y Despliegue', lessons: ['Image Optimization', 'Middleware', 'Despliegue en Vercel'] }
    ],
    requirements: ['Conocimientos sólidos de React', 'Entendimiento de APIs REST'],
    whatYouWillLearn: ['Construir aplicaciones SEO-friendly', 'Dominar el App Router', 'Implementar autenticación avanzada']
  },
  { id: 5, title: 'CSS Grid y Flexbox', category: 'Desarrollo Web', level: 'Principiante', duration: '8h', rating: 4.6, students: 52300, instructor: 'Laura Martín', image: '🎨', price: 'Gratis' },
  { id: 6, title: 'Vue.js 3 Completo', category: 'Desarrollo Web', level: 'Intermedio', duration: '16h', rating: 4.8, students: 21400, instructor: 'Diego Torres', image: '💚', price: '$35' },
  
  // Data Science
  { 
    id: 7, 
    title: 'Python para Data Science', 
    category: 'Data Science', 
    level: 'Principiante', 
    duration: '25h', 
    rating: 4.9, 
    students: 67800, 
    instructor: 'Roberto Silva', 
    image: '🐍', 
    price: 'Gratis', 
    featured: true,
    description: 'El punto de partida ideal para científicos de datos. Aprende a manipular grandes volúmenes de datos y extraer información valiosa usando Python.',
    syllabus: [
      { title: 'Bases de Python', lessons: ['Tipos de datos', 'Estructuras de control', 'Funciones y módulos'] },
      { title: 'Librerías de Datos', lessons: ['NumPy para cálculos', 'Pandas para manipulación', 'Matplotlib para gráficos'] }
    ],
    requirements: ['Ninguno (apto para principiantes)'],
    whatYouWillLearn: ['Analizar datasets reales', 'Limpiar y preparar datos', 'Visualizar estadísticas']
  },
  { id: 8, title: 'Machine Learning Práctico', category: 'Data Science', level: 'Avanzado', duration: '30h', rating: 4.8, students: 34200, instructor: 'Elena Vargas', image: '🤖', price: '$59' },
  { id: 9, title: 'SQL para Análisis de Datos', category: 'Data Science', level: 'Principiante', duration: '10h', rating: 4.7, students: 89100, instructor: 'Miguel Ángel', image: '📊', price: 'Gratis' },
  { id: 10, title: 'Visualización con Python', category: 'Data Science', level: 'Intermedio', duration: '14h', rating: 4.6, students: 23400, instructor: 'Sofía Ramos', image: '📈', price: '$29' },
  { id: 11, title: 'Deep Learning con TensorFlow', category: 'Data Science', level: 'Avanzado', duration: '35h', rating: 4.9, students: 19800, instructor: 'Andrés Mejía', image: '🧠', price: '$69', featured: true },
  
  // Marketing Digital
  { 
    id: 12, 
    title: 'Google Ads Certificación', 
    category: 'Marketing Digital', 
    level: 'Principiante', 
    duration: '12h', 
    rating: 4.8, 
    students: 56700, 
    instructor: 'Patricia Gómez', 
    image: '📢', 
    price: 'Gratis',
    description: 'Prepárate para la certificación oficial de Google. Aprende a crear campañas de búsqueda, display y video que generen resultados reales.',
    syllabus: [
      { title: 'Red de Búsqueda', lessons: ['Keywords y concordancia', 'Estructura de anuncios', 'Extensiones'] },
      { title: 'Optimización', lessons: ['Métricas clave (CTR, CPC)', 'Estrategias de puja', 'Remarketing'] }
    ],
    requirements: ['Nociones básicas de marketing'],
    whatYouWillLearn: ['Configurar campañas desde cero', 'Maximizar el retorno de inversión', 'Análisis de competencia']
  },
  { 
    id: 13, 
    title: 'SEO Avanzado 2026', 
    category: 'Marketing Digital', 
    level: 'Avanzado', 
    duration: '18h', 
    rating: 4.9, 
    students: 41200, 
    instructor: 'Fernando Castro', 
    image: '🔍', 
    price: '$45', 
    featured: true,
    description: 'Domina los algoritmos de búsqueda más recientes. Aprende SEO técnico, estrategias de contenido impulsadas por IA y Link Building ético.',
    syllabus: [
      { title: 'SEO Técnico', lessons: ['Core Web Vitals', 'Indexabilidad y rastreo', 'Datos estructurados'] },
      { title: 'Estrategia de Autoridad', lessons: ['Link Building moderno', 'E-E-A-T', 'SEO para voz y búsqueda visual'] }
    ],
    requirements: ['Conocimientos previos de SEO básico', 'Acceso a un sitio web para prácticas'],
    whatYouWillLearn: ['Posicionar en los primeros lugares', 'Auditar sitios web profesionalmente', 'Adaptarse a cambios de algoritmo']
  },
  { id: 14, title: 'Social Media Marketing', category: 'Marketing Digital', level: 'Principiante', duration: '10h', rating: 4.5, students: 78400, instructor: 'Camila Herrera', image: '📱', price: 'Gratis' },
  { id: 15, title: 'Email Marketing Pro', category: 'Marketing Digital', level: 'Intermedio', duration: '8h', rating: 4.7, students: 29800, instructor: 'Ricardo Peña', image: '✉️', price: '$25' },
  { id: 16, title: 'Analytics y Métricas', category: 'Marketing Digital', level: 'Intermedio', duration: '14h', rating: 4.8, students: 35600, instructor: 'Valentina Cruz', image: '📉', price: '$35' },
  
  // Inglés
  { 
    id: 17, 
    title: 'Inglés para Developers', 
    category: 'Inglés', 
    level: 'Principiante', 
    duration: '20h', 
    rating: 4.9, 
    students: 92300, 
    instructor: 'John Smith', 
    image: '🇬🇧', 
    price: 'Gratis', 
    featured: true,
    description: 'Mejora tu comunicación técnica en el entorno laboral. Aprende vocabulario clave para reuniones, documentación y entrevistas de trabajo.',
    syllabus: [
      { title: 'Gramática Técnica', lessons: ['Tiempos verbales para reportar bugs', 'Condicionales en código', 'Voz pasiva en documentación'] },
      { title: 'Comunicación en el Equipo', lessons: ['Daily Standups en inglés', 'Escritura de Pull Requests', 'Entrevistas técnicas'] }
    ],
    requirements: ['Inglés nivel básico (A2)'],
    whatYouWillLearn: ['Hablar con confianza en reuniones', 'Escribir correos y documentación profesional', 'Entender tutoriales técnicos avanzados']
  },
  { id: 18, title: 'Business English', category: 'Inglés', level: 'Intermedio', duration: '25h', rating: 4.8, students: 45600, instructor: 'Sarah Johnson', image: '💼', price: '$39' },
  { id: 19, title: 'English Conversation', category: 'Inglés', level: 'Principiante', duration: '15h', rating: 4.7, students: 67800, instructor: 'Michael Brown', image: '💬', price: 'Gratis' },
  { id: 20, title: 'Technical Writing', category: 'Inglés', level: 'Avanzado', duration: '12h', rating: 4.6, students: 18900, instructor: 'Emily Davis', image: '✍️', price: '$29' },
  
  // Diseño UX/UI
  { 
    id: 21, 
    title: 'Figma desde Cero', 
    category: 'Diseño UX/UI', 
    level: 'Principiante', 
    duration: '14h', 
    rating: 4.9, 
    students: 73400, 
    instructor: 'Isabella Moreno', 
    image: '🎨', 
    price: 'Gratis', 
    featured: true,
    description: 'La herramienta líder para diseño de interfaces. Desde el dibujo de formas simples hasta prototipos interactivos de alta fidelidad.',
    syllabus: [
      { title: 'Interfaz y Herramientas', lessons: ['Capas y Grupos', 'Componentes y Variantes', 'Auto Layout'] },
      { title: 'Prototipado', lessons: ['Interacciones básicas', 'Smart Animate', 'Variables en prototipos'] }
    ],
    requirements: ['Creatividad', 'No se requiere experiencia previa'],
    whatYouWillLearn: ['Diseñar interfaces web y móviles', 'Crear sistemas de diseño escalables', 'Colaborar con desarrolladores']
  },
  { id: 22, title: 'UX Research', category: 'Diseño UX/UI', level: 'Intermedio', duration: '16h', rating: 4.8, students: 28900, instructor: 'Nicolás Fuentes', image: '🔬', price: '$45' },
  { id: 23, title: 'Design Systems', category: 'Diseño UX/UI', level: 'Avanzado', duration: '20h', rating: 4.7, students: 19200, instructor: 'Gabriela Ortiz', image: '📐', price: '$55' },
  { id: 24, title: 'Prototipado Avanzado', category: 'Diseño UX/UI', level: 'Intermedio', duration: '12h', rating: 4.8, students: 24500, instructor: 'Sebastián Vega', image: '🖼️', price: '$35' },
  
  // DevOps & Cloud
  { id: 25, title: 'Docker y Kubernetes', category: 'DevOps & Cloud', level: 'Intermedio', duration: '22h', rating: 4.9, students: 38700, instructor: 'Alejandro Díaz', image: '🐳', price: '$49', featured: true },
  { id: 26, title: 'AWS Cloud Practitioner', category: 'DevOps & Cloud', level: 'Principiante', duration: '18h', rating: 4.8, students: 52100, instructor: 'Daniela Ríos', image: '☁️', price: 'Gratis' },
  { id: 27, title: 'CI/CD con GitHub Actions', category: 'DevOps & Cloud', level: 'Intermedio', duration: '10h', rating: 4.7, students: 21300, instructor: 'Martín Acosta', image: '🔄', price: '$29' },
  { id: 28, title: 'Terraform Infrastructure', category: 'DevOps & Cloud', level: 'Avanzado', duration: '25h', rating: 4.8, students: 15600, instructor: 'Paula Medina', image: '🏗️', price: '$59' },
  
  // Mobile
  { id: 29, title: 'React Native Masterclass', category: 'Mobile', level: 'Intermedio', duration: '28h', rating: 4.9, students: 41200, instructor: 'Jorge Mendoza', image: '📱', price: '$55', featured: true },
  { id: 30, title: 'Flutter Completo', category: 'Mobile', level: 'Principiante', duration: '24h', rating: 4.8, students: 35800, instructor: 'Lucía Fernández', image: '💙', price: '$45' },
  { id: 31, title: 'Swift para iOS', category: 'Mobile', level: 'Intermedio', duration: '20h', rating: 4.7, students: 18900, instructor: 'Cristian Torres', image: '🍎', price: '$49' },
  { id: 32, title: 'Kotlin Android', category: 'Mobile', level: 'Principiante', duration: '22h', rating: 4.6, students: 27400, instructor: 'Andrea Guzmán', image: '🤖', price: 'Gratis' },
];

const categories = ['Todos', 'Desarrollo Web', 'Data Science', 'Marketing Digital', 'Inglés', 'Diseño UX/UI', 'DevOps & Cloud', 'Mobile'];
const levels = ['Todos', 'Principiante', 'Intermedio', 'Avanzado'];

const stats = [
  { value: '6M+', label: 'Estudiantes', icon: '👥' },
  { value: '4,000+', label: 'Empresas', icon: '🏢' },
  { value: '1,500+', label: 'Cursos', icon: '📚' },
  { value: '17', label: 'Escuelas', icon: '🎓' }
];

const enterpriseSolutions = [
  {
    icon: '🧩',
    title: 'Formación a medida',
    description: 'Programas personalizados para equipos de tecnología, marketing y operaciones, con rutas diseñadas según los objetivos de tu empresa.'
  },
  {
    icon: '📊',
    title: 'Reportes y analytics',
    description: 'Seguimiento de progreso, métricas de adopción y resultados de aprendizaje para optimizar el desempeño del equipo.'
  },
  {
    icon: '🤝',
    title: 'Soporte corporativo',
    description: 'Account managers dedicados, onboarding para empresas y acceso directo a recursos exclusivos para clientes empresariales.'
  }
];

const relatedCompanies = [
  {
    name: 'Nexa Talent',
    industry: 'Consultoría en RRHH',
    description: 'Mejorando la formación de equipos con proyectos en soft skills y data-driven learning.',
    employees: '450+'
  },
  {
    name: 'CloudNova',
    industry: 'Cloud & DevOps',
    description: 'Capacitación a medida para equipos de infraestructura y automatización de despliegues.',
    employees: '230+'
  },
  {
    name: 'MercaLab',
    industry: 'Marketing Digital',
    description: 'Workshops especializados para campañas, SEO y análisis de rendimiento comercial.',
    employees: '310+'
  },
  {
    name: 'EduSoft',
    industry: 'Software y UX',
    description: 'Rutas de aprendizaje en diseño de productos digitales y experiencia de usuario.',
    employees: '180+'
  }
];

const memberships = [
  {
    id: 'basic',
    name: 'Básico',
    price: 'Gratis',
    period: '',
    description: 'Perfecto para comenzar tu aprendizaje',
    features: [
      'Acceso a cursos gratuitos',
      'Comunidad de estudiantes',
      'Certificados básicos',
      'Soporte por email'
    ],
    buttonText: 'Comenzar gratis',
    highlighted: false,
    color: '#6366F1'
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$29',
    period: '/mes',
    description: 'Todo lo que necesitas para crecer profesionalmente',
    features: [
      'Acceso a todos los cursos',
      'Descargas offline',
      'Certificados verificados',
      'Proyectos prácticos',
      'Mentoría grupal mensual',
      'Soporte prioritario 24/7'
    ],
    buttonText: 'Obtener Pro',
    highlighted: true,
    color: '#00D4AA'
  },
  {
    id: 'enterprise',
    name: 'Empresas',
    price: '$99',
    period: '/usuario/mes',
    description: 'Solución completa para equipos y empresas',
    features: [
      'Todo lo de Pro incluido',
      'Panel de administración',
      'Reportes y analytics',
      'Rutas personalizadas',
      'API de integración',
      'Account manager dedicado',
      'Facturación unificada'
    ],
    buttonText: 'Contactar ventas',
    highlighted: false,
    color: '#8B5CF6'
  }
];

// Componente para renderizar estrellas
const StarRating = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  
  return (
    <div className="ev-star-rating">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          fill={i < fullStars ? '#FFD700' : (i === fullStars && hasHalf ? 'url(#halfGrad)' : '#3a3a3a')}
          width="14"
          height="14"
        >
          <defs>
            <linearGradient id="halfGrad">
              <stop offset="50%" stopColor="#FFD700" />
              <stop offset="50%" stopColor="#3a3a3a" />
            </linearGradient>
          </defs>
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
        </svg>
      ))}
      <span className="ev-rating-value">{rating}</span>
    </div>
  );
};

// Nuevo Componente: Detalle del Curso
const CourseDetail = ({ course, onBack }: { course: any; onBack: () => void }) => {
  return (
    <section className="ev-course-detail">
      <div className="ev-detail-header">
        <button className="ev-back-btn" onClick={onBack}>
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
          Volver
        </button>
      </div>

      <div className="ev-detail-hero">
        <div className="ev-detail-main">
          <span className="ev-course-category">{course.category}</span>
          <h1>{course.title}</h1>
          <p className="ev-detail-description">{course.description || 'Este curso te proporcionará todas las herramientas necesarias para dominar esta tecnología desde sus bases hasta conceptos avanzados.'}</p>
          
          <div className="ev-detail-stats">
            <div className="ev-detail-stat">
              <StarRating rating={course.rating} />
              <span>({course.students.toLocaleString()} estudiantes)</span>
            </div>
            <div className="ev-detail-meta-grid">
              <div className="ev-meta-item">
                <span className="ev-meta-label">Instructor</span>
                <span className="ev-meta-value">{course.instructor}</span>
              </div>
              <div className="ev-meta-item">
                <span className="ev-meta-label">Duración</span>
                <span className="ev-meta-value">{course.duration}</span>
              </div>
              <div className="ev-meta-item">
                <span className="ev-meta-label">Nivel</span>
                <span className="ev-meta-value">{course.level}</span>
              </div>
              <div className="ev-meta-item">
                <span className="ev-meta-label">Precio</span>
                <span className="ev-meta-value ev-price-highlight">{course.price}</span>
              </div>
            </div>
          </div>

          <div className="ev-detail-actions">
            <button className="ev-enroll-btn">Inscribirme ahora</button>
            <button className="ev-wishlist-btn">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="ev-detail-card-preview">
          <div className="ev-preview-image">
            <span>{course.image}</span>
          </div>
          <div className="ev-preview-content">
            <h3>¿Qué incluye este curso?</h3>
            <ul>
              <li><svg viewBox="0 0 24 24" fill="#00d4aa" width="18" height="18"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg> Acceso de por vida</li>
              <li><svg viewBox="0 0 24 24" fill="#00d4aa" width="18" height="18"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg> Certificado de finalización</li>
              <li><svg viewBox="0 0 24 24" fill="#00d4aa" width="18" height="18"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg> Recursos descargables</li>
              <li><svg viewBox="0 0 24 24" fill="#00d4aa" width="18" height="18"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg> Soporte del instructor</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="ev-detail-content">
        <div className="ev-content-main">
          {course.whatYouWillLearn && (
            <div className="ev-detail-section">
              <h2>Lo que aprenderás</h2>
              <div className="ev-learning-grid">
                {course.whatYouWillLearn.map((item: string, i: number) => (
                  <div key={i} className="ev-learning-item">
                    <svg viewBox="0 0 24 24" fill="#00d4aa" width="20" height="20">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {course.syllabus && (
            <div className="ev-detail-section">
              <h2>Contenido del curso</h2>
              <div className="ev-syllabus">
                {course.syllabus.map((section: any, i: number) => (
                  <div key={i} className="ev-syllabus-section">
                    <div className="ev-syllabus-header">
                      <span>Módulo {i + 1}: {section.title}</span>
                    </div>
                    <ul className="ev-syllabus-lessons">
                      {section.lessons.map((lesson: string, j: number) => (
                        <li key={j}>
                          <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                          {lesson}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="ev-content-sidebar">
          {course.requirements && (
            <div className="ev-detail-section">
              <h2>Requisitos</h2>
              <ul className="ev-requirements-list">
                {course.requirements.map((req: string, i: number) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedLevel, setSelectedLevel] = useState('Todos');
  const [showCourses, setShowCourses] = useState(false);
  const [showEnterprise, setShowEnterprise] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

  const selectedCourse = useMemo(() => {
    return allCourses.find(c => c.id === selectedCourseId) || null;
  }, [selectedCourseId]);

  const filteredCourses = useMemo(() => {
    return allCourses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'Todos' || course.category === selectedCategory;
      const matchesLevel = selectedLevel === 'Todos' || course.level === selectedLevel;
      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [searchTerm, selectedCategory, selectedLevel]);

  const featuredCourses = allCourses.filter(c => c.featured);

  const handleSearch = () => {
    setShowCourses(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const resetHome = () => {
    setShowCourses(false);
    setShowEnterprise(false);
    setSelectedCourseId(null);
    setSearchTerm('');
    setSelectedCategory('Todos');
    setSelectedLevel('Todos');
  };

  const openEnterprisePage = () => {
    setShowEnterprise(true);
    setShowCourses(true);
  };

  return (
    <div className="ev-bg">
      {/* Animated Background Elements */}
      <div className="ev-bg-gradient"></div>
      <div className="ev-bg-orbs">
        <div className="ev-orb ev-orb-1"></div>
        <div className="ev-orb ev-orb-2"></div>
        <div className="ev-orb ev-orb-3"></div>
      </div>

      {/* Navbar */}
      <nav className="ev-navbar">
        <div className="ev-logo" onClick={resetHome}>
          <div className="ev-logo-icon">
            <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26">
              <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6A4.997 4.997 0 017 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z"/>
            </svg>
          </div>
          <span className="ev-logo-text">Learnix</span>
        </div>
        <ul className="ev-nav-links">
          <li onClick={() => { resetHome(); setShowCourses(true); }}>Cursos</li>
          <li onClick={openEnterprisePage}>Empresas</li>
          <li>Blog</li>
          <li className="ev-nav-live">Live <span className="ev-live-dot"></span></li>
          <li>Precios</li>
        </ul>
        <div className="ev-nav-actions">
          <button className="ev-login-btn ev-login-ghost">Iniciar sesión</button>
          <button className="ev-login-btn">Comenzar gratis</button>
        </div>
      </nav>

      {selectedCourseId && selectedCourse ? (
        <CourseDetail
          course={selectedCourse}
          onBack={() => setSelectedCourseId(null)}
        />
      ) : !showCourses ? (
        <>
          {/* Hero Section */}
          <section className="ev-hero">
            <div className="ev-hero-glow"></div>
            <span className="ev-hero-badge">
              <span className="ev-badge-dot"></span>
              Más de 1,500 cursos disponibles
            </span>
            <h1>
              Aprende las habilidades <span>del futuro</span>
            </h1>
            <p className="ev-hero-sub">
              Únete a más de 6 millones de estudiantes aprendiendo tecnología, marketing, diseño e idiomas con los mejores expertos de Latinoamérica.
            </p>
            
            <div className="ev-search-wrapper">
              <div className="ev-search-box">
                <svg className="ev-search-icon" viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
                <input 
                  placeholder="Buscar cursos: React, Python, Marketing, Inglés..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button onClick={handleSearch}>Explorar cursos</button>
              </div>
              <div className="ev-search-tags">
                <span>Populares:</span>
                {['React', 'Python', 'Marketing', 'Inglés', 'Figma'].map(tag => (
                  <button key={tag} onClick={() => { setSearchTerm(tag); setShowCourses(true); }}>
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="ev-stats">
            {stats.map((stat) => (
              <div className="ev-stat" key={stat.label}>
                <span className="ev-stat-icon">{stat.icon}</span>
                <div className="ev-stat-content">
                  <span className="ev-stat-value">{stat.value}</span>
                  <span className="ev-stat-label">{stat.label}</span>
                </div>
              </div>
            ))}
          </section>

          {/* Featured Courses */}
          <section className="ev-featured">
            <div className="ev-section-header">
              <h2>Cursos <span>destacados</span></h2>
              <p>Los cursos más populares seleccionados para ti</p>
            </div>
            <div className="ev-courses-grid">
              {featuredCourses.slice(0, 6).map((course) => (
                <div 
                  className="ev-course-card" 
                  key={course.id}
                  onClick={() => { setSelectedCourseId(course.id); setShowCourses(true); }}
                >
                  <div className="ev-course-image">
                    <span>{course.image}</span>
                    {course.price === 'Gratis' && <span className="ev-course-badge">Gratis</span>}
                  </div>
                  <div className="ev-course-content">
                    <span className="ev-course-category">{course.category}</span>
                    <h3>{course.title}</h3>
                    <p className="ev-course-instructor">Por {course.instructor}</p>
                    <div className="ev-course-meta">
                      <StarRating rating={course.rating} />
                      <span className="ev-meta-item"><svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg> {(course.students / 1000).toFixed(1)}k</span>
                      <span className="ev-meta-item"><svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg> {course.duration}</span>
                    </div>
                    <div className="ev-course-footer">
                      <span className="ev-course-level">{course.level}</span>
                      <span className="ev-course-price">{course.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="ev-view-all" onClick={() => setShowCourses(true)}>
              Ver todos los cursos
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
              </svg>
            </button>
          </section>

          {/* Categories Preview */}
          <section className="ev-categories-preview">
            <div className="ev-section-header">
              <h2>Explora por <span>categoría</span></h2>
              <p>Encuentra el camino de aprendizaje perfecto para ti</p>
            </div>
            <div className="ev-category-cards">
              {categories.filter(c => c !== 'Todos').map(category => {
                const count = allCourses.filter(c => c.category === category).length;
                return (
                  <div 
                    key={category} 
                    className="ev-category-card"
                    onClick={() => { setSelectedCategory(category); setShowCourses(true); }}
                  >
                    <span className="ev-category-count">{count} cursos</span>
                    <h3>{category}</h3>
                    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                    </svg>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Memberships Section */}
          <section className="ev-memberships">
            <div className="ev-section-header">
              <h2>Elige tu <span>plan</span></h2>
              <p>Selecciona la membresía que mejor se adapte a tus necesidades</p>
            </div>
            <div className="ev-membership-cards">
              {memberships.map((membership) => (
                <div 
                  key={membership.id} 
                  className={`ev-membership-card ${membership.highlighted ? 'highlighted' : ''}`}
                  style={{ '--accent-color': membership.color } as React.CSSProperties}
                >
                  {membership.highlighted && (
                    <span className="ev-membership-popular">Más popular</span>
                  )}
                  <div className="ev-membership-header">
                    <h3>{membership.name}</h3>
                    <div className="ev-membership-price">
                      <span className="ev-price-amount">{membership.price}</span>
                      {membership.period && <span className="ev-price-period">{membership.period}</span>}
                    </div>
                    <p className="ev-membership-desc">{membership.description}</p>
                  </div>
                  <ul className="ev-membership-features">
                    {membership.features.map((feature, index) => (
                      <li key={index}>
                        <svg viewBox="0 0 24 24" fill="var(--accent-color)" width="18" height="18">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className={`ev-membership-btn ${membership.highlighted ? 'primary' : ''}`}>
                    {membership.buttonText}
                  </button>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : showEnterprise ? (
        <section className="ev-enterprise-page">
          <div className="ev-section-header">
            <h2>Empresas que <span>respalda</span> a Learnix</h2>
            <p>Empresas líderes que ya confían en nuestras soluciones de formación corporativa y en el impulso de sus equipos.</p>
          </div>

          <div className="ev-enterprise-grid">
            {enterpriseSolutions.map((item) => (
              <div className="ev-enterprise-card" key={item.title}>
                <div className="ev-enterprise-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>

          <div className="ev-related-companies">
            <h3>Empresas relacionadas</h3>
            <div className="ev-company-cards">
              {relatedCompanies.map((company) => (
                <div className="ev-company-card" key={company.name}>
                  <div className="ev-company-card-header">
                    <span className="ev-company-logo">{company.name.charAt(0)}</span>
                    <div>
                      <h4>{company.name}</h4>
                      <span>{company.industry}</span>
                    </div>
                  </div>
                  <p>{company.description}</p>
                  <span className="ev-company-meta">{company.employees} empleados</span>
                </div>
              ))}
            </div>
          </div>

          <div className="ev-enterprise-actions">
            <button className="ev-cta-btn" onClick={resetHome}>Volver al inicio</button>
            <button className="ev-cta-btn ev-cta-secondary" onClick={() => { setShowCourses(true); setShowEnterprise(false); }}>
              Ver cursos
            </button>
          </div>
        </section>
      ) : (
        /* Courses Catalog */
        <section className="ev-catalog">
          <div className="ev-catalog-header">
            <div className="ev-catalog-info">
              <h1>
                {selectedCategory === 'Todos' 
                  ? searchTerm 
                    ? `Resultados para "${searchTerm}"` 
                    : 'Todos los cursos'
                  : selectedCategory}
              </h1>
              <p>{filteredCourses.length} cursos encontrados</p>
            </div>
            <div className="ev-catalog-search">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
              <input 
                placeholder="Buscar en cursos..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="ev-catalog-filters">
            {categories.map(category => (
              <button
                key={category}
                className={`ev-filter-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
                {category !== 'Todos' && (
                  <span className="ev-filter-count">
                    {allCourses.filter(c => c.category === category).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="ev-catalog-level-filters">
            <span className="ev-filter-label">Filtrar por nivel:</span>
            {levels.map(level => (
              <button
                key={level}
                className={`ev-filter-btn ev-level-filter ${selectedLevel === level ? 'active' : ''}`}
                onClick={() => setSelectedLevel(level)}
              >
                {level}
              </button>
            ))}
          </div>

          <div className="ev-catalog-grid">
            {filteredCourses.map((course) => (
              <div 
                className="ev-course-card" 
                key={course.id}
                onClick={() => setSelectedCourseId(course.id)}
              >
                <div className="ev-course-image">
                  <span>{course.image}</span>
                  {course.price === 'Gratis' && <span className="ev-course-badge">Gratis</span>}
                  {course.featured && <span className="ev-course-featured">⭐ Popular</span>}
                </div>
                <div className="ev-course-content">
                  <span className="ev-course-category">{course.category}</span>
                  <h3>{course.title}</h3>
                  <p className="ev-course-instructor">Por {course.instructor}</p>
                  <div className="ev-course-meta">
                    <StarRating rating={course.rating} />
                    <span className="ev-meta-item"><svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg> {(course.students / 1000).toFixed(1)}k</span>
                    <span className="ev-meta-item"><svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg> {course.duration}</span>
                  </div>
                  <div className="ev-course-footer">
                    <span className="ev-course-level">{course.level}</span>
                    <span className="ev-course-price">{course.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="ev-no-results">
              <span>🔍</span>
              <h3>No se encontraron cursos</h3>
              <p>Intenta con otros términos de búsqueda o cambia el filtro de categoría</p>
              <button onClick={() => { setSearchTerm(''); setSelectedCategory('Todos'); }}>
                Ver todos los cursos
              </button>
            </div>
          )}
        </section>
      )}

      {/* WhatsApp Floating Icon */}
      <a href="https://wa.me/" className="ev-whatsapp" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  );
}
