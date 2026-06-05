export const allCourses = [
  { id: 1,  title: 'React desde Cero',          category: 'Desarrollo Web',    level: 'Principiante', duration: '12h', rating: 4.9, students: 45200,  instructor: 'Ana García',       image: '⚛️', price: 'Gratis', featured: true, description: 'Aprende React desde los fundamentos. Domina componentes, hooks, estado y efectos. Crea aplicaciones web interactivas y modernas con la biblioteca más popular del desarrollo frontend.' },
  { id: 2,  title: 'Node.js Profesional',        category: 'Desarrollo Web',    level: 'Intermedio',   duration: '18h', rating: 4.8, students: 32100,  instructor: 'Carlos Ruiz',      image: '🟢', price: '$29', description: 'Desarrolla servidores backend robustos con Node.js. Aprende Express, manejo de base de datos, autenticación y deployment. Conviértete en full stack developer.' },
  { id: 3,  title: 'TypeScript Avanzado',        category: 'Desarrollo Web',    level: 'Avanzado',     duration: '15h', rating: 4.7, students: 18500,  instructor: 'María López',      image: '📘', price: '$39', description: 'Domina TypeScript a nivel avanzado. Tipos complejos, genéricos, decoradores y patrones de diseño. Escribe código más seguro y mantenible.' },
  { id: 4,  title: 'Next.js Full Stack',         category: 'Desarrollo Web',    level: 'Intermedio',   duration: '20h', rating: 4.9, students: 28900,  instructor: 'Pedro Sánchez',    image: '▲',  price: '$49', featured: true, description: 'Aprende Next.js para crear aplicaciones full stack modernas. SSR, SSG, API routes y deployment. Desde cero hasta producción.' },
  { id: 5,  title: 'CSS Grid y Flexbox',         category: 'Desarrollo Web',    level: 'Principiante', duration: '8h',  rating: 4.6, students: 52300,  instructor: 'Laura Martín',     image: '🎨', price: 'Gratis', description: 'Domina los sistemas de layout modernos. CSS Grid y Flexbox te permitirán crear diseños responsivos y flexibles sin complicaciones.' },
  { id: 6,  title: 'Vue.js 3 Completo',          category: 'Desarrollo Web',    level: 'Intermedio',   duration: '16h', rating: 4.8, students: 21400,  instructor: 'Diego Torres',     image: '💚', price: '$35', description: 'Aprende Vue.js 3 con Composition API. Crea componentes reutilizables, maneja estado y efectos. Conviértete en experto Vue developer.' },
  { id: 7,  title: 'Python para Data Science',   category: 'Data Science',      level: 'Principiante', duration: '25h', rating: 4.9, students: 67800,  instructor: 'Roberto Silva',    image: '🐍', price: 'Gratis', featured: true, description: 'Aprende Python para análisis de datos. Librerías como NumPy, Pandas y Matplotlib. Desde manipulación de datos hasta visualización profesional.' },
  { id: 8,  title: 'Machine Learning Práctico',  category: 'Data Science',      level: 'Avanzado',     duration: '30h', rating: 4.8, students: 34200,  instructor: 'Elena Vargas',     image: '🤖', price: '$59', description: 'Domina Machine Learning con scikit-learn y TensorFlow. Algoritmos supervisados, no supervisados y evaluación de modelos. Casos prácticos reales.' },
  { id: 9,  title: 'SQL para Análisis de Datos', category: 'Data Science',      level: 'Principiante', duration: '10h', rating: 4.7, students: 89100,  instructor: 'Miguel Ángel',     image: '📊', price: 'Gratis', description: 'Domina SQL para análisis de datos. Consultas avanzadas, joins, agregaciones y optimización. Extrae insights de bases de datos.' },
  { id: 10, title: 'Visualización con Python',   category: 'Data Science',      level: 'Intermedio',   duration: '14h', rating: 4.6, students: 23400,  instructor: 'Sofía Ramos',      image: '📈', price: '$29', description: 'Crea visualizaciones impactantes con Matplotlib, Seaborn y Plotly. Comunica tus datos de forma clara y profesional.' },
  { id: 11, title: 'Deep Learning con TensorFlow', category: 'Data Science',    level: 'Avanzado',     duration: '35h', rating: 4.9, students: 19800,  instructor: 'Andrés Mejía',     image: '🧠', price: '$69', featured: true, description: 'Aprende Deep Learning desde cero. Redes neuronales, CNN, RNN y más. Construye modelos de IA avanzados con TensorFlow.' },
  { id: 12, title: 'Google Ads Certificación',   category: 'Marketing Digital', level: 'Principiante', duration: '12h', rating: 4.8, students: 56700,  instructor: 'Patricia Gómez',   image: '📢', price: 'Gratis', description: 'Obtén la certificación de Google Ads. Crea, gestiona y optimiza campañas publicitarias. Desde Search hasta Display.' },
  { id: 13, title: 'SEO Avanzado 2026',          category: 'Marketing Digital', level: 'Avanzado',     duration: '18h', rating: 4.9, students: 41200,  instructor: 'Fernando Castro',  image: '🔍', price: '$45', featured: true, description: 'Domina SEO avanzado. Posicionamiento técnico, estrategia de contenidos y link building. Ranking en Google.' },
  { id: 14, title: 'Social Media Marketing',     category: 'Marketing Digital', level: 'Principiante', duration: '10h', rating: 4.5, students: 78400,  instructor: 'Camila Herrera',   image: '📱', price: 'Gratis', description: 'Crea estrategias de social media. Manejo de redes, comunidad y análisis de métricas. Crece tu presencia online.' },
  { id: 15, title: 'Email Marketing Pro',        category: 'Marketing Digital', level: 'Intermedio',   duration: '8h',  rating: 4.7, students: 29800,  instructor: 'Ricardo Peña',     image: '✉️', price: '$25', description: 'Domina email marketing. Segmentación, automatización y personalización. Aumenta tasa de conversión.' },
  { id: 16, title: 'Analytics y Métricas',       category: 'Marketing Digital', level: 'Intermedio',   duration: '14h', rating: 4.8, students: 35600,  instructor: 'Valentina Cruz',   image: '📉', price: '$35', description: 'Analiza datos con Google Analytics 4. KPIs, cohortes y embudos. Toma decisiones basadas en datos.' },
  { id: 17, title: 'Inglés para Developers',     category: 'Inglés',            level: 'Principiante', duration: '20h', rating: 4.9, students: 92300,  instructor: 'John Smith',       image: '🇬🇧', price: 'Gratis', featured: true, description: 'Aprende Inglés técnico para desarrolladores. Documentación, comunicación y entrevistas. English for IT professionals.' },
  { id: 18, title: 'Business English',           category: 'Inglés',            level: 'Intermedio',   duration: '25h', rating: 4.8, students: 45600,  instructor: 'Sarah Johnson',    image: '💼', price: '$39', description: 'Inglés empresarial profesional. Presentaciones, negociaciones y correspondencia. Éxito en ambiente corporativo.' },
  { id: 19, title: 'English Conversation',       category: 'Inglés',            level: 'Principiante', duration: '15h', rating: 4.7, students: 67800,  instructor: 'Michael Brown',    image: '💬', price: 'Gratis', description: 'Mejora tu conversación en inglés. Fluidez, pronunciación y expresión. Confianza en conversaciones cotidianas.' },
  { id: 20, title: 'Technical Writing',          category: 'Inglés',            level: 'Avanzado',     duration: '12h', rating: 4.6, students: 18900,  instructor: 'Emily Davis',      image: '✍️', price: '$29', description: 'Escritura técnica profesional en inglés. Manuales, reportes y documentación. Claridad y precisión.' },
  { id: 21, title: 'Figma desde Cero',           category: 'Diseño UX/UI',      level: 'Principiante', duration: '14h', rating: 4.9, students: 73400,  instructor: 'Isabella Moreno',  image: '🎨', price: 'Gratis', featured: true, description: 'Aprende Figma desde cero. Diseño de interfaces, prototipos interactivos y colaboración en equipo. Herramienta número 1 en diseño digital.' },
  { id: 22, title: 'UX Research',                category: 'Diseño UX/UI',      level: 'Intermedio',   duration: '16h', rating: 4.8, students: 28900,  instructor: 'Nicolás Fuentes',  image: '🔬', price: '$45', description: 'Domina investigación UX. Entrevistas, encuestas, análisis competitivo. Diseño basado en datos y necesidades reales.' },
  { id: 23, title: 'Design Systems',             category: 'Diseño UX/UI',      level: 'Avanzado',     duration: '20h', rating: 4.7, students: 19200,  instructor: 'Gabriela Ortiz',   image: '📐', price: '$55', description: 'Crea Design Systems profesionales. Componentes reutilizables, guías y escalabilidad. Diseño consistente a escala.' },
  { id: 24, title: 'Prototipado Avanzado',       category: 'Diseño UX/UI',      level: 'Intermedio',   duration: '12h', rating: 4.8, students: 24500,  instructor: 'Sebastián Vega',   image: '🖼️', price: '$35', description: 'Prototipos interactivos avanzados. Animaciones, microinteracciones y testing. Llevar diseños a vida.' },
  { id: 25, title: 'Docker y Kubernetes',        category: 'DevOps & Cloud',    level: 'Intermedio',   duration: '22h', rating: 4.9, students: 38700,  instructor: 'Alejandro Díaz',   image: '🐳', price: '$49', featured: true, description: 'Domina containerización con Docker y orquestación con Kubernetes. Deploy escalable y seguro. Infraestructura moderna.' },
  { id: 26, title: 'AWS Cloud Practitioner',     category: 'DevOps & Cloud',    level: 'Principiante', duration: '18h', rating: 4.8, students: 52100,  instructor: 'Daniela Ríos',     image: '☁️', price: 'Gratis', description: 'Certificación AWS Cloud Practitioner. Servicios AWS, seguridad y arquitectura. Comienzo en cloud computing.' },
  { id: 27, title: 'CI/CD con GitHub Actions',   category: 'DevOps & Cloud',    level: 'Intermedio',   duration: '10h', rating: 4.7, students: 21300,  instructor: 'Martín Acosta',    image: '🔄', price: '$29', description: 'Automatiza deployments con GitHub Actions. Pipelines de CI/CD, testing y deploy automático. DevOps esencial.' },
  { id: 28, title: 'Terraform Infrastructure',   category: 'DevOps & Cloud',    level: 'Avanzado',     duration: '25h', rating: 4.8, students: 15600,  instructor: 'Paula Medina',     image: '🏗️', price: '$59', description: 'Infraestructura como código con Terraform. Provisionar recursos AWS, Azure y GCP. IaC profesional.' },
  { id: 29, title: 'React Native Masterclass',   category: 'Mobile',            level: 'Intermedio',   duration: '28h', rating: 4.9, students: 41200,  instructor: 'Jorge Mendoza',    image: '📱', price: '$55', featured: true, description: 'Crea apps nativas iOS y Android con React Native. Reutiliza código, integración nativa y deployment. Cross-platform development.' },
  { id: 30, title: 'Flutter Completo',           category: 'Mobile',            level: 'Principiante', duration: '24h', rating: 4.8, students: 35800,  instructor: 'Lucía Fernández',  image: '💙', price: '$45', description: 'Aprende Flutter desde cero. Crea apps hermosas y performantes para iOS y Android. Widget-based framework.' },
  { id: 31, title: 'Swift para iOS',             category: 'Mobile',            level: 'Intermedio',   duration: '20h', rating: 4.7, students: 18900,  instructor: 'Cristian Torres',  image: '🍎', price: '$49', description: 'Desarrolla apps iOS nativas con Swift. UIKit, SwiftUI y APIs nativas. Apple development profesional.' },
  { id: 32, title: 'Kotlin Android',             category: 'Mobile',            level: 'Principiante', duration: '22h', rating: 4.6, students: 27400,  instructor: 'Andrea Guzmán',    image: '🤖', price: 'Gratis', description: 'Desarrolla apps Android nativas con Kotlin. Material Design, APIs Android y Jetpack. Android development moderno.' },
];

