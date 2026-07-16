import { useEffect, useMemo, useState } from 'react';
import '../styles/App.css';
import { 
  allCourses, categories, levels, stats, memberships,
  alliedCompanies, alliedBenefits
} from '../data';
import { StarRating, CourseCard, CheckIcon, ArrowRight, AlliedCompanyCard } from '../components';

type LessonProgress = {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
};

type StageProgress = {
  title: string;
  modules: LessonProgress[];
};

type CourseEnrollment = {
  progress: number;
  completedLessons: number;
  totalLessons: number;
  stages: StageProgress[];
};

type BillingFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  cardNumber: string;
  cardName: string;
  expiry: string;
  cvv: string;
  dni: string;
  address: string;
  city: string;
  postalCode: string;
};

const buildCourseProgress = (): CourseEnrollment => {
  const stages: StageProgress[] = [
    {
      title: 'Etapa 1: Fundamentos',
      modules: [
        { id: 101, title: 'Introducción al curso', duration: '8 min', completed: false },
        { id: 102, title: 'Herramientas necesarias', duration: '12 min', completed: false },
        { id: 103, title: 'Objetivos del aprendizaje', duration: '10 min', completed: false }
      ]
    },
    {
      title: 'Etapa 2: Práctica guiada',
      modules: [
        { id: 201, title: 'Ejercicio paso a paso', duration: '15 min', completed: false },
        { id: 202, title: 'Revisión de conceptos', duration: '9 min', completed: false },
        { id: 203, title: 'Mini proyecto', duration: '18 min', completed: false }
      ]
    },
    {
      title: 'Etapa 3: Cierre y reto',
      modules: [
        { id: 301, title: 'Repaso final', duration: '11 min', completed: false },
        { id: 302, title: 'Evaluación de progreso', duration: '7 min', completed: false },
        { id: 303, title: 'Siguiente paso', duration: '6 min', completed: false }
      ]
    }
  ];

  const totalLessons = stages.reduce((acc, stage) => acc + stage.modules.length, 0);

  return {
    progress: 0,
    completedLessons: 0,
    totalLessons,
    stages
  };
};

const buildBillingErrors = (form: BillingFormData) => {
  const errors: Record<string, string> = {};

  const requiredFields: Array<keyof BillingFormData> = [
    'firstName', 'lastName', 'email', 'phone', 'cardNumber', 'cardName', 'expiry', 'cvv', 'dni', 'address', 'city', 'postalCode'
  ];

  requiredFields.forEach(field => {
    if (!form[field].trim()) {
      errors[field] = 'Este campo es obligatorio.';
    }
  });

  if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Ingresa un correo electrónico válido.';
  }

  if (form.phone.trim() && !/^\d{9}$/.test(form.phone)) {
    errors.phone = 'El teléfono debe tener exactamente 9 dígitos.';
  }

  if (form.cardNumber.trim() && !/^\d{16}$/.test(form.cardNumber)) {
    errors.cardNumber = 'La tarjeta debe tener exactamente 16 dígitos.';
  }

  if (form.cardName.trim() && !/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/.test(form.cardName)) {
    errors.cardName = 'El nombre debe contener solo letras y espacios.';
  }

  if (form.expiry.trim()) {
    const match = form.expiry.match(/^(\d{2})\/(\d{2})$/);
    if (!match) {
      errors.expiry = 'Usa el formato MM/AA.';
    } else {
      const month = Number(match[1]);
      if (month < 1 || month > 12) {
        errors.expiry = 'El mes debe estar entre 01 y 12.';
      }
    }
  }

  if (form.cvv.trim() && !/^\d{3,4}$/.test(form.cvv)) {
    errors.cvv = 'El CVV debe tener 3 o 4 dígitos.';
  }

  if (form.dni.trim() && !/^\d{8}$/.test(form.dni)) {
    errors.dni = 'El DNI debe tener exactamente 8 dígitos.';
  }

  return errors;
};

