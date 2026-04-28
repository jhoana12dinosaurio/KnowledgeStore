import type { BlogPost, EnterpriseSolution, FaqItem, LearningPath, LiveSession, Membership, RelatedCompany, Stat, Testimonial } from '../types';

export const stats: Stat[] = [
  { value: '6M+', label: 'Estudiantes', icon: '👥' },
  { value: '4,000+', label: 'Empresas', icon: '🏢' },
  { value: '1,500+', label: 'Cursos', icon: '📚' },
  { value: '17', label: 'Escuelas', icon: '🎓' }
];

export const enterpriseSolutions: EnterpriseSolution[] = [
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

export const relatedCompanies: RelatedCompany[] = [
  {
    name: 'Nexa Talent',
    industry: 'Consultoría en RRHH',
    description: 'Mejorando la formación de equipos con proyectos en soft skills y data-driven learning.',
    employees: '450+',
    result: '82% de finalización en rutas internas'
  },
  {
    name: 'CloudNova',
    industry: 'Cloud & DevOps',
    description: 'Capacitación a medida para equipos de infraestructura y automatización de despliegues.',
    employees: '230+',
    result: '35% menos tiempo en onboarding técnico'
  },
  {
    name: 'MercaLab',
    industry: 'Marketing Digital',
    description: 'Workshops especializados para campañas, SEO y análisis de rendimiento comercial.',
    employees: '310+',
    result: '18 campañas optimizadas con métricas'
  },
  {
    name: 'EduSoft',
    industry: 'Software y UX',
    description: 'Rutas de aprendizaje en diseño de productos digitales y experiencia de usuario.',
    employees: '180+',
    result: '12 equipos formados en producto digital'
  }
];

export const memberships: Membership[] = [
  {
    id: 'basic',
    name: 'Básico',
    price: 'Gratis',
    period: '',
    description: 'Perfecto para comenzar tu aprendizaje',
    features: ['Acceso a cursos gratuitos', 'Comunidad de estudiantes', 'Certificados básicos', 'Soporte por email'],
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
    features: ['Acceso a todos los cursos', 'Descargas offline', 'Certificados verificados', 'Proyectos prácticos', 'Mentoría grupal mensual', 'Soporte prioritario 24/7'],
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
    features: ['Todo lo de Pro incluido', 'Panel de administración', 'Reportes y analytics', 'Rutas personalizadas', 'API de integración', 'Account manager dedicado', 'Facturación unificada'],
    buttonText: 'Contactar ventas',
    highlighted: false,
    color: '#8B5CF6'
  }
];

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'Cómo elegir una ruta de aprendizaje sin perder tiempo',
    category: 'Orientación',
    readTime: '5 min',
    author: 'Equipo Learnix',
    date: 'Abril 2026',
    summary: 'Una guía rápida para escoger cursos según tu nivel, tus metas y el tiempo disponible.',
    icon: '🧭'
  },
  {
    id: 2,
    title: 'Consejos para armar un portafolio de programación',
    category: 'Desarrollo Web',
    readTime: '7 min',
    author: 'Ana García',
    date: 'Abril 2026',
    summary: 'Ideas prácticas para presentar proyectos, explicar tu proceso y demostrar habilidades reales.',
    icon: '💻'
  },
  {
    id: 3,
    title: 'Qué métricas mirar en una campaña digital',
    category: 'Marketing Digital',
    readTime: '6 min',
    author: 'Patricia Gómez',
    date: 'Marzo 2026',
    summary: 'Aprende a diferenciar métricas de vanidad y KPIs útiles para tomar decisiones.',
    icon: '📊'
  },
  {
    id: 4,
    title: 'Cómo prepararte para una entrevista técnica junior',
    category: 'Carrera',
    readTime: '8 min',
    author: 'Luis Torres',
    date: 'Marzo 2026',
    summary: 'Recomendaciones para explicar tus proyectos, practicar preguntas y presentar tu perfil con seguridad.',
    icon: '🎯'
  }
];

export const liveSessions: LiveSession[] = [
  {
    id: 1,
    title: 'Clase abierta: crea tu primera app con React',
    instructor: 'Ana García',
    date: '30 de abril',
    time: '7:00 p. m.',
    level: 'Principiante',
    seats: 120,
    topic: 'Frontend',
    icon: '⚛️'
  },
  {
    id: 2,
    title: 'Workshop: dashboards con Python',
    instructor: 'Sofía Ramos',
    date: '2 de mayo',
    time: '6:30 p. m.',
    level: 'Intermedio',
    seats: 75,
    topic: 'Data Science',
    icon: '📈'
  },
  {
    id: 3,
    title: 'Mentoría grupal: mejora tu perfil profesional',
    instructor: 'Equipo Learnix',
    date: '5 de mayo',
    time: '8:00 p. m.',
    level: 'Principiante',
    seats: 90,
    topic: 'Carrera',
    icon: '🎯'
  }
];

export const learningPaths: LearningPath[] = [
  {
    title: 'Ruta Frontend Junior',
    description: 'Para estudiantes que desean crear interfaces modernas desde cero.',
    duration: '10 semanas',
    modules: ['HTML y CSS', 'JavaScript', 'React', 'Proyecto final'],
    outcome: 'Portafolio inicial con 3 proyectos publicados'
  },
  {
    title: 'Ruta Data Analyst',
    description: 'Para aprender a limpiar, analizar y presentar datos de forma clara.',
    duration: '12 semanas',
    modules: ['Excel', 'Python', 'Dashboards', 'Storytelling con datos'],
    outcome: 'Dashboard final con análisis de indicadores'
  },
  {
    title: 'Ruta Marketing Digital',
    description: 'Para planificar campañas, medir resultados y mejorar conversiones.',
    duration: '8 semanas',
    modules: ['SEO', 'Contenido', 'Ads', 'Métricas'],
    outcome: 'Plan de campaña con KPIs y presupuesto'
  }
];

export const platformFaqs: FaqItem[] = [
  {
    question: '¿Los formularios guardan datos reales?',
    answer: 'Por ahora son formularios visuales preparados para conectarse a un backend, API o base de datos.'
  },
  {
    question: '¿Puedo inscribirme a un curso desde la maqueta?',
    answer: 'Sí, se agregó un flujo de inscripción simulado para mostrar cómo funcionaría la experiencia del estudiante.'
  },
  {
    question: '¿Qué falta para hacerlo productivo?',
    answer: 'Faltaría integrar autenticación real, base de datos, pasarela de pago y panel administrativo.'
  },
  {
    question: '¿Se puede adaptar a una universidad o instituto?',
    answer: 'Sí. La estructura permite usar categorías, rutas, planes, sesiones en vivo y formularios de contacto.'
  }
];

export const testimonials: Testimonial[] = [
  {
    name: 'Camila Rojas',
    role: 'Estudiante de desarrollo web',
    comment: 'La ruta me ayudó a ordenar mis cursos y armar mi primer portafolio.',
    result: '3 proyectos completados'
  },
  {
    name: 'Marco Díaz',
    role: 'Coordinador de capacitación',
    comment: 'El panel empresarial facilitó revisar avances y detectar brechas del equipo.',
    result: '28 colaboradores activos'
  },
  {
    name: 'Valeria Peña',
    role: 'Emprendedora digital',
    comment: 'Los cursos de marketing me dieron una guía más clara para lanzar campañas.',
    result: 'Campaña lista en 4 semanas'
  }
];
