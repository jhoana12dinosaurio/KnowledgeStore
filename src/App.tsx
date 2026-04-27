import { useState, useMemo } from 'react';
import './App.css';

const allCourses = [
  { id: 1,  title: 'React desde Cero',          category: 'Desarrollo Web',    level: 'Principiante', duration: '12h', rating: 4.9, students: 45200,  instructor: 'Ana García',       image: '⚛️', price: 'Gratis', featured: true },
  { id: 2,  title: 'Node.js Profesional',        category: 'Desarrollo Web',    level: 'Intermedio',   duration: '18h', rating: 4.8, students: 32100,  instructor: 'Carlos Ruiz',      image: '🟢', price: '$29' },
  { id: 3,  title: 'TypeScript Avanzado',        category: 'Desarrollo Web',    level: 'Avanzado',     duration: '15h', rating: 4.7, students: 18500,  instructor: 'María López',      image: '📘', price: '$39' },
  { id: 4,  title: 'Next.js Full Stack',         category: 'Desarrollo Web',    level: 'Intermedio',   duration: '20h', rating: 4.9, students: 28900,  instructor: 'Pedro Sánchez',    image: '▲',  price: '$49', featured: true },
  { id: 5,  title: 'CSS Grid y Flexbox',         category: 'Desarrollo Web',    level: 'Principiante', duration: '8h',  rating: 4.6, students: 52300,  instructor: 'Laura Martín',     image: '🎨', price: 'Gratis' },
  { id: 6,  title: 'Vue.js 3 Completo',          category: 'Desarrollo Web',    level: 'Intermedio',   duration: '16h', rating: 4.8, students: 21400,  instructor: 'Diego Torres',     image: '💚', price: '$35' },
  { id: 7,  title: 'Python para Data Science',   category: 'Data Science',      level: 'Principiante', duration: '25h', rating: 4.9, students: 67800,  instructor: 'Roberto Silva',    image: '🐍', price: 'Gratis', featured: true },
  { id: 8,  title: 'Machine Learning Práctico',  category: 'Data Science',      level: 'Avanzado',     duration: '30h', rating: 4.8, students: 34200,  instructor: 'Elena Vargas',     image: '🤖', price: '$59' },
  { id: 9,  title: 'SQL para Análisis de Datos', category: 'Data Science',      level: 'Principiante', duration: '10h', rating: 4.7, students: 89100,  instructor: 'Miguel Ángel',     image: '📊', price: 'Gratis' },
  { id: 10, title: 'Visualización con Python',   category: 'Data Science',      level: 'Intermedio',   duration: '14h', rating: 4.6, students: 23400,  instructor: 'Sofía Ramos',      image: '📈', price: '$29' },
  { id: 11, title: 'Deep Learning con TensorFlow', category: 'Data Science',    level: 'Avanzado',     duration: '35h', rating: 4.9, students: 19800,  instructor: 'Andrés Mejía',     image: '🧠', price: '$69', featured: true },
  { id: 12, title: 'Google Ads Certificación',   category: 'Marketing Digital', level: 'Principiante', duration: '12h', rating: 4.8, students: 56700,  instructor: 'Patricia Gómez',   image: '📢', price: 'Gratis' },
  { id: 13, title: 'SEO Avanzado 2026',          category: 'Marketing Digital', level: 'Avanzado',     duration: '18h', rating: 4.9, students: 41200,  instructor: 'Fernando Castro',  image: '🔍', price: '$45', featured: true },
  { id: 14, title: 'Social Media Marketing',     category: 'Marketing Digital', level: 'Principiante', duration: '10h', rating: 4.5, students: 78400,  instructor: 'Camila Herrera',   image: '📱', price: 'Gratis' },
  { id: 15, title: 'Email Marketing Pro',        category: 'Marketing Digital', level: 'Intermedio',   duration: '8h',  rating: 4.7, students: 29800,  instructor: 'Ricardo Peña',     image: '✉️', price: '$25' },
  { id: 16, title: 'Analytics y Métricas',       category: 'Marketing Digital', level: 'Intermedio',   duration: '14h', rating: 4.8, students: 35600,  instructor: 'Valentina Cruz',   image: '📉', price: '$35' },
  { id: 17, title: 'Inglés para Developers',     category: 'Inglés',            level: 'Principiante', duration: '20h', rating: 4.9, students: 92300,  instructor: 'John Smith',       image: '🇬🇧', price: 'Gratis', featured: true },
  { id: 18, title: 'Business English',           category: 'Inglés',            level: 'Intermedio',   duration: '25h', rating: 4.8, students: 45600,  instructor: 'Sarah Johnson',    image: '💼', price: '$39' },
  { id: 19, title: 'English Conversation',       category: 'Inglés',            level: 'Principiante', duration: '15h', rating: 4.7, students: 67800,  instructor: 'Michael Brown',    image: '💬', price: 'Gratis' },
  { id: 20, title: 'Technical Writing',          category: 'Inglés',            level: 'Avanzado',     duration: '12h', rating: 4.6, students: 18900,  instructor: 'Emily Davis',      image: '✍️', price: '$29' },
  { id: 21, title: 'Figma desde Cero',           category: 'Diseño UX/UI',      level: 'Principiante', duration: '14h', rating: 4.9, students: 73400,  instructor: 'Isabella Moreno',  image: '🎨', price: 'Gratis', featured: true },
  { id: 22, title: 'UX Research',                category: 'Diseño UX/UI',      level: 'Intermedio',   duration: '16h', rating: 4.8, students: 28900,  instructor: 'Nicolás Fuentes',  image: '🔬', price: '$45' },
  { id: 23, title: 'Design Systems',             category: 'Diseño UX/UI',      level: 'Avanzado',     duration: '20h', rating: 4.7, students: 19200,  instructor: 'Gabriela Ortiz',   image: '📐', price: '$55' },
  { id: 24, title: 'Prototipado Avanzado',       category: 'Diseño UX/UI',      level: 'Intermedio',   duration: '12h', rating: 4.8, students: 24500,  instructor: 'Sebastián Vega',   image: '🖼️', price: '$35' },
  { id: 25, title: 'Docker y Kubernetes',        category: 'DevOps & Cloud',    level: 'Intermedio',   duration: '22h', rating: 4.9, students: 38700,  instructor: 'Alejandro Díaz',   image: '🐳', price: '$49', featured: true },
  { id: 26, title: 'AWS Cloud Practitioner',     category: 'DevOps & Cloud',    level: 'Principiante', duration: '18h', rating: 4.8, students: 52100,  instructor: 'Daniela Ríos',     image: '☁️', price: 'Gratis' },
  { id: 27, title: 'CI/CD con GitHub Actions',   category: 'DevOps & Cloud',    level: 'Intermedio',   duration: '10h', rating: 4.7, students: 21300,  instructor: 'Martín Acosta',    image: '🔄', price: '$29' },
  { id: 28, title: 'Terraform Infrastructure',   category: 'DevOps & Cloud',    level: 'Avanzado',     duration: '25h', rating: 4.8, students: 15600,  instructor: 'Paula Medina',     image: '🏗️', price: '$59' },
  { id: 29, title: 'React Native Masterclass',   category: 'Mobile',            level: 'Intermedio',   duration: '28h', rating: 4.9, students: 41200,  instructor: 'Jorge Mendoza',    image: '📱', price: '$55', featured: true },
  { id: 30, title: 'Flutter Completo',           category: 'Mobile',            level: 'Principiante', duration: '24h', rating: 4.8, students: 35800,  instructor: 'Lucía Fernández',  image: '💙', price: '$45' },
  { id: 31, title: 'Swift para iOS',             category: 'Mobile',            level: 'Intermedio',   duration: '20h', rating: 4.7, students: 18900,  instructor: 'Cristian Torres',  image: '🍎', price: '$49' },
  { id: 32, title: 'Kotlin Android',             category: 'Mobile',            level: 'Principiante', duration: '22h', rating: 4.6, students: 27400,  instructor: 'Andrea Guzmán',    image: '🤖', price: 'Gratis' },
];