export const categories = ['Todos', 'Desarrollo Web', 'Data Science', 'Marketing Digital', 'Inglés', 'Diseño UX/UI', 'DevOps & Cloud', 'Mobile'];
export const levels = ['Todos', 'Principiante', 'Intermedio', 'Avanzado'];

export const stats = [
  { value: '6M+',    label: 'Estudiantes',  icon: '👥' },
  { value: '4,000+', label: 'Empresas',     icon: '🏢' },
  { value: '1,500+', label: 'Cursos',       icon: '📚' },
  { value: '17',     label: 'Escuelas',     icon: '🎓' },
];

export const enterpriseSolutions = [
  { icon: '🧩', title: 'Formación a medida',   description: 'Programas personalizados para equipos de tecnología, marketing y operaciones, con rutas diseñadas según los objetivos de tu empresa.' },
  { icon: '📊', title: 'Reportes y analytics', description: 'Seguimiento de progreso, métricas de adopción y resultados de aprendizaje para optimizar el desempeño del equipo.' },
  { icon: '🤝', title: 'Soporte corporativo',  description: 'Account managers dedicados, onboarding para empresas y acceso directo a recursos exclusivos para clientes empresariales.' },
];

export const relatedCompanies = [
  { name: 'Nexa Talent', industry: 'Consultoría en RRHH',    description: 'Mejorando la formación de equipos con proyectos en soft skills y data-driven learning.',                        employees: '450+' },
  { name: 'CloudNova',   industry: 'Cloud & DevOps',          description: 'Capacitación a medida para equipos de infraestructura y automatización de despliegues.',                        employees: '230+' },
  { name: 'MercaLab',    industry: 'Marketing Digital',       description: 'Workshops especializados para campañas, SEO y análisis de rendimiento comercial.',                              employees: '310+' },
  { name: 'EduSoft',     industry: 'Software y UX',           description: 'Rutas de aprendizaje en diseño de productos digitales y experiencia de usuario.',                               employees: '180+' },
];

