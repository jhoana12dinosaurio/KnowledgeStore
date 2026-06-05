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

const alliedCompanies = [
  { initial: 'G', name: 'Google', sector: 'Tecnología', description: 'Innovación en búsqueda, cloud computing y soluciones empresariales.', benefits: ['Acceso a vacantes exclusivas', 'Proyectos con APIs oficiales', 'Eventos de Networking'] },
  { initial: 'M', name: 'Microsoft', sector: 'Tecnología', description: 'Software empresarial, cloud computing y herramientas de productividad.', benefits: ['Certificaciones Azure', 'Soporte de mentores M.', 'Licencias de desarrollo'] },
  { initial: 'A', name: 'Apple', sector: 'Tecnología', description: 'Innovación en hardware, software y servicios digitales.', benefits: ['Revisión de portafolio iOS', 'Guías de diseño Human Interface', 'Acceso a betas'] },
  { initial: 'I', name: 'IBM', sector: 'Tecnología', description: 'Soluciones de enterprise, infraestructura y servicios cloud.', benefits: ['Talleres de IA y Watson', 'Bolsa de trabajo Global', 'Credenciales verificables'] },
];

const testimonials = [
  { name: "Mateo R.", role: "Data Scientist en Google", text: "Empecé aprendiendo Python desde cero en Learnix. El nivel de los proyectos prácticos me dio el portafolio exacto que pedían en la entrevista técnica para unirme al equipo.", avatar: "👨‍💻", tag: "Data Science" },
  { name: "Valeria C.", role: "Software Engineer en Apple", text: "Los convenios de empleabilidad son reales. Mi perfil fue recomendado directamente al equipo de reclutamiento tras terminar la ruta completa de arquitectura de software.", avatar: "👩‍💻", tag: "Ingeniería" },
  { name: "Luis F.", role: "Data Analyst en Microsoft", text: "Pasar de la universidad a una empresa top parecía imposible. Las mentorías uno a uno y el enfoque en análisis de datos fueron la clave para destacar mi perfil.", avatar: "🧑‍💻", tag: "Análisis de Datos" }
];

const memberships = [
  { id: 'basic', name: 'Básico', price: 'Gratis', period: '', description: 'Perfecto para comenzar tu aprendizaje', features: ['Acceso a cursos gratuitos', 'Comunidad de estudiantes', 'Certificados básicos', 'Soporte por email'], buttonText: 'Comenzar gratis', highlighted: false, color: '#6366F1' },
  { id: 'pro', name: 'Pro', price: '$29', period: '/mes', description: 'Todo lo que necesitas para crecer profesionalmente', features: ['Acceso a todos los cursos', 'Descargas offline', 'Certificados verificados', 'Proyectos prácticos', 'Mentoría grupal mensual', 'Soporte prioritario 24/7'], buttonText: 'Obtener Pro', highlighted: true, color: '#00C896' },
  { id: 'enterprise', name: 'Empresas', price: '$99', period: '/usuario/mes', description: 'Solución completa para equipos y empresas', features: ['Todo lo de Pro incluido', 'Panel de administración', 'Reportes y analytics', 'Rutas personalizadas', 'API de integración', 'Account manager dedicado', 'Facturación unificada'], buttonText: 'Contactar ventas', highlighted: false, color: '#8B5CF6' },
];

const blogPosts = [
  { id: 1, title: 'Dominando el Análisis de Datos con Python en 2026', date: '4 Jun 2026', readTime: '8 min', category: 'Data Science', image: '🐍', excerpt: 'Exploramos las librerías imprescindibles para procesar grandes volúmenes de datos y crear dashboards interactivos desde cero.' },
  { id: 2, title: 'El futuro de React: Server Components y rendimiento', date: '1 Jun 2026', readTime: '5 min', category: 'Desarrollo Web', image: '⚛️', excerpt: 'Descubre cómo los Server Components están cambiando la forma en que construimos y optimizamos aplicaciones web escalables.' },
  { id: 3, title: 'Guía: Cómo conseguir tu primer trabajo remoto en Tech', date: '25 May 2026', readTime: '10 min', category: 'Carrera', image: '💼', excerpt: 'Estrategias probadas para optimizar tu perfil, destacar en GitHub y superar entrevistas técnicas internacionales con éxito.' },
  { id: 4, title: 'Diseño UX/UI: De wireframes a prototipos de alta fidelidad', date: '18 May 2026', readTime: '6 min', category: 'Diseño UX/UI', image: '🎨', excerpt: 'Conoce el flujo de trabajo moderno utilizando las últimas actualizaciones de Figma para diseño colaborativo y sistemas de diseño.' }
];

/* ── Stars ── */
const StarRating = ({ rating }: { rating: number }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="lx-stars">
      {[...Array(5)].map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" width="13" height="13" fill={i < full ? '#F4B942' : (i === full && half ? 'url(#hg)' : '#2a3448')}>
          <defs><linearGradient id="hg"><stop offset="50%" stopColor="#F4B942" /><stop offset="50%" stopColor="#2a3448" /></linearGradient></defs>
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
        </svg>
      ))}
      <span className="lx-star-val">{rating}</span>
    </div>
  );
};