/* ══════════════════════════════════ */
export default function App() {
  const [searchTerm,       setSearchTerm]       = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedLevel,    setSelectedLevel]    = useState('Todos');
  const [showCourses,      setShowCourses]       = useState(false);
  const [showEnterprise,   setShowEnterprise]    = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [enrolledCourse, setEnrolledCourse] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [authError, setAuthError] = useState('');
  const [userName, setUserName] = useState('Estudiante');
  const [pendingCourseId, setPendingCourseId] = useState<number | null>(null);
  const [pendingPlanCourseId, setPendingPlanCourseId] = useState<number | null>(null);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string>(memberships[1].id);
  const [billingForm, setBillingForm] = useState<BillingFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
    dni: '',
    address: '',
    city: '',
    postalCode: ''
  });
  const [billingErrors, setBillingErrors] = useState<Record<string, string>>({
    firstName: 'Este campo es obligatorio.',
    lastName: 'Este campo es obligatorio.',
    email: 'Este campo es obligatorio.',
    phone: 'Este campo es obligatorio.',
    cardNumber: 'Este campo es obligatorio.',
    cardName: 'Este campo es obligatorio.',
    expiry: 'Este campo es obligatorio.',
    cvv: 'Este campo es obligatorio.',
    dni: 'Este campo es obligatorio.',
    address: 'Este campo es obligatorio.',
    city: 'Este campo es obligatorio.',
    postalCode: 'Este campo es obligatorio.'
  });
  const [billingStep, setBillingStep] = useState(false);
  const [savedUsers, setSavedUsers] = useState<{name:string; email:string; password:string}[]>([]);
  const [courseProgress, setCourseProgress] = useState<Record<number, CourseEnrollment>>({});
  const [paymentSuccess, setPaymentSuccess] = useState<{ invoiceNumber:string; amount:string; date:string; courseTitle:string } | null>(null);

  const selectedCourse = useMemo(() => allCourses.find(c => c.id === selectedCourseId) || null, [selectedCourseId]);
  const currentEnrollment = selectedCourse ? courseProgress[selectedCourse.id] : undefined;
  const completionPercentage = currentEnrollment?.progress ?? 0;
  const completedLessonsCount = currentEnrollment?.completedLessons ?? 0;
  const totalLessonsCount = currentEnrollment?.totalLessons ?? 0;

  const filteredCourses = useMemo(() =>
    allCourses.filter(c => {
      const q = searchTerm.toLowerCase();
      const matchSearch = !q || c.title.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) || c.instructor.toLowerCase().includes(q);
      const matchCat = selectedCategory === 'Todos' || c.category === selectedCategory;
      const matchLevel = selectedLevel === 'Todos' || c.level === selectedLevel;
      return matchSearch && matchCat && matchLevel;
    }),
    [searchTerm, selectedCategory, selectedLevel]
  );

  const featuredCourses = allCourses.filter(c => c.featured);
  const isBillingFormValid = useMemo(() => {
    const hasNoErrors = Object.values(billingErrors).every(error => !error);
    const hasAllValues = Object.values(billingForm).every(value => value.trim() !== '');
    return hasNoErrors && hasAllValues;
  }, [billingErrors, billingForm]);

  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem('learnix-users');
      if (storedUsers) {
        setSavedUsers(JSON.parse(storedUsers));
      }
    } catch {
      // Ignorar si el almacenamiento no está disponible.
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('learnix-users', JSON.stringify(savedUsers));
  }, [savedUsers]);

  const resetHome = () => {
    setShowCourses(false);
    setShowEnterprise(false);
    setSelectedCourseId(null);
    setSearchTerm('');
    setSelectedCategory('Todos');
    setSelectedLevel('Todos');
  };

  const goToCourses = () => { setShowCourses(true); setShowEnterprise(false); };
  const goToEnterprise = () => { setShowEnterprise(true); setShowCourses(true); };

  const handleSearch = () => setShowCourses(true);
  const handleKeyPress = (e: React.KeyboardEvent) => { if (e.key === 'Enter') handleSearch(); };

  const enrollInCourse = (courseId: number) => {
    setEnrolledCourse(courseId);
    setSelectedCourseId(courseId);
    setCourseProgress(prev => ({ ...prev, [courseId]: buildCourseProgress() }));
  };

  const handleEnrollClick = (courseId: number) => {
    if (!isAuthenticated) {
      setPendingCourseId(courseId);
      setAuthMode('login');
      setShowAuthModal(true);
      return;
    }

    setPendingPlanCourseId(courseId);
    setShowPlanModal(true);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!authForm.email.trim() || !authForm.password.trim()) {
      setAuthError('Ingresa un correo y una contraseña válidos.');
      return;
    }

    if (authMode === 'register' && !authForm.name.trim()) {
      setAuthError('Ingresa tu nombre para crear la cuenta.');
      return;
    }

    const normalizedEmail = authForm.email.trim().toLowerCase();
    const displayName = authMode === 'register' ? authForm.name.trim() : authForm.email.split('@')[0];

    if (authMode === 'register') {
      const exists = savedUsers.some(user => user.email.toLowerCase() === normalizedEmail);
      if (exists) {
        setAuthError('Ya existe una cuenta con ese correo.');
        return;
      }

      setSavedUsers(prev => [...prev, { name: authForm.name.trim(), email: normalizedEmail, password: authForm.password }]);
    } else {
      const foundUser = savedUsers.find(user => user.email.toLowerCase() === normalizedEmail && user.password === authForm.password);
      if (!foundUser) {
        setAuthError('Credenciales inválidas. Crea una cuenta primero.');
        return;
      }
      setUserName(foundUser.name);
    }

    setUserName(displayName);
    setIsAuthenticated(true);
    setAuthError('');
    setShowAuthModal(false);
    setAuthForm({ name: '', email: '', password: '' });

    if (pendingCourseId) {
      const courseToEnroll = pendingCourseId;
      setPendingCourseId(null);
      setPendingPlanCourseId(courseToEnroll);
      setShowPlanModal(true);
    }
  };

  const confirmPlanSelection = () => {
    if (!pendingPlanCourseId) return;

    setShowPlanModal(false);
    setBillingStep(true);
  };

  const updateBillingField = (field: keyof BillingFormData, value: string) => {
    let nextValue = value;

    if (['cardNumber', 'cvv', 'phone', 'dni', 'postalCode'].includes(field)) {
      nextValue = value.replace(/\D/g, '');
    }

    if (field === 'cardName') {
      nextValue = value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ ]/g, '');
    }

    setBillingForm(prev => {
      const nextForm = { ...prev, [field]: nextValue };
      setBillingErrors(buildBillingErrors(nextForm));
      return nextForm;
    });
  };

  const handleBillingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingPlanCourseId || !selectedCourse) return;

    const nextErrors = buildBillingErrors(billingForm);
    setBillingErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const selectedPlan = memberships.find(plan => plan.id === selectedPlanId);
    const invoiceNumber = `FAC-${Date.now().toString().slice(-6)}`;
    const amount = selectedPlan?.price || 'Gratis';

    setPaymentSuccess({
      invoiceNumber,
      amount,
      date: new Date().toLocaleDateString('es-ES'),
      courseTitle: selectedCourse.title
    });
    setBillingStep(false);
    enrollInCourse(pendingPlanCourseId);
    setPendingPlanCourseId(null);
  };

  const toggleLessonCompletion = (lessonId: number) => {
    if (!selectedCourse) return;

    setCourseProgress(prev => {
      const current = prev[selectedCourse.id];
      if (!current) return prev;

      const nextStages = current.stages.map(stage => ({
        ...stage,
        modules: stage.modules.map(module => (
          module.id === lessonId ? { ...module, completed: !module.completed } : module
        ))
      }));

      const completedLessons = nextStages.reduce(
        (acc, stage) => acc + stage.modules.filter(module => module.completed).length,
        0
      );
      const progress = Math.round((completedLessons / current.totalLessons) * 100);

      return {
        ...prev,
        [selectedCourse.id]: {
          ...current,
          stages: nextStages,
          completedLessons,
          progress
        }
      };
    });
  };

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
            <button
              className="lx-btn lx-btn-ghost"
              onClick={() => {
                setAuthMode('login');
                setShowAuthModal(true);
              }}
            >
              {isAuthenticated ? `Hola, ${userName}` : 'Iniciar sesión'}
            </button>
            <button
              className="lx-btn lx-btn-primary"
              onClick={() => {
                setAuthMode('register');
                setShowAuthModal(true);
              }}
            >
              {isAuthenticated ? 'Mi progreso' : 'Comenzar gratis'}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Content ── */}
      <div className="lx-content">
        {/* ── Course Detail Page ── */}
        
         {paymentSuccess && (
          <div className="lx-success-banner">
            <div>
              <strong>Inscripción realizada correctamente.</strong>
              <p>Factura {paymentSuccess.invoiceNumber} para {paymentSuccess.courseTitle} · {paymentSuccess.amount} · {paymentSuccess.date}</p>
            </div>
            <button onClick={() => setPaymentSuccess(null)}>×</button>
          </div>
        )}

         {enrolledCourse &&
   selectedCourse &&
   currentEnrollment ? (
    <section className="lx-course-progress">

  <div className="lx-course-layout">

    {/* CONTENIDO PRINCIPAL */}
    <div className="lx-course-main">

      <div className="lx-course-banner">
        <div className="lx-banner-top">
          <h1>{selectedCourse.title}</h1>
          <span className="lx-course-pill">Inscrito • {completionPercentage}%</span>
        </div>

        <div className="lx-progress-wrapper">
          <div
            className="lx-progress-fill"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>

        <span>{completedLessonsCount} de {totalLessonsCount} lecciones completadas</span>
      </div>

      {currentEnrollment.stages.map((stage, index) => (

        <div key={index} className="lx-stage-card">

          <div className="lx-stage-header">
            <h2>{stage.title}</h2>
            <span>{stage.modules.length} lecciones</span>
          </div>

          <ul className="lx-stage-modules">

            {stage.modules.map((module) => (

              <li key={module.id} className={`lx-lesson-card${module.completed ? ' completed' : ''}`}>

                <div className="lx-lesson-icon">
                  {module.completed ? '✅' : '▶️'}
                </div>

                <div className="lx-lesson-info">
                  <h4>{module.title}</h4>
                  <p>Video • {module.duration}</p>
                </div>

                <button className={`lx-lesson-btn${module.completed ? ' done' : ''}`} onClick={() => toggleLessonCompletion(module.id)}>
                  {module.completed ? 'Completada' : 'Marcar como hecha'}
                </button>

              </li>

            ))}

          </ul>

        </div>

      ))}

    </div>

    {/* SIDEBAR */}
   <aside className="lx-course-sidebar">

  <div className="lx-sidebar-widget">
    <h3>📊  Tu Progreso</h3>
    <p>{completionPercentage}% completado</p>
    <p>{completedLessonsCount} de {totalLessonsCount} lecciones cerradas</p>
  </div>

  <div className="lx-sidebar-widget">
    <h3>🎓 Certificado</h3>
    <p>{completionPercentage === 100 ? 'Listo para descargar' : 'Disponible al completar el 100%'}</p>
  </div>

  <div className="lx-sidebar-widget">
    <h3>📖 Contenido</h3>
    <p>{currentEnrollment.stages.length} etapas</p>
    <p>{totalLessonsCount} lecciones</p>
  </div>

  <div className="lx-sidebar-widget">
    <h3>💬 Foro</h3>
    <button className="lx-sidebar-btn">
      Ir al foro
    </button>
  </div>

  <div className="lx-sidebar-widget">
    <h3>📝 Recursos</h3>
    <button className="lx-sidebar-btn">
      Descargar PDF
    </button>
  </div>

</aside>
  </div>

</section>
  ) : selectedCourse ? (
          <section className="lx-course-detail">
            <div className="lx-detail-header">
              <button className="lx-detail-back" onClick={() => setSelectedCourseId(null)}>
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                </svg>
                Volver a cursos
              </button>
              <div className="lx-detail-image-section">
                <div className="lx-detail-image">{selectedCourse.image}</div>
                <div className="lx-detail-info">
                  <span className="lx-detail-category">{selectedCourse.category}</span>
                  <h1>{selectedCourse.title}</h1>
                  <p className="lx-detail-instructor">Por {selectedCourse.instructor}</p>
                  
                  <div className="lx-detail-ratings">
                    <StarRating rating={selectedCourse.rating} />
                    <span className="lx-rating-meta">({(selectedCourse.students / 1000).toFixed(1)}k estudiantes)</span>
                  </div>

                  <div className="lx-detail-meta-grid">
                    <div className="lx-meta-box">
                      <span className="lx-meta-label">Duración</span>
                      <span className="lx-meta-value">{selectedCourse.duration}</span>
                    </div>
                    <div className="lx-meta-box">
                      <span className="lx-meta-label">Nivel</span>
                      <span className="lx-meta-value">{selectedCourse.level}</span>
                    </div>
                    <div className="lx-meta-box">
                      <span className="lx-meta-label">Precio</span>
                      <span className="lx-meta-value" style={{color: '#00d4aa'}}>{selectedCourse.price}</span>
                    </div>
                  </div>

                  <div className="lx-detail-description">
                    <h3>Acerca del curso</h3>
                    <p>{selectedCourse.description || 'Aprende ' + selectedCourse.title + ' con uno de nuestros expertos instructores. Este curso te proporcionará todas las habilidades necesarias para dominar este tema y avanzar en tu carrera profesional.'}</p>
                  </div>
                </div>
              </div>

              <div className="lx-detail-actions">
                <button
  className="lx-enroll-btn"
  onClick={() => handleEnrollClick(selectedCourse.id)}
>
  {isAuthenticated && enrolledCourse === selectedCourse.id ? 'Continuar curso' : 'Inscribirme y pagar'}
</button>
                <button className="lx-wishlist-btn" title="Agregar a favoritos">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className="lx-detail-content">
              <div className="lx-content-main">
                <div className="lx-detail-section">
                  <h2>¿Qué aprenderás?</h2>
                  <div className="lx-learning-grid">
                    <div className="lx-learning-item">
                      <svg viewBox="0 0 24 24" fill="#00d4aa" width="20" height="20">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                      <span>Domina los conceptos fundamentales</span>
                    </div>
                    <div className="lx-learning-item">
                      <svg viewBox="0 0 24 24" fill="#00d4aa" width="20" height="20">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                      <span>Desarrolla proyectos prácticos reales</span>
                    </div>
                    <div className="lx-learning-item">
                      <svg viewBox="0 0 24 24" fill="#00d4aa" width="20" height="20">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                      <span>Obtén certificado reconocido profesionalmente</span>
                    </div>
                    <div className="lx-learning-item">
                      <svg viewBox="0 0 24 24" fill="#00d4aa" width="20" height="20">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                      <span>Acceso de por vida al contenido</span>
                    </div>
                  </div>
                </div>

                <div className="lx-detail-section">
                  <h2>Contenido del curso</h2>
                  <div className="lx-modules">
                    <div className="lx-module">
                      <div className="lx-module-header">
                        <span>Módulo 1: Conceptos Fundamentales</span>
                        <span className="lx-module-lessons">5 lecciones</span>
                      </div>
                    </div>
                    <div className="lx-module">
                      <div className="lx-module-header">
                        <span>Módulo 2: Proyectos Prácticos</span>
                        <span className="lx-module-lessons">8 lecciones</span>
                      </div>
                    </div>
                    <div className="lx-module">
                      <div className="lx-module-header">
                        <span>Módulo 3: Casos Avanzados</span>
                        <span className="lx-module-lessons">6 lecciones</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lx-detail-section">
                  <h2>¿Qué incluye?</h2>
                  <ul className="lx-features-list">
                    <li><CheckIcon color="#00d4aa" /> Acceso de por vida</li>
                    <li><CheckIcon color="#00d4aa" /> Certificado de finalización</li>
                    <li><CheckIcon color="#00d4aa" /> Recursos descargables</li>
                    <li><CheckIcon color="#00d4aa" /> Soporte del instructor</li>
                    <li><CheckIcon color="#00d4aa" /> Actualizaciones gratuitas</li>
                    <li><CheckIcon color="#00d4aa" /> Comunidad exclusiva</li>
                  </ul>
                </div>
              </div>

              <div className="lx-content-sidebar">
                <div className="lx-sidebar-card">
                  <h3>Requisitos</h3>
                  <ul className="lx-requirements-list">
                    <li>Conocimientos básicos de programación</li>
                    <li>Disposición para aprender</li>
                    <li>Computadora con navegador web</li>
                  </ul>
                </div>

                <div className="lx-sidebar-card">
                  <h3>Información del instructor</h3>
                  <div className="lx-instructor-info">
                    <div className="lx-instructor-avatar">{selectedCourse.image}</div>
                    <div>
                      <h4>{selectedCourse.instructor}</h4>
                      <p>Experto en {selectedCourse.category}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : !showCourses ? (
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

                
              </div>

              {/* Certificate mockup */}
              
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
                {featuredCourses.slice(0, 6).map(c => (
                  <CourseCard 
                    key={c.id} 
                    course={c} 
                    onClick={() => goToCourses()}
                  />
                ))}
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

          /* ── Empresas Aliadas Page ── */
          <section className="lx-allied-page">
            {/* Header Section */}
            <div className="lx-allied-header">
              <div className="lx-allied-head-content">
                <p className="lx-allied-label">Alianzas estratégicas</p>
                <h1>Empresas Aliadas</h1>
                <p className="lx-allied-subtitle">Nuestras certificaciones son reconocidas por organizaciones comprometidas con el desarrollo del talento y la formación continua.</p>
              </div>
            </div>

            {/* Description Block */}
            <div className="lx-allied-description">
              <div className="lx-allied-desc-content">
                <h2>Colaboración con líderes de la industria</h2>
                <p>Trabajamos junto a empresas e instituciones de renombre global para asegurar que nuestros programas de capacitación reflejen las necesidades reales del mercado laboral. Esta alianza garantiza que nuestros estudiantes adquieren las habilidades más demandadas y están preparados para prosperar en sus carreras profesionales.</p>
                <div className="lx-allied-highlights">
                  <div className="lx-highlight-item">
                    <span className="lx-highlight-icon">✓</span>
                    <div>
                      <h4>Empleabilidad garantizada</h4>
                      <p>Nuestros egresados son directamente contactados por nuestros aliados.</p>
                    </div>
                  </div>

                  <div className="lx-highlight-item">
                    <span className="lx-highlight-icon">✓</span>
                    <div>
                      <h4>Aprendizaje continuo</h4>
                      <p>Cursos actualizados según tendencias y demandas del mercado real.</p>
                    </div>

                  </div>
                  <div className="lx-highlight-item">
                    <span className="lx-highlight-icon">✓</span>
                    <div>
                      <h4>Crecimiento profesional</h4>
                      <p>Rutas de aprendizaje diseñadas para ascensos y nuevas oportunidades.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Companies Grid */}
            <div className="lx-allied-companies-section">
              <h2 className="lx-allied-companies-title">Nuestros aliados estratégicos</h2>
              <div className="lx-allied-logos-grid">
                {alliedCompanies.map((company, idx) => (
                  <AlliedCompanyCard key={idx} company={company} />
                ))}
              </div>
            </div>

            {/* Benefits Section */}
            <div className="lx-allied-benefits">
              <h2 className="lx-allied-benefits-title">¿Qué ganas al estudiar con nosotros?</h2>
              <div className="lx-allied-benefits-grid">
                {alliedBenefits.map((benefit, idx) => (
                  <div className="lx-allied-benefit-card" key={idx}>
                    <span className="lx-benefit-icon">{benefit.icon}</span>
                    <h3>{benefit.title}</h3>
                    <p>{benefit.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <div className="lx-allied-cta">
              <div className="lx-allied-cta-content">
                <h2>¿Eres una empresa? Únete a nuestra red</h2>
                <p>Formamos a los mejores profesionales. Conecta con talento listo para crecer.</p>
                <div className="lx-allied-cta-buttons">
                  <button className="lx-btn lx-btn-primary lx-btn-lg">Únete como empresa aliada</button>
                  <button className="lx-btn lx-btn-ghost lx-btn-lg" onClick={goToCourses}>Conocer nuestras alianzas</button>
                </div>
              </div>
            </div>

            {/* Navigation Actions */}
            <div className="lx-allied-nav">
              <button className="lx-btn lx-btn-outline" onClick={resetHome}>
                ← Volver al inicio
              </button>
              <button className="lx-btn lx-btn-secondary" onClick={goToCourses}>
                Explorar cursos →
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

            <div className="lx-level-filters">
              <span className="lx-filter-label">Filtrar por nivel:</span>
              {levels.map(level => (
                <button
                  key={level}
                  className={`lx-filter-btn lx-level-filter${selectedLevel === level ? ' active' : ''}`}
                  onClick={() => setSelectedLevel(level)}>
                  {level}
                </button>
              ))}
            </div>

            {filteredCourses.length > 0 ? (
              <div className="lx-catalog-grid">
                {filteredCourses.map(c => (
                  <CourseCard 
                    key={c.id} 
                    course={c}
                    onClick={() => setSelectedCourseId(c.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="lx-empty">
                <span className="lx-empty-icon">🔍</span>
                <h3>No se encontraron cursos</h3>
                <p>Intenta con otros términos de búsqueda o cambia el filtro de categoría</p>
                <button onClick={() => { setSearchTerm(''); setSelectedCategory('Todos'); setSelectedLevel('Todos'); }}>
                  Ver todos los cursos
                </button>
              </div>
            )}
          </section>
        )}
      </div>

      {showPlanModal && (
        <div className="lx-auth-modal-backdrop" onClick={() => setShowPlanModal(false)}>
          <div className="lx-auth-modal lx-plan-modal" onClick={e => e.stopPropagation()}>
            <div className="lx-auth-modal-header">
              <h3>Elige tu plan</h3>
              <button className="lx-auth-close" onClick={() => setShowPlanModal(false)}>×</button>
            </div>

            <div className="lx-plan-options">
              {memberships.map(plan => (
                <button
                  key={plan.id}
                  className={`lx-plan-option${selectedPlanId === plan.id ? ' active' : ''}`}
                  onClick={() => setSelectedPlanId(plan.id)}
                >
                  <div className="lx-plan-option-top">
                    <strong>{plan.name}</strong>
                    <span>{plan.price}{plan.period}</span>
                  </div>
                  <p>{plan.description}</p>
                </button>
              ))}
            </div>

            <button className="lx-btn lx-btn-primary lx-btn-full" onClick={confirmPlanSelection}>
              Continuar con datos de facturación
            </button>
          </div>
        </div>
      )}

      {billingStep && (
        <div className="lx-auth-modal-backdrop" onClick={() => setBillingStep(false)}>
          <div className="lx-auth-modal lx-plan-modal" onClick={e => e.stopPropagation()}>
            <div className="lx-auth-modal-header">
              <h3>Datos de pago y factura</h3>
              <button className="lx-auth-close" onClick={() => setBillingStep(false)}>×</button>
            </div>

            <form className="lx-auth-form lx-billing-form" onSubmit={handleBillingSubmit}>
              <div className="lx-billing-row">
                <div className="lx-input-group">
                  <input
                    type="text"
                    placeholder="Nombres"
                    value={billingForm.firstName}
                    onChange={e => updateBillingField('firstName', e.target.value)}
                  />
                  {billingErrors.firstName && <span className="lx-error-text">{billingErrors.firstName}</span>}
                </div>
                <div className="lx-input-group">
                  <input
                    type="text"
                    placeholder="Apellidos"
                    value={billingForm.lastName}
                    onChange={e => updateBillingField('lastName', e.target.value)}
                  />
                  {billingErrors.lastName && <span className="lx-error-text">{billingErrors.lastName}</span>}
                </div>
              </div>
              <div className="lx-billing-row">
                <div className="lx-input-group">
                  <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={billingForm.email}
                    onChange={e => updateBillingField('email', e.target.value)}
                  />
                  {billingErrors.email && <span className="lx-error-text">{billingErrors.email}</span>}
                </div>
                <div className="lx-input-group">
                  <input
                    type="text"
                    placeholder="Teléfono"
                    value={billingForm.phone}
                    onChange={e => updateBillingField('phone', e.target.value)}
                    maxLength={9}
                  />
                  {billingErrors.phone && <span className="lx-error-text">{billingErrors.phone}</span>}
                </div>
              </div>
              <div className="lx-input-group">
                <input
                  type="text"
                  placeholder="Número de tarjeta"
                  value={billingForm.cardNumber}
                  onChange={e => updateBillingField('cardNumber', e.target.value)}
                  maxLength={16}
                />
                {billingErrors.cardNumber && <span className="lx-error-text">{billingErrors.cardNumber}</span>}
              </div>
              <div className="lx-input-group">
                <input
                  type="text"
                  placeholder="Nombre en la tarjeta"
                  value={billingForm.cardName}
                  onChange={e => updateBillingField('cardName', e.target.value)}
                />
                {billingErrors.cardName && <span className="lx-error-text">{billingErrors.cardName}</span>}
              </div>
              <div className="lx-billing-row">
                <div className="lx-input-group">
                  <input
                    type="text"
                    placeholder="MM/AA"
                    value={billingForm.expiry}
                    onChange={e => updateBillingField('expiry', e.target.value)}
                    maxLength={5}
                  />
                  {billingErrors.expiry && <span className="lx-error-text">{billingErrors.expiry}</span>}
                </div>
                <div className="lx-input-group">
                  <input
                    type="text"
                    placeholder="CVV"
                    value={billingForm.cvv}
                    onChange={e => updateBillingField('cvv', e.target.value)}
                    maxLength={4}
                  />
                  {billingErrors.cvv && <span className="lx-error-text">{billingErrors.cvv}</span>}
                </div>
              </div>
              <div className="lx-billing-row">
                <div className="lx-input-group">
                  <input
                    type="text"
                    placeholder="DNI"
                    value={billingForm.dni}
                    onChange={e => updateBillingField('dni', e.target.value)}
                    maxLength={8}
                  />
                  {billingErrors.dni && <span className="lx-error-text">{billingErrors.dni}</span>}
                </div>
                <div className="lx-input-group">
                  <input
                    type="text"
                    placeholder="Código postal"
                    value={billingForm.postalCode}
                    onChange={e => updateBillingField('postalCode', e.target.value)}
                  />
                  {billingErrors.postalCode && <span className="lx-error-text">{billingErrors.postalCode}</span>}
                </div>
              </div>
              <div className="lx-input-group">
                <input
                  type="text"
                  placeholder="Dirección"
                  value={billingForm.address}
                  onChange={e => updateBillingField('address', e.target.value)}
                />
                {billingErrors.address && <span className="lx-error-text">{billingErrors.address}</span>}
              </div>
              <div className="lx-input-group">
                <input
                  type="text"
                  placeholder="Ciudad"
                  value={billingForm.city}
                  onChange={e => updateBillingField('city', e.target.value)}
                />
                {billingErrors.city && <span className="lx-error-text">{billingErrors.city}</span>}
              </div>
              <button className="lx-btn lx-btn-primary lx-btn-full" type="submit" disabled={!isBillingFormValid}>
                Pagar y generar factura
              </button>
            </form>
          </div>
        </div>
      )}

      {showAuthModal && (
        <div className="lx-auth-modal-backdrop" onClick={() => setShowAuthModal(false)}>
          <div className="lx-auth-modal" onClick={e => e.stopPropagation()}>
            <div className="lx-auth-modal-header">
              <h3>{authMode === 'login' ? 'Inicia sesión' : 'Crea tu cuenta'}</h3>
              <button className="lx-auth-close" onClick={() => setShowAuthModal(false)}>×</button>
            </div>

            <p className="lx-auth-subtitle">
              {authMode === 'login'
                ? 'Accede para inscribirte y ver tu progreso en tiempo real.'
                : 'Regístrate para guardar tu avance y continuar desde donde te quedaste.'}
            </p>

            <form className="lx-auth-form" onSubmit={handleAuthSubmit}>
              {authMode === 'register' && (
                <input
                  type="text"
                  placeholder="Tu nombre"
                  value={authForm.name}
                  onChange={e => setAuthForm({ ...authForm, name: e.target.value })}
                />
              )}

              <input
                type="email"
                placeholder="Correo electrónico"
                value={authForm.email}
                onChange={e => setAuthForm({ ...authForm, email: e.target.value })}
              />

              <input
                type="password"
                placeholder="Contraseña"
                value={authForm.password}
                onChange={e => setAuthForm({ ...authForm, password: e.target.value })}
              />

              {authError && <p className="lx-auth-error">{authError}</p>}

              <button className="lx-btn lx-btn-primary lx-btn-full" type="submit">
                {authMode === 'login' ? 'Entrar' : 'Crear cuenta'}
              </button>
            </form>

            <div className="lx-auth-switch">
              <span>{authMode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}</span>
              <button onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}>
                {authMode === 'login' ? 'Crear cuenta' : 'Iniciar sesión'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp FAB */}
      <a href="https://wa.me/" className="lx-whatsapp" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  );
}