export const alliedCompanies = [
  { initial: 'G', name: 'Google', sector: 'Tecnología', description: 'Innovación en búsqueda, cloud computing y soluciones empresariales.', benefits: ['Cloud Services', 'Analytics', 'DevTools'] },
  { initial: 'M', name: 'Microsoft', sector: 'Tecnología', description: 'Software empresarial, cloud computing y herramientas de productividad.', benefits: ['Azure Cloud', 'Office Suite', 'Developer Tools'] },
  { initial: 'A', name: 'Amazon', sector: 'Tecnología', description: 'E-commerce, cloud computing y servicios web innovadores.', benefits: ['AWS Services', 'Big Data', 'AI/ML'] },
  { initial: 'I', name: 'IBM', sector: 'Tecnología', description: 'Soluciones de enterprise, infraestructura y servicios cloud.', benefits: ['Enterprise Solutions', 'Security', 'Hybrid Cloud'] },
  { initial: 'S', name: 'Salesforce', sector: 'Software', description: 'Plataformas CRM y aplicaciones empresariales en la nube.', benefits: ['CRM Platform', 'Customer Data', 'Marketing Tools'] },
  { initial: 'O', name: 'Oracle', sector: 'Base de Datos', description: 'Bases de datos, ERP y soluciones empresariales integrales.', benefits: ['Database Solutions', 'ERP Systems', 'Cloud Services'] },
  { initial: 'J', name: 'Jetbrains', sector: 'Desarrollo', description: 'Herramientas de desarrollo IDE profesionales y multiplataforma.', benefits: ['IDEs Profesionales', 'Code Quality', 'DevOps Tools'] },
  { initial: 'F', name: 'Figma', sector: 'Diseño', description: 'Plataforma colaborativa para diseño UI/UX y prototipado.', benefits: ['Design Collaboration', 'Prototyping', 'Design Systems'] },
  { initial: 'D', name: 'Datadog', sector: 'DevOps', description: 'Monitoreo, logging y análisis de rendimiento en tiempo real.', benefits: ['Monitoring', 'Logging', 'Performance Analytics'] },
  { initial: 'A', name: 'Atlassian', sector: 'Productividad', description: 'Herramientas de colaboración y gestión de proyectos ágil.', benefits: ['Project Management', 'Collaboration', 'DevOps'] },
  { initial: 'T', name: 'Twilio', sector: 'Comunicaciones', description: 'APIs de comunicación para SMS, voz y video integrados.', benefits: ['SMS APIs', 'Voice APIs', 'Customer Engagement'] },
  { initial: 'S', name: 'Slack', sector: 'Colaboración', description: 'Plataforma de mensajería y colaboración empresarial.', benefits: ['Team Communication', 'Integrations', 'Workflow Automation'] },
];

export const alliedBenefits = [
  { icon: '🎓', title: 'Certificaciones Reconocidas', description: 'Nuestros certificados son validados por líderes de la industria y ampliamente aceptados en el mercado laboral.' },
  { icon: '🏢', title: 'Capacitación Corporativa', description: 'Soluciones de formación personalizadas para equipos empresariales con seguimiento de progreso en tiempo real.' },
  { icon: '💻', title: 'Habilidades Digitales', description: 'Desarrolla competencias tecnológicas relevantes con contenido actualizado según tendencias del mercado.' },
  { icon: '🤝', title: 'Oportunidades Laborales', description: 'Conecta con empleadores directamente y accede a bolsas de empleo exclusivas dentro de nuestra red.' },
  { icon: '📈', title: 'Crecimiento Profesional', description: 'Impulsa tu carrera con rutas de aprendizaje diseñadas para avance profesional sostenible.' },
  { icon: '🌐', title: 'Red de Networking', description: 'Únete a una comunidad global de profesionales, mentores e innovadores del sector tech.' },
];

export const memberships = [
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