/* ── Course Card ── */
const CourseCard = ({ course, onClick }: { course: typeof allCourses[0], onClick?: () => void }) => (
  <div className="lx-course-card" onClick={onClick} style={{ cursor: 'pointer', transition: 'transform 0.2s', border: '1px solid #334155' }}>
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
        <span className="lx-meta-item">{(course.students / 1000).toFixed(1)}k</span>
        <span className="lx-meta-item">{course.duration}</span>
      </div>
      <div className="lx-card-footer">
        <span className="lx-level-tag">{course.level}</span>
        <span className={`lx-price${course.price !== 'Gratis' ? ' lx-price-paid' : ''}`}>{course.price}</span>
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

/* ── Allied Company Card ── */
const AlliedCompanyCard = ({ company, onViewMore }: { company: typeof alliedCompanies[0], onViewMore: () => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div className={`lx-allied-logo-card ${isHovered ? 'lx-card-active' : ''}`} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div className="lx-allied-card-front">
        <div className="lx-allied-logo-circle">{company.initial}</div>
        <h4>{company.name}</h4>
        <span className="lx-allied-sector">{company.sector}</span>
      </div>
      <div className="lx-allied-card-back">
        <h4 className="lx-allied-card-title">{company.name}</h4>
        <p className="lx-allied-card-description" style={{ fontSize: '0.85rem' }}>{company.description}</p>
        <button className="lx-btn lx-btn-sm lx-btn-brand" onClick={onViewMore} style={{ marginTop: 'auto' }}>Conocer convenio</button>
      </div>
    </div>
  );
};

/* ══════════════════════════════════ */
export default function App() {
  const [searchTerm,       setSearchTerm]       = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  
  // NAVEGACIÓN PRINCIPAL
  const [showCourses,      setShowCourses]       = useState(false);
  const [showEnterprise,   setShowEnterprise]    = useState(false);
  const [showLive,         setShowLive]          = useState(false);
  const [showBlog,         setShowBlog]          = useState(false);
  
  // ESTADOS PARA MODALES DE PAGOS Y FORMULARIOS
  const [selectedPlan,     setSelectedPlan]      = useState<typeof memberships[0] | null>(null);
  const [selectedFreePlan, setSelectedFreePlan]  = useState<typeof memberships[0] | null>(null);
  const [showSalesModal,   setShowSalesModal]    = useState(false);

  // ESTADOS DE LOS FORMULARIOS (Para las validaciones)
  const [freeForm, setFreeForm] = useState({ name: '', email: '', password: '' });
  const [paymentForm, setPaymentForm] = useState({ name: '', number: '', expiry: '', cvc: '' });
  const [salesForm, setSalesForm] = useState({ name: '', email: '', size: '', message: '' });
  const [formError, setFormError] = useState('');

  // ESTADOS PARA MODALES DE DETALLE
  const [selectedCourseInfo, setSelectedCourseInfo]   = useState<typeof allCourses[0] | null>(null);
  const [selectedCompanyInfo, setSelectedCompanyInfo] = useState<typeof alliedCompanies[0] | null>(null);
  const [selectedBlogPost, setSelectedBlogPost]       = useState<typeof blogPosts[0] | null>(null);

  const [chatMessage,      setChatMessage]       = useState('');
  const [chatMessages,     setChatMessages]      = useState([
    { user: 'JuanP', text: '¡Excelente explicación!' },
    { user: 'Ana Dev', text: '¿Esto aplica también para los proyectos de Data?' },
    { user: 'Carlos M.', text: 'El código queda mucho más limpio así.' }
  ]);

  const filteredCourses = useMemo(() =>
    allCourses.filter(c => {
      const q = searchTerm.toLowerCase();
      const matchSearch = !q || c.title.toLowerCase().includes(q) || c.category.toLowerCase().includes(q) || c.instructor.toLowerCase().includes(q);
      const matchCat = selectedCategory === 'Todos' || c.category === selectedCategory;
      return matchSearch && matchCat;
    }),
    [searchTerm, selectedCategory]
  );

  // FUNCIONES DE NAVEGACIÓN Y CIERRE
  const resetHome = () => { setShowCourses(false); setShowEnterprise(false); setShowLive(false); setShowBlog(false); setSearchTerm(''); setSelectedCategory('Todos'); };
  const goToCourses = () => { setShowCourses(true); setShowEnterprise(false); setShowLive(false); setShowBlog(false); };
  const goToEnterprise = () => { setShowEnterprise(true); setShowCourses(false); setShowLive(false); setShowBlog(false); };
  const goToLive = () => { setShowLive(true); setShowCourses(false); setShowEnterprise(false); setShowBlog(false); };
  const goToBlog = () => { setShowBlog(true); setShowCourses(false); setShowEnterprise(false); setShowLive(false); };
  
  const scrollToPricing = () => {
    resetHome();
    setTimeout(() => document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const closeModals = () => {
    setSelectedPlan(null);
    setSelectedFreePlan(null);
    setShowSalesModal(false);
    setFormError(''); // Limpiar errores al cerrar
    setFreeForm({ name: '', email: '', password: '' });
    setPaymentForm({ name: '', number: '', expiry: '', cvc: '' });
    setSalesForm({ name: '', email: '', size: '', message: '' });
  };

  // ══════ FUNCIONES DE VALIDACIÓN DE FORMULARIOS ══════
  const handleFreeSubmit = () => {
    if (!freeForm.name || !freeForm.email || !freeForm.password) {
      setFormError('Por favor, completa todos los campos.');
      return;
    }
    if (!freeForm.email.includes('@')) {
      setFormError('Ingresa un correo electrónico válido.');
      return;
    }
    setFormError('');
    alert('¡Cuenta creada exitosamente! Comienza a aprender.');
    closeModals();
  };

  const handlePaymentSubmit = () => {
    if (!paymentForm.name || !paymentForm.number || !paymentForm.expiry || !paymentForm.cvc) {
      setFormError('Por favor, completa todos los campos del pago.');
      return;
    }
    const cleanCardNumber = paymentForm.number.replace(/\s/g, '');
    if (cleanCardNumber.length !== 16 || isNaN(Number(cleanCardNumber))) {
      setFormError('El número de tarjeta debe tener 16 dígitos válidos.');
      return;
    }
    if (paymentForm.cvc.length < 3 || paymentForm.cvc.length > 4 || isNaN(Number(paymentForm.cvc))) {
      setFormError('El código CVC debe tener 3 o 4 números.');
      return;
    }
    setFormError('');
    alert(`¡Pago exitoso! Bienvenido al plan ${selectedPlan?.name}.`);
    closeModals();
  };

  const handleSalesSubmit = () => {
    if (!salesForm.name || !salesForm.email || !salesForm.size || !salesForm.message) {
      setFormError('Por favor, completa todos los datos de contacto.');
      return;
    }
    if (!salesForm.email.includes('@')) {
      setFormError('Ingresa un correo corporativo válido.');
      return;
    }
    setFormError('');
    alert('¡Solicitud enviada! Nuestro equipo de ventas te contactará pronto.');
    closeModals();
  };

  const sendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if(chatMessage.trim() === '') return;
    setChatMessages([...chatMessages, { user: 'Tú', text: chatMessage }]);
    setChatMessage('');
  };

  return (
    <div className="lx-app">
      <style>{`
        @keyframes scrollMarquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .marquee-container { overflow: hidden; white-space: nowrap; width: 100%; position: relative; padding: 2rem 0; background: linear-gradient(90deg, rgba(15,23,42,1) 0%, rgba(30,41,59,0.5) 50%, rgba(15,23,42,1) 100%); border-top: 1px solid #1e293b; border-bottom: 1px solid #1e293b; }
        .marquee-content { display: inline-flex; animation: scrollMarquee 30s linear infinite; }
        .marquee-content:hover { animation-play-state: paused; }
        .company-logo { font-size: 1.5rem; font-weight: bold; color: #64748b; margin: 0 3rem; display: inline-flex; align-items: center; gap: 0.5rem; transition: color 0.3s ease; cursor: default;}
        .company-logo:hover { color: #e2e8f0; }
        .testimonial-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; padding: 2rem 0; max-width: 1200px; margin: 0 auto; }
        .testimonial-card { background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 2rem; position: relative; transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .testimonial-card:hover { transform: translateY(-5px); box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5); border-color: #6366F1; }
        .blog-card:hover h3 { color: #6366F1; }
        .blog-card:hover { transform: translateY(-5px); box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5); border-color: #6366F1 !important; }
      `}</style>

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
            <li><button onClick={goToCourses} style={{ color: showCourses ? '#fff' : '' }}>Cursos</button></li>
            <li><button onClick={goToEnterprise} style={{ color: showEnterprise ? '#fff' : '' }}>Empresas</button></li>
            <li><button onClick={goToBlog} style={{ color: showBlog ? '#fff' : '' }}>Blog</button></li>
            <li>
              <button onClick={goToLive} style={{ color: showLive ? '#fff' : '' }}>
                <span className="lx-live-chip">Live <span className="lx-live-dot" style={{ backgroundColor: 'red', width: '8px', height: '8px', borderRadius: '50%', display: 'inline-block', marginLeft: '4px', animation: 'pulse 1.5s infinite' }} /></span>
              </button>
            </li>
            <li><button onClick={scrollToPricing}>Precios</button></li>
          </ul>

          <div className="lx-nav-ctas">
            <button className="lx-btn lx-btn-ghost">Iniciar sesión</button>
            <button className="lx-btn lx-btn-primary" onClick={scrollToPricing}>Comenzar gratis</button>
          </div>
        </div>
      </nav>

      {/* ── Content ── */}
      <div className="lx-content">
        
        {showLive ? (
          /* ── SECCIÓN LIVE ── */
          <section style={{ padding: '2rem', color: 'white', maxWidth: '1200px', margin: '0 auto', marginTop: '80px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h1 style={{ fontSize: '2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ color: '#ef4444' }}>🔴</span> Masterclass: Desarrollo y Arquitectura</h1>
              <span style={{ backgroundColor: '#ef444420', color: '#ef4444', padding: '0.5rem 1rem', borderRadius: '20px', fontWeight: 'bold' }}>EN VIVO • 1,204 espectadores</span>
            </div>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 65%', minWidth: '300px' }}>
                <div style={{ aspectRatio: '16/9', backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="#6366F1" style={{ opacity: 0.8, cursor: 'pointer' }}><path d="M8 5v14l11-7z" /></svg>
                  <p style={{ color: '#94a3b8', marginTop: '1rem' }}>La transmisión está en curso...</p>
                </div>
              </div>
              <div style={{ flex: '1 1 30%', minWidth: '300px', backgroundColor: '#1e293b', borderRadius: '16px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', height: '600px' }}>
                <div style={{ padding: '1rem', borderBottom: '1px solid #334155' }}><h3 style={{ margin: 0 }}>Chat de la clase</h3></div>
                <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {chatMessages.map((msg, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '0.85rem', color: msg.user === 'Tú' ? '#00C896' : '#6366F1', fontWeight: 'bold' }}>{msg.user}</span>
                      <span style={{ color: '#e2e8f0', backgroundColor: '#0f172a', padding: '0.5rem 0.75rem', borderRadius: '8px', width: 'fit-content', marginTop: '0.2rem' }}>{msg.text}</span>
                    </div>
                  ))}
                </div>
                <form onSubmit={sendChatMessage} style={{ padding: '1rem', borderTop: '1px solid #334155', display: 'flex', gap: '0.5rem' }}>
                  <input type="text" value={chatMessage} onChange={(e) => setChatMessage(e.target.value)} placeholder="Escribe un mensaje..." style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', background: '#0f172a', border: '1px solid #334155', color: 'white', outline: 'none' }} />
                  <button type="submit" style={{ backgroundColor: '#6366F1', color: 'white', border: 'none', borderRadius: '8px', padding: '0 1rem', cursor: 'pointer', fontWeight: 'bold' }}>Enviar</button>
                </form>
              </div>
            </div>
          </section>

        ) : showBlog ? (
          /* ── SECCIÓN BLOG ── */
          <section style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', marginTop: '80px' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <span style={{ color: '#6366F1', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.9rem' }}>Artículos y Tutoriales</span>
              <h1 style={{ color: 'white', fontSize: '3rem', margin: '1rem 0' }}>El Blog de Learnix</h1>
              <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>Descubre tendencias, guías paso a paso y consejos para potenciar tu carrera profesional en el mundo de la tecnología.</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
              {blogPosts.map(post => (
                <article key={post.id} className="blog-card" onClick={() => setSelectedBlogPost(post)} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s' }}>
                  <div style={{ height: '180px', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', borderBottom: '1px solid #334155' }}>{post.image}</div>
                  <div style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1rem' }}>
                      <span style={{ color: '#00C896', fontWeight: 'bold', backgroundColor: '#00C89615', padding: '4px 8px', borderRadius: '4px' }}>{post.category}</span>
                      <span>{post.date} • {post.readTime} lect.</span>
                    </div>
                    <h3 style={{ color: 'white', fontSize: '1.25rem', margin: '0 0 1rem 0', lineHeight: '1.4', transition: 'color 0.2s' }}>{post.title}</h3>
                    <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.6', margin: '0 0 1.5rem 0' }}>{post.excerpt}</p>
                    <span style={{ color: '#6366F1', fontWeight: 'bold', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>Leer artículo completo <ArrowRight /></span>
                  </div>
                </article>
              ))}
            </div>
          </section>

        ) : showEnterprise ? (
          /* ── SECCIÓN EMPRESAS ── */
          <section className="lx-allied-page" style={{ marginTop: '80px' }}>
            <div className="lx-allied-header">
              <div className="lx-allied-head-content"><h1>Empresas Aliadas</h1></div>
            </div>
            <div className="lx-allied-companies-section">
              <div className="lx-allied-logos-grid">
                {alliedCompanies.map((company, idx) => (
                  <AlliedCompanyCard key={idx} company={company} onViewMore={() => setSelectedCompanyInfo(company)} />
                ))}
              </div>
            </div>
          </section>

        ) : showCourses ? (
          /* ── CATÁLOGO DE CURSOS ── */
          <section className="lx-catalog" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', marginTop: '80px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <h1 style={{ color: 'white', fontSize: '2.5rem', margin: 0 }}>Catálogo de Cursos</h1>
                <div style={{ display: 'flex', alignItems: 'center', background: '#1e293b', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #334155', minWidth: '300px', flexGrow: 1, maxWidth: '500px' }}>
                  <span style={{ color: '#94a3b8', marginRight: '8px' }}>🔍</span>
                  <input type="text" placeholder="Buscar por tecnología, curso o instructor..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none', fontSize: '1rem' }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {categories.map(cat => (
                  <button key={cat} onClick={() => setSelectedCategory(cat)} style={{ padding: '0.5rem 1rem', borderRadius: '20px', border: `1px solid ${selectedCategory === cat ? '#6366F1' : '#334155'}`, background: selectedCategory === cat ? '#6366F1' : 'transparent', color: selectedCategory === cat ? 'white' : '#cbd5e1', cursor: 'pointer', transition: 'all 0.2s', fontWeight: '500' }}>
                    {cat}
                  </button>
                ))}
              </div>
              <p style={{ color: '#94a3b8', margin: 0, borderBottom: '1px solid #1e293b', paddingBottom: '1rem' }}>
                Mostrando <strong style={{ color: 'white' }}>{filteredCourses.length}</strong> curso{filteredCourses.length !== 1 ? 's' : ''}
              </p>
            </div>

            {filteredCourses.length > 0 ? (
              <div className="lx-catalog-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {filteredCourses.map(c => <CourseCard key={c.id} course={c} onClick={() => setSelectedCourseInfo(c)} />)}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '4rem', background: '#1e293b', borderRadius: '16px', border: '1px dashed #334155', maxWidth: '600px', margin: '0 auto' }}>
                <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>😢</span>
                <h3 style={{ color: 'white', margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>No encontramos resultados</h3>
                <p style={{ color: '#94a3b8', margin: '0 0 1.5rem 0' }}>No hay cursos que coincidan con <strong>"{searchTerm}"</strong>.</p>
                <button onClick={() => { setSearchTerm(''); setSelectedCategory('Todos'); }} style={{ background: '#6366F1', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Limpiar búsqueda</button>
              </div>
            )}
          </section>

        ) : (
          /* ── HOME (INICIO PRINCIPAL) ── */
          <>
            <div style={{ textAlign: 'center', padding: '4rem 1rem', maxWidth: '800px', margin: '0 auto', marginTop: '40px' }}>
              <span className="lx-hero-eyebrow" style={{ justifyContent: 'center', display: 'inline-flex' }}>
                <span className="lx-eyebrow-dot" /> Más de 1,500 cursos disponibles
              </span>
              <h1 className="lx-hero-h1" style={{ fontSize: '3.5rem', lineHeight: '1.1', marginBottom: '1.5rem' }}>
                Aprende las habilidades<br /><em style={{ color: '#00C896', fontStyle: 'normal' }}>del futuro</em>
              </h1>
              <p className="lx-hero-desc" style={{ fontSize: '1.2rem', margin: '0 auto 2.5rem auto', color: '#94a3b8' }}>
                Únete a más de 6 millones de estudiantes preparándose para el mercado laboral global. Nuestros egresados son reclutados por las empresas tecnológicas más grandes del mundo.
              </p>
              <div className="lx-hero-actions" style={{ justifyContent: 'center' }}>
                <button className="lx-btn lx-btn-primary lx-btn-lg" onClick={goToCourses}>Explorar ruta de carrera</button>
                <button className="lx-btn lx-btn-ghost lx-btn-lg" onClick={scrollToPricing}>Ver planes y convenios</button>
              </div>
            </div>

            {/* CARRUSEL DE EMPRESAS LIMPIO (Sin la inicial) */}
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <p style={{ color: '#cbd5e1', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1.5rem' }}>Nuestros estudiantes consiguen trabajo en:</p>
              <div className="marquee-container">
                <div className="marquee-content">
                  <span className="company-logo">Google</span><span className="company-logo">Microsoft</span><span className="company-logo">Apple</span><span className="company-logo">Amazon</span><span className="company-logo">Meta</span><span className="company-logo">IBM</span>
                  <span className="company-logo">Google</span><span className="company-logo">Microsoft</span><span className="company-logo">Apple</span><span className="company-logo">Amazon</span><span className="company-logo">Meta</span><span className="company-logo">IBM</span>
                </div>
              </div>
            </div>

            <section style={{ padding: '5rem 2rem', backgroundColor: '#0f172a' }}>
              <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '2.5rem', color: 'white', margin: '0 0 1rem 0' }}>Estudia hoy, trabaja mañana</h2>
                <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>A través de nuestros convenios directos con reclutadores de la industria Tech, tu perfil llega a manos de quienes toman las decisiones.</p>
              </div>
              <div className="testimonial-grid">
                {testimonials.map((test, idx) => (
                  <div className="testimonial-card" key={idx}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                      <div style={{ width: '50px', height: '50px', backgroundColor: '#334155', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>{test.avatar}</div>
                      <div>
                        <h4 style={{ color: 'white', margin: '0 0 0.2rem 0', fontSize: '1.1rem' }}>{test.name}</h4>
                        <p style={{ color: '#00C896', margin: 0, fontSize: '0.85rem', fontWeight: 'bold' }}>{test.role}</p>
                      </div>
                    </div>
                    <p style={{ color: '#cbd5e1', lineHeight: '1.6', fontSize: '0.95rem', fontStyle: 'italic', marginBottom: '1.5rem' }}>"{test.text}"</p>
                    <span style={{ backgroundColor: '#6366F120', color: '#6366F1', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' }}>Ruta: {test.tag}</span>
                  </div>
                ))}
              </div>
            </section>

            <div className="lx-stats-strip">
              <div className="lx-stats-inner">
                {stats.map(s => (
                  <div className="lx-stat" key={s.label}>
                    <div className="lx-stat-icon-wrap">{s.icon}</div>
                    <div><div className="lx-stat-val">{s.value}</div><div className="lx-stat-lbl">{s.label}</div></div>
                  </div>
                ))}
              </div>
            </div>

            <section id="pricing-section" className="lx-pricing">
              <div className="lx-sec-head">
                <p className="lx-sec-label">Membresías</p>
                <h2>Elige tu plan</h2>
                <p>Selecciona la membresía que te abrirá las puertas al mercado laboral Tech</p>
              </div>
              <div className="lx-plans-grid">
                {memberships.map(m => (
                  <div key={m.id} className={`lx-plan-card${m.highlighted ? ' featured' : ''}`} style={{ '--accent-color': m.color } as React.CSSProperties}>
                    {m.highlighted && <span className="lx-plan-popular">Más popular</span>}
                    <h3 className="lx-plan-name">{m.name}</h3>
                    <div className="lx-plan-price-wrap"><span className="lx-plan-amount">{m.price}</span>{m.period && <span className="lx-plan-period">{m.period}</span>}</div>
                    <p className="lx-plan-desc">{m.description}</p>
                    <hr className="lx-plan-divider" />
                    <ul className="lx-plan-features">{m.features.map((f, i) => (<li key={i}><CheckIcon color={m.color} />{f}</li>))}</ul>
                    <button className={`lx-plan-btn ${m.highlighted ? 'lx-plan-btn-primary' : 'lx-plan-btn-outline'}`} onClick={() => { m.id === 'enterprise' ? setShowSalesModal(true) : m.price === 'Gratis' ? setSelectedFreePlan(m) : setSelectedPlan(m); }}>{m.buttonText}</button>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* ════════════ MODALES GLOBALES ════════════ */}

        {/* ── MODAL DEL BLOG ── */}
        {selectedBlogPost && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(4px)' }} onClick={() => setSelectedBlogPost(null)}>
            <div style={{ backgroundColor: '#1e293b', borderRadius: '16px', maxWidth: '700px', width: '100%', border: '1px solid #334155', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.5)', overflow: 'hidden', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
              <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', padding: '2rem', borderBottom: '1px solid #334155', position: 'relative' }}>
                <button onClick={() => setSelectedBlogPost(null)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem', fontSize: '0.85rem' }}>
                  <span style={{ color: '#00C896', backgroundColor: '#00C89615', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>{selectedBlogPost.category}</span>
                  <span style={{ color: '#94a3b8', display: 'flex', alignItems: 'center' }}>{selectedBlogPost.date} • {selectedBlogPost.readTime} de lectura</span>
                </div>
                <h2 style={{ color: 'white', margin: '0 0 1rem 0', fontSize: '2rem', lineHeight: '1.3' }}>{selectedBlogPost.title}</h2>
              </div>
              <div style={{ padding: '2.5rem', overflowY: 'auto', color: '#cbd5e1', lineHeight: '1.8', fontSize: '1.05rem' }}>
                <div style={{ fontSize: '5rem', textAlign: 'center', marginBottom: '2rem', background: '#0f172a', padding: '2rem', borderRadius: '16px', border: '1px solid #334155' }}>
                  {selectedBlogPost.image}
                </div>
                <p style={{ fontSize: '1.15rem', color: 'white', fontWeight: 'bold', marginBottom: '1.5rem' }}>{selectedBlogPost.excerpt}</p>
                <p>En el panorama actual del desarrollo, mantenerse actualizado no es solo una ventaja competitiva, es una necesidad. A medida que las tecnologías evolucionan, también lo hacen las herramientas que usamos a diario en nuestros proyectos profesionales.</p>
                <h3 style={{ color: 'white', marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.4rem' }}>Puntos Clave del Artículo</h3>
                <ul style={{ paddingLeft: '1.5rem', marginBottom: '2rem', color: '#94a3b8' }}>
                  <li style={{ marginBottom: '0.5rem' }}><strong style={{ color: '#e2e8f0' }}>Implementación práctica:</strong> Cómo llevar estos conceptos teóricos a tus proyectos reales desde el día uno.</li>
                  <li style={{ marginBottom: '0.5rem' }}><strong style={{ color: '#e2e8f0' }}>Optimización:</strong> Mejores prácticas recomendadas por ingenieros Senior en la industria.</li>
                  <li style={{ marginBottom: '0.5rem' }}><strong style={{ color: '#e2e8f0' }}>Herramientas esenciales:</strong> El stack tecnológico necesario para dominar esta habilidad por completo.</li>
                </ul>
                <p>La adopción temprana de estas arquitecturas y metodologías te permitirá escalar tus aplicaciones de manera más eficiente, reduciendo la deuda técnica y mejorando significativamente la experiencia del usuario final.</p>
                <div style={{ marginTop: '3rem', padding: '1.5rem', background: '#0f172a', borderRadius: '12px', borderLeft: '4px solid #6366F1' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'white' }}>¿Quieres dominar este tema?</h4>
                  <p style={{ margin: '0 0 1rem 0', fontSize: '0.95rem' }}>Aprende esto y más en nuestra ruta de aprendizaje intensiva.</p>
                  <button onClick={() => { setSelectedBlogPost(null); goToCourses(); }} style={{ background: '#6366F1', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Ver cursos relacionados</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── MODAL DE DETALLE DE CURSO ── */}
        {selectedCourseInfo && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(4px)' }} onClick={() => setSelectedCourseInfo(null)}>
            <div style={{ backgroundColor: '#1e293b', borderRadius: '16px', maxWidth: '600px', width: '100%', border: '1px solid #334155', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.5)', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
              <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', padding: '3rem 2rem', textAlign: 'center', borderBottom: '1px solid #334155', position: 'relative' }}>
                <button onClick={() => setSelectedCourseInfo(null)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                <span style={{ fontSize: '4rem', display: 'block', marginBottom: '1rem' }}>{selectedCourseInfo.image}</span>
                <span style={{ color: '#00C896', backgroundColor: '#00C89615', padding: '4px 10px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold' }}>{selectedCourseInfo.category}</span>
                <h2 style={{ color: 'white', margin: '1rem 0 0.5rem 0', fontSize: '2rem' }}>{selectedCourseInfo.title}</h2>
                <p style={{ color: '#cbd5e1', margin: 0 }}>Dictado por <strong>{selectedCourseInfo.instructor}</strong></p>
              </div>
              <div style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem', borderBottom: '1px solid #334155', paddingBottom: '1.5rem' }}>
                  <div><p style={{ color: '#94a3b8', margin: '0 0 5px 0', fontSize: '0.85rem' }}>Nivel</p><p style={{ color: 'white', fontWeight: 'bold', margin: 0 }}>{selectedCourseInfo.level}</p></div>
                  <div><p style={{ color: '#94a3b8', margin: '0 0 5px 0', fontSize: '0.85rem' }}>Duración</p><p style={{ color: 'white', fontWeight: 'bold', margin: 0 }}>{selectedCourseInfo.duration}</p></div>
                  <div><p style={{ color: '#94a3b8', margin: '0 0 5px 0', fontSize: '0.85rem' }}>Alumnos</p><p style={{ color: 'white', fontWeight: 'bold', margin: 0 }}>{(selectedCourseInfo.students / 1000).toFixed(1)}k</p></div>
                </div>
                <h4 style={{ color: 'white', margin: '0 0 1rem 0', fontSize: '1.2rem' }}>¿Qué aprenderás en este curso?</h4>
                <ul style={{ color: '#cbd5e1', paddingLeft: '1.2rem', lineHeight: '1.8', margin: '0 0 2rem 0' }}>
                  <li>Fundamentos técnicos y estructura avanzada de {selectedCourseInfo.title.split(' ')[0]}.</li>
                  <li>Creación de proyectos prácticos orientados a entornos laborales reales.</li>
                  <li>Buenas prácticas de código y optimización de rendimiento.</li>
                  <li>Preparación directa para superar entrevistas técnicas de esta área.</li>
                </ul>
                <button style={{ width: '100%', background: '#6366F1', color: 'white', border: 'none', padding: '1rem', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => { setSelectedCourseInfo(null); scrollToPricing(); }}>
                  Inscribirme ahora
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── MODAL DE DETALLE DE EMPRESA ── */}
        {selectedCompanyInfo && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(4px)' }} onClick={() => setSelectedCompanyInfo(null)}>
            <div style={{ backgroundColor: '#1e293b', borderRadius: '16px', maxWidth: '500px', width: '100%', border: '1px solid #334155', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.5)', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
              <div style={{ background: '#0f172a', padding: '2rem', textAlign: 'center', borderBottom: '1px solid #334155', position: 'relative' }}>
                <button onClick={() => setSelectedCompanyInfo(null)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                <div style={{ width: '80px', height: '80px', backgroundColor: '#334155', borderRadius: '50%', margin: '0 auto 1rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', color: 'white', fontWeight: 'bold' }}>
                  {selectedCompanyInfo.initial}
                </div>
                <h2 style={{ color: 'white', margin: '0 0 0.5rem 0', fontSize: '1.8rem' }}>{selectedCompanyInfo.name}</h2>
                <span style={{ color: '#6366F1', fontSize: '0.9rem', fontWeight: 'bold' }}>Sector {selectedCompanyInfo.sector}</span>
              </div>
              <div style={{ padding: '2rem' }}>
                <p style={{ color: '#cbd5e1', lineHeight: '1.6', margin: '0 0 1.5rem 0' }}>{selectedCompanyInfo.description}</p>
                <h4 style={{ color: 'white', margin: '0 0 1rem 0' }}>Beneficios del convenio:</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '2rem' }}>
                  {selectedCompanyInfo.benefits.map((ben, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#e2e8f0', background: '#0f172a', padding: '10px', borderRadius: '8px', border: '1px solid #334155' }}>
                      <span style={{ color: '#00C896' }}>✓</span> {ben}
                    </div>
                  ))}
                </div>
                <button style={{ width: '100%', background: 'white', color: '#0f172a', border: 'none', padding: '1rem', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => { alert('Redirigiendo al portal de empleabilidad...'); setSelectedCompanyInfo(null); }}>
                  Ver vacantes disponibles
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── MODALES CON VALIDACIÓN ── */}
        {selectedFreePlan && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(4px)' }}>
            <div style={{ backgroundColor: '#1e293b', borderRadius: '16px', padding: '2.5rem', maxWidth: '400px', width: '100%', border: `1px solid ${selectedFreePlan.color}`, boxShadow: `0 10px 40px -10px ${selectedFreePlan.color}40` }}>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', color: 'white' }}>Crea tu cuenta gratis</h3>
              <p style={{ margin: '0 0 1.5rem 0', color: '#cbd5e1' }}>Estás a un paso de acceder a los cursos del plan <strong>Básico</strong>.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {formError && <p style={{ color: '#ef4444', fontSize: '0.9rem', margin: '0' }}>{formError}</p>}
                <input type="text" placeholder="Nombre completo" value={freeForm.name} onChange={(e) => setFreeForm({...freeForm, name: e.target.value})} style={{ padding: '0.85rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', outline: 'none' }} />
                <input type="email" placeholder="Correo electrónico" value={freeForm.email} onChange={(e) => setFreeForm({...freeForm, email: e.target.value})} style={{ padding: '0.85rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', outline: 'none' }} />
                <input type="password" placeholder="Contraseña" value={freeForm.password} onChange={(e) => setFreeForm({...freeForm, password: e.target.value})} style={{ padding: '0.85rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', outline: 'none' }} />
                <button style={{ backgroundColor: selectedFreePlan.color, color: 'white', padding: '1rem', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginTop: '0.5rem' }} onClick={handleFreeSubmit}>Registrarme ahora</button>
                <button style={{ backgroundColor: 'transparent', color: '#94a3b8', padding: '0.5rem', border: 'none', cursor: 'pointer' }} onClick={closeModals}>Cancelar</button>
              </div>
            </div>
          </div>
        )}

        {selectedPlan && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(4px)' }}>
            <div style={{ backgroundColor: '#1e293b', borderRadius: '16px', padding: '2.5rem', maxWidth: '500px', width: '100%', border: `1px solid ${selectedPlan.color}`, boxShadow: `0 10px 40px -10px ${selectedPlan.color}40`, maxHeight: '90vh', overflowY: 'auto' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', color: 'white' }}>Convenio de pago</h3>
              <p style={{ margin: '0 0 1.5rem 0', color: '#cbd5e1' }}>Plan <strong>{selectedPlan.name}</strong> por <strong style={{ color: selectedPlan.color }}>{selectedPlan.price}</strong> {selectedPlan.period}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {formError && <p style={{ color: '#ef4444', fontSize: '0.9rem', margin: '0' }}>{formError}</p>}
                <input type="text" placeholder="Nombre en la tarjeta" value={paymentForm.name} onChange={(e) => setPaymentForm({...paymentForm, name: e.target.value})} style={{ padding: '0.85rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', outline: 'none' }} />
                <input type="text" placeholder="Número de tarjeta (16 dígitos)" maxLength={16} value={paymentForm.number} onChange={(e) => setPaymentForm({...paymentForm, number: e.target.value})} style={{ padding: '0.85rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', outline: 'none' }} />
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <input type="text" placeholder="MM/YY" value={paymentForm.expiry} onChange={(e) => setPaymentForm({...paymentForm, expiry: e.target.value})} style={{ padding: '0.85rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', width: '100%', outline: 'none' }} />
                  <input type="text" placeholder="CVC" maxLength={4} value={paymentForm.cvc} onChange={(e) => setPaymentForm({...paymentForm, cvc: e.target.value})} style={{ padding: '0.85rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', width: '100%', outline: 'none' }} />
                </div>
                <div style={{ backgroundColor: '#0f172a', padding: '1rem', borderRadius: '8px', border: '1px solid #334155', marginTop: '1rem' }}>
                  <p style={{ margin: '0 0 1rem 0', color: '#cbd5e1', fontSize: '0.9rem', textAlign: 'center' }}>Al aprobar los cursos, obtendrás certificados como este:</p>
                  <div style={{ background: 'linear-gradient(145deg, #f8fafc, #e2e8f0)', padding: '1rem', borderRadius: '8px', border: '2px solid #cbd5e1', color: '#1e293b', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '10px', right: '10px', width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>🏆</div>
                    <h4 style={{ margin: '0 0 5px 0', fontSize: '1rem', color: '#0f172a' }}>CERTIFICADO OFICIAL</h4>
                    <p style={{ margin: '0 0 10px 0', fontSize: '0.75rem', color: '#475569' }}>Se otorga el presente documento a:</p>
                    <h3 style={{ margin: '0 0 15px 0', fontSize: '1.2rem', color: '#1e293b', borderBottom: '1px solid #cbd5e1', paddingBottom: '5px' }}>Tu Nombre Aquí</h3>
                    <p style={{ margin: '0 0 5px 0', fontSize: '0.75rem', color: '#475569' }}>Por concluir satisfactoriamente el programa de formación en plataforma <strong>Learnix</strong>.</p>
                  </div>
                </div>
                <button style={{ backgroundColor: selectedPlan.color, color: 'white', padding: '1rem', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginTop: '0.5rem' }} onClick={handlePaymentSubmit}>Pagar {selectedPlan.price} y Obtener Beneficios</button>
                <button style={{ backgroundColor: 'transparent', color: '#94a3b8', padding: '0.5rem', border: 'none', cursor: 'pointer' }} onClick={closeModals}>Cancelar</button>
              </div>
            </div>
          </div>
        )}

        {showSalesModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(4px)' }}>
            <div style={{ backgroundColor: '#1e293b', borderRadius: '16px', padding: '2.5rem', maxWidth: '500px', width: '100%', border: `1px solid #8B5CF6`, boxShadow: `0 10px 40px -10px #8B5CF640` }}>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', color: 'white' }}>Contactar a Ventas</h3>
              <p style={{ margin: '0 0 1.5rem 0', color: '#cbd5e1' }}>Déjanos tus datos y un ejecutivo especializado se comunicará contigo.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {formError && <p style={{ color: '#ef4444', fontSize: '0.9rem', margin: '0' }}>{formError}</p>}
                <input type="text" placeholder="Nombre completo" value={salesForm.name} onChange={(e) => setSalesForm({...salesForm, name: e.target.value})} style={{ padding: '0.85rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', outline: 'none' }} />
                <input type="email" placeholder="Correo corporativo" value={salesForm.email} onChange={(e) => setSalesForm({...salesForm, email: e.target.value})} style={{ padding: '0.85rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', outline: 'none' }} />
                <select value={salesForm.size} onChange={(e) => setSalesForm({...salesForm, size: e.target.value})} style={{ padding: '0.85rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', outline: 'none', appearance: 'none' }}>
                  <option value="">Tamaño de la empresa</option>
                  <option value="1-50">1 - 50 empleados</option>
                  <option value="51-200">51 - 200 empleados</option>
                  <option value="201-500">201 - 500 empleados</option>
                  <option value="500+">Más de 500 empleados</option>
                </select>
                <textarea placeholder="Cuéntanos un poco sobre las necesidades de tu equipo..." value={salesForm.message} onChange={(e) => setSalesForm({...salesForm, message: e.target.value})} rows={4} style={{ padding: '0.85rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', outline: 'none', resize: 'none' }}></textarea>
                <button style={{ backgroundColor: '#8B5CF6', color: 'white', padding: '1rem', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginTop: '0.5rem' }} onClick={handleSalesSubmit}>Enviar solicitud</button>
                <button style={{ backgroundColor: 'transparent', color: '#94a3b8', padding: '0.5rem', border: 'none', cursor: 'pointer' }} onClick={closeModals}>Cancelar</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}