const categories = ['Todos', 'Desarrollo Web', 'Data Science', 'Marketing Digital', 'Inglés', 'Diseño UX/UI', 'DevOps & Cloud', 'Mobile'];

const stats = [
  { value: '6M+',    label: 'Estudiantes',  icon: '👥' },
  { value: '4,000+', label: 'Empresas',     icon: '🏢' },
  { value: '1,500+', label: 'Cursos',       icon: '📚' },
  { value: '17',     label: 'Escuelas',     icon: '🎓' },
];

const enterpriseSolutions = [
  { icon: '🧩', title: 'Formación a medida',   description: 'Programas personalizados para equipos de tecnología, marketing y operaciones, con rutas diseñadas según los objetivos de tu empresa.' },
  { icon: '📊', title: 'Reportes y analytics', description: 'Seguimiento de progreso, métricas de adopción y resultados de aprendizaje para optimizar el desempeño del equipo.' },
  { icon: '🤝', title: 'Soporte corporativo',  description: 'Account managers dedicados, onboarding para empresas y acceso directo a recursos exclusivos para clientes empresariales.' },
];

const relatedCompanies = [
  { name: 'Nexa Talent', industry: 'Consultoría en RRHH',    description: 'Mejorando la formación de equipos con proyectos en soft skills y data-driven learning.',                        employees: '450+' },
  { name: 'CloudNova',   industry: 'Cloud & DevOps',          description: 'Capacitación a medida para equipos de infraestructura y automatización de despliegues.',                        employees: '230+' },
  { name: 'MercaLab',    industry: 'Marketing Digital',       description: 'Workshops especializados para campañas, SEO y análisis de rendimiento comercial.',                              employees: '310+' },
  { name: 'EduSoft',     industry: 'Software y UX',           description: 'Rutas de aprendizaje en diseño de productos digitales y experiencia de usuario.',                               employees: '180+' },
];

const memberships = [
  {
    id: 'basic', name: 'Básico', price: 'Gratis', period: '',
    description: 'Perfecto para comenzar tu aprendizaje',
    features: ['Acceso a cursos gratuitos', 'Comunidad de estudiantes', 'Certificados básicos', 'Soporte por email'],
    buttonText: 'Comenzar gratis', highlighted: false, color: '#6366F1',
  },
  {
    id: 'pro', name: 'Pro', price: '$29', period: '/mes',
    description: 'Todo lo que necesitas para crecer profesionalmente',
    features: ['Acceso a todos los cursos', 'Descargas offline', 'Certificados verificados', 'Proyectos prácticos', 'Mentoría grupal mensual', 'Soporte prioritario 24/7'],
    buttonText: 'Obtener Pro', highlighted: true, color: '#00C896',
  },
  {
    id: 'enterprise', name: 'Empresas', price: '$99', period: '/usuario/mes',
    description: 'Solución completa para equipos y empresas',
    features: ['Todo lo de Pro incluido', 'Panel de administración', 'Reportes y analytics', 'Rutas personalizadas', 'API de integración', 'Account manager dedicado', 'Facturación unificada'],
    buttonText: 'Contactar ventas', highlighted: false, color: '#8B5CF6',
  },
];

/* ── Stars ── */
const StarRating = ({ rating }: { rating: number }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="lx-stars">
      {[...Array(5)].map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" width="13" height="13"
          fill={i < full ? '#F4B942' : (i === full && half ? 'url(#hg)' : '#2a3448')}>
          <defs>
            <linearGradient id="hg">
              <stop offset="50%" stopColor="#F4B942" />
              <stop offset="50%" stopColor="#2a3448" />
            </linearGradient>
          </defs>
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
        </svg>
      ))}
      <span className="lx-star-val">{rating}</span>
    </div>
  );
};

/* ── Course Card ── */
const CourseCard = ({ course }: { course: typeof allCourses[0] }) => (
  <div className="lx-course-card">
    <div className="lx-card-thumb">
      <span className="lx-card-thumb-emoji">{course.image}</span>
      {course.price === 'Gratis' && <span className="lx-badge lx-badge-free">Gratis</span>}
      {course.featured && <span className="lx-badge-popular">⭐ Popular</span>}
    </div>
    <div className="lx-card-body">
      <span className="lx-card-cat">{course.category}</span>
      <h3 className="lx-card-title">{course.title}</h3>
      <p className="lx-card-instructor">Por {course.instructor}</p>
      <div className="lx-card-meta">
        <StarRating rating={course.rating} />
        <span className="lx-meta-item">
          <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13">
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
          </svg>
          {(course.students / 1000).toFixed(1)}k
        </span>
        <span className="lx-meta-item">
          <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13">
            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
          </svg>
          {course.duration}
        </span>
      </div>
      <div className="lx-card-footer">
        <span className="lx-level-tag">{course.level}</span>
        <span className={`lx-price${course.price !== 'Gratis' ? ' lx-price-paid' : ''}`}>
          {course.price}
        </span>
      </div>
    </div>
  </div>
);

/* ── Check icon ── */
const CheckIcon = ({ color }: { color: string }) => (
  <svg className="lx-feat-check" viewBox="0 0 24 24" fill={color} width="17" height="17">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
  </svg>
);

/* ── Arrow icon ── */
const ArrowRight = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
  </svg>
);

/* ══════════════════════════════════ */
export default function App() {
  const [searchTerm,       setSearchTerm]       = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [showCourses,      setShowCourses]       = useState(false);
  const [showEnterprise,   setShowEnterprise]    = useState(false);

  const filteredCourses = useMemo(() =>
    allCourses.filter(c => {
      const q = searchTerm.toLowerCase();
      const matchSearch = !q || c.title.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) || c.instructor.toLowerCase().includes(q);
      const matchCat = selectedCategory === 'Todos' || c.category === selectedCategory;
      return matchSearch && matchCat;
    }),
    [searchTerm, selectedCategory]
  );

  const featuredCourses = allCourses.filter(c => c.featured);

  const resetHome = () => {
    setShowCourses(false);
    setShowEnterprise(false);
    setSearchTerm('');
    setSelectedCategory('Todos');
  };

  const goToCourses = () => { setShowCourses(true); setShowEnterprise(false); };
  const goToEnterprise = () => { setShowEnterprise(true); setShowCourses(true); };

  const handleSearch = () => setShowCourses(true);
  const handleKeyPress = (e: React.KeyboardEvent) => { if (e.key === 'Enter') handleSearch(); };

  return (
    <div className="lx-app">
      {/* Background */}
      <div className="lx-bg-layer" />

      {/* ── Navbar ── */}
      <nav className="lx-nav">
        <div className="lx-nav-inner">
          <a className="lx-logo" onClick={resetHome} href="#" style={{ textDecoration: 'none' }}>
            <div className="lx-logo-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6A4.997 4.997 0 017 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z"/>
              </svg>
            </div>
            <span className="lx-logo-name">Learnix</span>
          </a>

          <ul className="lx-nav-links">
            <li><button onClick={goToCourses}>Cursos</button></li>
            <li><button onClick={goToEnterprise}>Empresas</button></li>
            <li><button>Blog</button></li>
            <li>
              <button>
                <span className="lx-live-chip">
                  Live <span className="lx-live-dot" />
                </span>
              </button>
            </li>
            <li><button>Precios</button></li>
          </ul>

          <div className="lx-nav-ctas">
            <button className="lx-btn lx-btn-ghost">Iniciar sesión</button>
            <button className="lx-btn lx-btn-primary">Comenzar gratis</button>
          </div>
        </div>
      </nav>

      {/* ── Content ── */}
      <div className="lx-content">
        {!showCourses ? (
          <>
            {/* ── Hero ── */}
            <div className="lx-hero">
              <div className="lx-hero-left">
                <span className="lx-hero-eyebrow">
                  <span className="lx-eyebrow-dot" />
                  Más de 1,500 cursos disponibles
                </span>

                <h1 className="lx-hero-h1">
                  Aprende las habilidades<br />
                  <em>del futuro</em>
                </h1>

                <p className="lx-hero-desc">
                  Únete a más de 6 millones de estudiantes aprendiendo tecnología,
                  marketing, diseño e idiomas con los mejores expertos de Latinoamérica.
                </p>

                <div className="lx-hero-actions">
                  <button className="lx-btn lx-btn-primary lx-btn-lg" onClick={goToCourses}>
                    Explorar cursos
                  </button>
                  <button className="lx-btn lx-btn-ghost lx-btn-lg" onClick={goToEnterprise}>
                    Para empresas
                  </button>
                </div>

                <div className="lx-hero-trust">
                  <div className="lx-trust-avatars">
                    <span>AG</span>
                    <span>CR</span>
                    <span>ML</span>
                    <span>RS</span>
                  </div>
                  <span>+6M estudiantes activos en Latinoamérica</span>
                </div>
              </div>

              {/* Certificate mockup */}
              <div className="lx-hero-right">
                <div className="lx-cert-mockup">
                  <div className="lx-cert-card">
                    <div className="lx-cert-header">
                      <div className="lx-cert-logo-mini">
                        <span>L</span>
                        Learnix
                      </div>
                      <span className="lx-cert-verified">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                        Verificado
                      </span>
                    </div>

                    <div className="lx-cert-body">
                      <p className="lx-cert-label">Certificado de finalización</p>
                      <h3 className="lx-cert-title">React desde Cero</h3>
                      <p className="lx-cert-sub">Otorgado a — Ana García</p>
                    </div>

                    <hr className="lx-cert-divider" />

                    <div className="lx-cert-footer">
                      <div>
                        <div style={{ marginBottom: 2 }}>Instructor</div>
                        <strong>Carlos Mendoza</strong>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ marginBottom: 2 }}>Fecha</div>
                        <strong>Abril 2026</strong>
                      </div>
                    </div>

                    <div className="lx-cert-badge-row">
                      <span className="lx-cert-skill">React</span>
                      <span className="lx-cert-skill">JavaScript</span>
                      <span className="lx-cert-skill">Frontend</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Stats Strip ── */}
            <div className="lx-stats-strip">
              <div className="lx-stats-inner">
                {stats.map(s => (
                  <div className="lx-stat" key={s.label}>
                    <div className="lx-stat-icon-wrap">{s.icon}</div>
                    <div>
                      <div className="lx-stat-val">{s.value}</div>
                      <div className="lx-stat-lbl">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Search Bar ── */}
            <div className="lx-search-section">
              <div className="lx-search-bar">
                <svg className="lx-search-ico" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
                <input
                  placeholder="Buscar cursos: React, Python, Marketing, Inglés…"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button onClick={handleSearch}>Buscar</button>
              </div>
              <div className="lx-search-chips">
                <span className="lx-chip-label-small">Populares:</span>
                {['React', 'Python', 'Marketing', 'Inglés', 'Figma'].map(tag => (
                  <button key={tag} className="lx-search-chip"
                    onClick={() => { setSearchTerm(tag); setShowCourses(true); }}>
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Featured Courses ── */}
            <section className="lx-featured">
              <div className="lx-sec-head">
                <p className="lx-sec-label">Destacados</p>
                <h2>Cursos más populares</h2>
                <p>Los cursos mejor valorados seleccionados para ti</p>
              </div>

              <div className="lx-courses-grid">
                {featuredCourses.slice(0, 6).map(c => <CourseCard key={c.id} course={c} />)}
              </div>

              <button className="lx-view-all" onClick={goToCourses}>
                Ver todos los cursos <ArrowRight />
              </button>
            </section>

            {/* ── Categories ── */}
            <section className="lx-categories">
              <div className="lx-categories-inner">
                <div className="lx-sec-head">
                  <p className="lx-sec-label">Áreas de estudio</p>
                  <h2>Explora por categoría</h2>
                  <p>Encuentra el camino de aprendizaje perfecto para ti</p>
                </div>

                <div className="lx-cat-grid">
                  {categories.filter(c => c !== 'Todos').map(cat => {
                    const count = allCourses.filter(c => c.category === cat).length;
                    return (
                      <div key={cat} className="lx-cat-card"
                        onClick={() => { setSelectedCategory(cat); setShowCourses(true); }}>
                        <span className="lx-cat-count">{count} cursos</span>
                        <h3 className="lx-cat-name">{cat}</h3>
                        <span className="lx-cat-arrow"><ArrowRight /></span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* ── Pricing ── */}
            <section className="lx-pricing">
              <div className="lx-sec-head">
                <p className="lx-sec-label">Membresías</p>
                <h2>Elige tu plan</h2>
                <p>Selecciona la membresía que mejor se adapte a tus necesidades</p>
              </div>

              <div className="lx-plans-grid">
                {memberships.map(m => (
                  <div key={m.id}
                    className={`lx-plan-card${m.highlighted ? ' featured' : ''}`}
                    style={{ '--accent-color': m.color } as React.CSSProperties}>
                    {m.highlighted && <span className="lx-plan-popular">Más popular</span>}
                    <h3 className="lx-plan-name">{m.name}</h3>
                    <div className="lx-plan-price-wrap">
                      <span className="lx-plan-amount">{m.price}</span>
                      {m.period && <span className="lx-plan-period">{m.period}</span>}
                    </div>
                    <p className="lx-plan-desc">{m.description}</p>
                    <hr className="lx-plan-divider" />
                    <ul className="lx-plan-features">
                      {m.features.map((f, i) => (
                        <li key={i}>
                          <CheckIcon color={m.color} />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <button className={`lx-plan-btn ${m.highlighted ? 'lx-plan-btn-primary' : 'lx-plan-btn-outline'}`}>
                      {m.buttonText}
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </>

        ) : showEnterprise ? (

          /* ── Enterprise Page ── */
          <section className="lx-enterprise-page">
            <div className="lx-sec-head" style={{ maxWidth: 700 }}>
              <p className="lx-sec-label">Soluciones corporativas</p>
              <h2>Empresas que confían en Learnix</h2>
              <p>Líderes que ya impulsan sus equipos con nuestras soluciones de formación corporativa.</p>
            </div>

            <div className="lx-enterprise-grid">
              {enterpriseSolutions.map(item => (
                <div className="lx-enterprise-card" key={item.title}>
                  <div className="lx-ent-icon-wrap">{item.icon}</div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>

            <h3 className="lx-companies-title">Empresas relacionadas</h3>
            <div className="lx-companies-grid">
              {relatedCompanies.map(co => (
                <div className="lx-company-card" key={co.name}>
                  <div className="lx-company-head">
                    <div className="lx-company-initial">{co.name.charAt(0)}</div>
                    <div>
                      <h4>{co.name}</h4>
                      <span className="lx-company-industry">{co.industry}</span>
                    </div>
                  </div>
                  <p>{co.description}</p>
                  <span className="lx-company-employees">{co.employees} empleados</span>
                </div>
              ))}
            </div>

            <div className="lx-ent-actions">
              <button className="lx-btn lx-btn-primary lx-btn-lg" onClick={resetHome}>
                Volver al inicio
              </button>
              <button className="lx-btn lx-btn-ghost lx-btn-lg" onClick={goToCourses}>
                Ver cursos
              </button>
            </div>
          </section>

        ) : (

          /* ── Catalog Page ── */
          <section className="lx-catalog">
            <div className="lx-catalog-head">
              <div className="lx-catalog-info">
                <h1>
                  {selectedCategory === 'Todos'
                    ? searchTerm ? `Resultados para "${searchTerm}"` : 'Todos los cursos'
                    : selectedCategory}
                </h1>
                <p>{filteredCourses.length} cursos encontrados</p>
              </div>

              <div className="lx-catalog-search">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
                <input
                  placeholder="Buscar en cursos…"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="lx-filters">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`lx-filter-btn${selectedCategory === cat ? ' active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}>
                  {cat}
                  {cat !== 'Todos' && (
                    <span className="lx-filter-count">
                      {allCourses.filter(c => c.category === cat).length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {filteredCourses.length > 0 ? (
              <div className="lx-catalog-grid">
                {filteredCourses.map(c => <CourseCard key={c.id} course={c} />)}
              </div>
            ) : (
              <div className="lx-empty">
                <span className="lx-empty-icon">🔍</span>
                <h3>No se encontraron cursos</h3>
                <p>Intenta con otros términos de búsqueda o cambia el filtro de categoría</p>
                <button onClick={() => { setSearchTerm(''); setSelectedCategory('Todos'); }}>
                  Ver todos los cursos
                </button>
              </div>
            )}
          </section>
        )}
      </div>

      {/* WhatsApp FAB */}
      <a href="https://wa.me/" className="lx-whatsapp" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  );
}
