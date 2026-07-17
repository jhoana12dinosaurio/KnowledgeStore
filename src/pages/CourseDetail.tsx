import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ApiError, getJson, getToken, patchJson, postJson } from '../services/api';

type Lesson = {
  id: string;
  title: string;
  description: string | null;
  duration_min: number;
  position: number;
  is_free: boolean;
};

type Course = {
  id: string;
  title: string;
  description: string;
  category: string;
  instructor_name: string;
  level: string;
  duration_hrs: number | string;
  price: number | string;
  total_students: number | string;
  total_reviews: number | string;
  rating?: number | string;
  thumbnail_url?: string | null;
  lessons?: Lesson[];
};

const FREE_PROGRESS_TITLES = new Set([
  'react desde cero',
  'css grid y flexbox',
  'python para data science',
]);

type LessonProgress = {
  lesson_id: string;
  completed: boolean;
  watch_pct: number | null;
};

type EnrollmentStatusResponse = {
  enrolled: boolean;
  enrollment: {
    id: string;
    progress_pct: number;
    status: string;
  } | null;
  lesson_progress?: LessonProgress[];
};

const normalizeCourseTitle = (title: string) =>
  title.trim().toLowerCase().replace(/\s+/g, ' ');

// Función para generar ejercicios basados en el curso
const generateExercises = (courseTitle: string): { question: string; options: string[]; answer: number }[] => {
  const courseKey = courseTitle.toLowerCase();
  
  const exercisesMap: Record<string, { question: string; options: string[]; answer: number }[]> = {
    'react': [
      { question: '¿Cuál es la función principal de React?', options: ['Crear estilos CSS', 'Construir interfaces de usuario', 'Gestionar bases de datos', 'Administrar servidores'], answer: 1 },
      { question: '¿Qué son los hooks en React?', options: ['Funciones especiales de React', 'Etiquetas HTML', 'Estilos CSS', 'Librerías externas'], answer: 0 },
      { question: '¿Cómo se pasa datos a un componente hijo?', options: ['Mediante props', 'Mediante variables globales', 'Mediante cookies', 'Mediante archivos'], answer: 0 },
    ],
    'node.js': [
      { question: '¿Qué es Node.js?', options: ['Un navegador', 'Un entorno de ejecución de JavaScript', 'Una base de datos', 'Un editor de código'], answer: 1 },
      { question: '¿Cuál es el gestor de paquetes principal de Node.js?', options: ['Yarn', 'npm', 'Pip', 'Composer'], answer: 1 },
      { question: '¿Para qué se usa Express?', options: ['Dibujar gráficos', 'Crear servidores web', 'Diseñar bases de datos', 'Compilar código'], answer: 1 },
    ],
    'python': [
      { question: '¿Cuál es la sintaxis correcta para crear una lista en Python?', options: ['lista = (1, 2, 3)', 'lista = [1, 2, 3]', 'lista = {1, 2, 3}', 'lista = <1, 2, 3>'], answer: 1 },
      { question: '¿Qué es un diccionario en Python?', options: ['Un tipo de lista', 'Una estructura de datos clave-valor', 'Un archivo de texto', 'Una función integrada'], answer: 1 },
      { question: '¿Cuál es la forma correcta de definir una función?', options: ['function miFuncion() {}', 'def miFuncion():', 'func miFuncion() {}', 'define miFuncion():'], answer: 1 },
    ],
    'typescript': [
      { question: '¿Cuál es la principal ventaja de TypeScript?', options: ['Más rápido que JavaScript', 'Tipado estático', 'Menos código', 'No requiere compilación'], answer: 1 },
      { question: '¿Cómo se declara una variable con tipo en TypeScript?', options: ['var x: string = "hola"', 'var x = string "hola"', 'var x string = "hola"', 'var x: "hola"'], answer: 0 },
      { question: '¿Qué es una interfaz en TypeScript?', options: ['Un componente visual', 'Un contrato para la estructura de objetos', 'Un servidor web', 'Una base de datos'], answer: 1 },
    ],
    'css': [
      { question: '¿Qué es Flexbox?', options: ['Una librería de JavaScript', 'Un método de diseño CSS', 'Un navegador web', 'Una base de datos'], answer: 1 },
      { question: '¿Cuál es la propiedad para cambiar el color de texto?', options: ['background-color', 'color', 'text-color', 'font-color'], answer: 1 },
      { question: '¿Qué es Grid en CSS?', options: ['Una tabla HTML', 'Un sistema de diseño bidimensional', 'Un tipo de fuente', 'Un efecto visual'], answer: 1 },
    ],
  };

  // Buscar el tipo de curso y retornar ejercicios
  for (const [key, exercises] of Object.entries(exercisesMap)) {
    if (courseKey.includes(key)) {
      return exercises;
    }
  }

  // Ejercicios genéricos si no coincide
  return [
    { question: '¿Cuáles son los temas principales cubiertos en este curso?', options: ['Introducción y conceptos básicos', 'Conceptos avanzados', 'Aplicaciones prácticas', 'Todas las anteriores'], answer: 3 },
    { question: '¿Cuál es el objetivo de esta lección?', options: ['Aprender teoría', 'Practicar habilidades', 'Ambas opciones', 'Ninguna de las anteriores'], answer: 2 },
  ];
};

export default function CourseDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'loaded' | 'notfound' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [enrollmentId, setEnrollmentId] = useState<string | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [courseProgressPct, setCourseProgressPct] = useState(0);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState(0);
  const [answeredExercises, setAnsweredExercises] = useState<Record<number, number>>({});

  useEffect(() => {
    const controller = new AbortController();

    const loadCourse = async () => {
      if (!slug) {
        setStatus('notfound');
        return;
      }

      setStatus('loading');
      setErrorMessage('');
      setCourse(null);
      setLessons([]);
      setCompletedLessonIds([]);

      try {
        const response = await getJson<{ course: Course }>(`/courses/${encodeURIComponent(slug)}`, {
          signal: controller.signal,
        });

        if (!response.course) {
          setStatus('notfound');
          return;
        }

        setCourse(response.course);
        const courseLessons = Array.isArray(response.course.lessons) ? response.course.lessons : [];
        setLessons(courseLessons);
        setEnrollmentId(null);
        setIsEnrolled(false);
        setCourseProgressPct(0);
        setCompletedLessonIds([]);

        const isFreeTrackedCourse = Number(response.course.price) === 0 && FREE_PROGRESS_TITLES.has(normalizeCourseTitle(response.course.title));

        if (isFreeTrackedCourse && getToken()) {
          const enrollmentState = await getJson<EnrollmentStatusResponse>(`/enrollments/${response.course.id}/check`, {
            signal: controller.signal,
          });

          if (enrollmentState.enrolled && enrollmentState.enrollment) {
            const lessonIds = Array.isArray(enrollmentState.lesson_progress)
              ? enrollmentState.lesson_progress.filter((item) => item.completed).map((item) => item.lesson_id)
              : [];

            setEnrollmentId(enrollmentState.enrollment.id);
            setIsEnrolled(true);
            setCourseProgressPct(enrollmentState.enrollment.progress_pct ?? 0);
            setCompletedLessonIds(lessonIds);
          }
        }

        setStatus('loaded');
      } catch (err) {
        if (controller.signal.aborted) return;

        if (err instanceof ApiError && err.status === 404) {
          setStatus('notfound');
          return;
        }

        setStatus('error');
        setErrorMessage(err instanceof Error ? err.message : 'Error inesperado');
      }
    };

    loadCourse();

    return () => controller.abort();
  }, [slug]);

  if (status === 'loading' || status === 'idle') {
    return (
      <div className="lx-course-detail lx-container">
        <div className="lx-course-detail-empty">
          <h2>Cargando curso…</h2>
          <p>Estamos cargando el contenido del curso. Por favor espera un momento.</p>
        </div>
      </div>
    );
  }

  if (status === 'notfound') {
    return (
      <div className="lx-course-detail lx-container">
        <div className="lx-course-detail-empty">
          <h2>Curso no encontrado</h2>
          <p>No pudimos encontrar el curso solicitado. Verifica la URL o vuelve al catálogo.</p>
          <button className="lx-btn lx-btn-primary" onClick={() => navigate('/')}>Volver al inicio</button>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="lx-course-detail lx-container">
        <div className="lx-course-detail-empty">
          <h2>Error al cargar el curso</h2>
          <p>{errorMessage || 'Ocurrió un problema al obtener la información del curso.'}</p>
          <button className="lx-btn lx-btn-primary" onClick={() => navigate('/')}>Volver al inicio</button>
        </div>
      </div>
    );
  }

  if (!course) {
    return null;
  }

  const numericPrice = Number(course.price);
  const numericReviews = Number(course.total_reviews);
  const isTrackedFreeCourse = numericPrice === 0 && FREE_PROGRESS_TITLES.has(normalizeCourseTitle(course.title));
  const progressPct = lessons.length > 0
    ? Math.round((completedLessonIds.length / lessons.length) * 100)
    : courseProgressPct;

  const refreshEnrollmentState = async () => {
    if (!course || !isTrackedFreeCourse || !getToken()) {
      return;
    }

    const enrollmentState = await getJson<EnrollmentStatusResponse>(`/enrollments/${course.id}/check`);

    if (enrollmentState.enrolled && enrollmentState.enrollment) {
      setEnrollmentId(enrollmentState.enrollment.id);
      setIsEnrolled(true);
      setCourseProgressPct(enrollmentState.enrollment.progress_pct ?? 0);

      if (Array.isArray(enrollmentState.lesson_progress)) {
        const lessonIds = enrollmentState.lesson_progress
          .filter((item) => item.completed)
          .map((item) => item.lesson_id);

        setCompletedLessonIds(lessonIds);
      }
    }
  };

  const handleEnrollFreeCourse = async () => {
    if (!isTrackedFreeCourse || !course) return null;

    if (!getToken()) {
      navigate('/login');
      return null;
    }

    if (isEnrolled && enrollmentId) {
      return enrollmentId;
    }

    setIsEnrolling(true);
    setErrorMessage('');

    try {
      const result = await postJson<{ message: string; enrollment: { id: string } }>('/enrollments', { course_id: course.id });
      setEnrollmentId(result.enrollment.id);
      setIsEnrolled(true);
      await refreshEnrollmentState();
      return result.enrollment.id;
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'No se pudo inscribir al curso.');
      return null;
    } finally {
      setIsEnrolling(false);
    }
  };

  const toggleLessonCompletion = async (lessonId: string) => {
    if (!isTrackedFreeCourse || !course) return;

    if (!getToken()) {
      navigate('/login');
      return;
    }

    let activeEnrollmentId = enrollmentId;

    if (!activeEnrollmentId) {
      activeEnrollmentId = await handleEnrollFreeCourse();
    }

    if (!activeEnrollmentId) {
      return;
    }

    const isDone = completedLessonIds.includes(lessonId);
    const nextCompleted = isDone
      ? completedLessonIds.filter((id) => id !== lessonId)
      : [...completedLessonIds, lessonId];

    const nextProgress = Math.round((nextCompleted.length / lessons.length) * 100);

    setCompletedLessonIds(nextCompleted);
    setCourseProgressPct(nextProgress);

    try {
      const result = await patchJson<{ progress_pct: number }>(`/enrollments/${activeEnrollmentId}/progress`, {
        lesson_id: lessonId,
        completed: !isDone,
        watch_pct: isDone ? 0 : 100,
      });

      setCourseProgressPct(result.progress_pct ?? nextProgress);
      await refreshEnrollmentState();
    } catch (err) {
      setCompletedLessonIds(completedLessonIds);
      setCourseProgressPct(courseProgressPct);
      setErrorMessage(err instanceof Error ? err.message : 'No se pudo actualizar el progreso.');
    }
  };

  return (
    <div className="lx-course-detail lx-container">
      <div className="lx-course-detail-header">
        <button
          className="lx-back-btn"
          onClick={() => navigate('/', { state: { returnToCatalog: true } })}
        >
          ← Volver al catálogo
        </button>
      </div>

      <div className="lx-course-detail-grid">
        <section className="lx-course-detail-panel">
          <div className="lx-course-detail-hero">
            <div className="lx-course-detail-thumb">
              <span>{course.title.charAt(0)}</span>
            </div>
            <div className="lx-course-detail-body">
              <span className="lx-card-cat">{course.category}</span>
              <h1>{course.title}</h1>
              <p className="lx-course-detail-description">{course.description}</p>
              <div className="lx-course-detail-labels">
                <span className="lx-level-tag">{course.level}</span>
                <span className={numericPrice === 0 ? 'lx-price' : 'lx-price lx-price-paid'}>
                  {numericPrice === 0 ? 'Gratis' : `$${numericPrice.toFixed(0)}`}
                </span>
              </div>
              <div className="lx-course-detail-meta">
                <div className="lx-course-detail-meta-item">
                  <span>Instructor</span>
                  <strong>{course.instructor_name}</strong>
                </div>
                <div className="lx-course-detail-meta-item">
                  <span>Duración</span>
                  <strong>{course.duration_hrs}h</strong>
                </div>
                <div className="lx-course-detail-meta-item">
                  <span>Lecciones</span>
                  <strong>{lessons.length}</strong>
                </div>
                <div className="lx-course-detail-meta-item">
                  <span>Valoración</span>
                  <strong>{numericReviews > 0 ? `${numericReviews} reseñas` : 'Sin reseñas'}</strong>
                </div>
              </div>
              {isTrackedFreeCourse && (
                <div className="lx-course-progress">
                  <div className="lx-course-progress-header">
                    <span>Tu progreso</span>
                    <strong>{progressPct}%</strong>
                  </div>
                  <div className="lx-course-progress-bar" aria-label="Progreso del curso">
                    <div className="lx-course-progress-fill" style={{ width: `${progressPct}%` }} />
                  </div>
                </div>
              )}
              <div className="lx-course-detail-actions">
                {isTrackedFreeCourse ? (
                  <button className="lx-btn lx-btn-primary lx-btn-lg" onClick={handleEnrollFreeCourse} disabled={isEnrolling || isEnrolled}>
                    {isEnrolling ? 'Inscribiendo…' : isEnrolled ? 'Ya inscrito' : 'Inscribirme'}
                  </button>
                ) : (
                  <button className="lx-btn lx-btn-primary lx-btn-lg">Inscribirme</button>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="lx-course-detail-lessons">
          <div className="lx-course-detail-section-head">
            <h2>Contenido del curso</h2>
            <p>Temario ordenado por posición. Consulta cada sección antes de inscribirte.</p>
          </div>
          <div className="lx-lesson-list">
            {lessons.length > 0 ? lessons.map((lesson, index) => (
              <div key={lesson.id} className="lx-lesson-card" onClick={() => {
                setSelectedLesson(lesson);
                setSelectedExerciseIndex(0);
                setAnsweredExercises({});
              }} style={{ cursor: 'pointer', transition: 'all 0.2s' }}>
                <div className="lx-lesson-index">{index + 1}</div>
                <div className="lx-lesson-content" style={{ flex: 1 }}>
                  <h3 className="lx-lesson-title">{lesson.title}</h3>
                  <div className="lx-lesson-meta">
                    <span>{lesson.duration_min} min</span>
                    {lesson.is_free && <span className="lx-badge-free">Gratis</span>}
                  </div>
                  {lesson.description && <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: '0.5rem 0 0 0' }}>{lesson.description.substring(0, 100)}...</p>}
                  {isTrackedFreeCourse && (
                    <div className="lx-lesson-actions">
                      <button
                        className={`lx-lesson-toggle${completedLessonIds.includes(lesson.id) ? ' is-done' : ''}`}
                        onClick={(e) => { e.stopPropagation(); void toggleLessonCompletion(lesson.id); }}
                        type="button"
                      >
                        {completedLessonIds.includes(lesson.id) ? '✓ Completado' : 'Marcar como visto'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )) : (
              <div className="lx-course-detail-empty">
                <h3>Contenido en preparación</h3>
                <p>Este curso aún no tiene lecciones publicadas.</p>
              </div>
            )}
          </div>
        </section>

        {/* Modal de contenido de lección */}
        {selectedLesson && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }} onClick={() => {
            setSelectedLesson(null);
            setSelectedExerciseIndex(0);
            setAnsweredExercises({});
          }}>
            <div style={{
              background: '#0f172a',
              borderRadius: '12px',
              border: '1px solid #334155',
              maxWidth: '700px',
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto',
              padding: '2rem',
              boxShadow: '0 20px 25px rgba(0, 0, 0, 0.5)',
            }} onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
                <div>
                  <h2 style={{ color: 'white', margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>{selectedLesson.title}</h2>
                  <div style={{ display: 'flex', gap: '1rem', color: '#94a3b8', fontSize: '0.9rem' }}>
                    <span>⏱️ {selectedLesson.duration_min} minutos</span>
                    {selectedLesson.is_free && <span className="lx-badge-free">Gratis</span>}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedLesson(null);
                    setSelectedExerciseIndex(0);
                    setAnsweredExercises({});
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    padding: '0',
                  }}
                >
                  ✕
                </button>
              </div>

              <div style={{ background: '#1e293b', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid #334155' }}>
                <h3 style={{ color: 'white', margin: '0 0 1rem 0', fontSize: '1.1rem' }}>Descripción</h3>
                <p style={{ color: '#cbd5e1', margin: 0, lineHeight: '1.6' }}>
                  {selectedLesson.description || 'No hay descripción disponible para esta lección.'}
                </p>
              </div>

              <div style={{ background: '#1e293b', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid #334155' }}>
                <h3 style={{ color: 'white', margin: '0 0 1rem 0', fontSize: '1.1rem' }}>📹 Video</h3>
                <div style={{ background: '#0f172a', borderRadius: '6px', padding: '1rem', marginBottom: '1rem', border: '1px solid #334155' }}>
                  <div style={{ aspectRatio: '16/9', background: '#1e293b', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', overflow: 'hidden' }}>
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0`}
                      title="Lección en video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ borderRadius: '4px' }}
                    />
                  </div>
                  <a
                    href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-block',
                      background: '#ef4444',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '4px',
                      textDecoration: 'none',
                      fontWeight: 'bold',
                      fontSize: '0.9rem',
                    }}
                  >
                    Ver en YouTube →
                  </a>
                </div>
              </div>

              <div style={{ background: '#1e293b', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid #334155' }}>
                <h3 style={{ color: 'white', margin: '0 0 1rem 0', fontSize: '1.1rem' }}>📄 Recursos Descargables</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = 'data:text/plain,Este es un ejemplo de recurso descargable para ' + selectedLesson.title + '\n\nContenido del curso:\n- Introducci%C3%B3n\n- Conceptos principales\n- Ejercicios pr%C3%A1cticos\n- Conclusi%C3%B3n';
                      link.download = `${selectedLesson.title.replace(/\s+/g, '-').toLowerCase()}.txt`;
                      link.click();
                    }}
                    style={{
                      background: '#3b82f6',
                      color: 'white',
                      padding: '1rem',
                      borderRadius: '6px',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#2563eb')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = '#3b82f6')}
                  >
                    📥 Descargar Apuntes
                  </button>
                  <button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = 'data:application/pdf,%25PDF-1.4%0A%25%C3%A4%C3%BC%C3%B6%C3%9F%0A1%200%20obj%0A%3C%3C%2FType%2F%2FCatalog%2F%2FPages%201%200%20R%3E%3E%0Aendobj%0A2%200%20obj%0A%3C%3C%2FType%2F%2FPages%2F%2FKids%5B3%200%20R%5D%2F%2FCount%201%3E%3E%0Aendobj%0A3%200%20obj%0A%3C%3C%2FType%2F%2FPage%2F%2FParent%202%200%20R%2F%2FResources%3C%3C%2FFont%3C%3C%2FF1%204%200%20R%3E%3E%3E%3E%2F%2FMediaBox%5B0%200%20612%20792%5D%2F%2FContents%205%200%20R%3E%3E%0Aendobj%0A4%200%20obj%0A%3C%3C%2FType%2F%2FFont%2F%2FSubtype%2F%2FType1%2F%2FBaseFont%2F%2FHelvetica%3E%3E%0Aendobj%0A5%200%20obj%0A%3C%3C%2FLength%20230%3E%3E%0Astream%0ABT%0A%2FF1%2012%20Tf%0A50%20750%20Td%0A(Gu%C3%ADa%20Pr%C3%A1ctica%20-%20' + encodeURIComponent(selectedLesson.title) + ')%20Tj%0AET%0Aendstream%0Aendobj%0Axref%0A0%206%0A0000000000%2065535%20f%0A0000000009%2000000%20n%0A0000000074%2000000%20n%0A0000000135%2000000%20n%0A0000000265%2000000%20n%0A0000000361%2000000%20n%0Atrailer%0A%3C%3C%2FSize%206%2F%2FRoot%201%200%20R%3E%3E%0Astartxref%0A641%0A%25%25EOF';
                      link.download = `${selectedLesson.title.replace(/\s+/g, '-').toLowerCase()}.pdf`;
                      link.click();
                    }}
                    style={{
                      background: '#ec4899',
                      color: 'white',
                      padding: '1rem',
                      borderRadius: '6px',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#db2777')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = '#ec4899')}
                  >
                    📄 Descargar PDF
                  </button>
                </div>
              </div>

              <div style={{ background: '#1e293b', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid #334155' }}>
                <h3 style={{ color: 'white', margin: '0 0 1rem 0', fontSize: '1.1rem' }}>✏️ Ejercicios para Reforzar</h3>
                {(() => {
                  const exercises = generateExercises(course?.title || '');
                  const currentExercise = exercises[selectedExerciseIndex];
                  const userAnswer = answeredExercises[selectedExerciseIndex];
                  const isCorrect = userAnswer === currentExercise.answer;
                  
                  return (
                    <div>
                      <div style={{ marginBottom: '1rem', background: '#0f172a', padding: '1rem', borderRadius: '6px', border: '1px solid #334155' }}>
                        <div style={{ color: '#94a3b8', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                          Ejercicio {selectedExerciseIndex + 1} de {exercises.length}
                        </div>
                        <h4 style={{ color: 'white', margin: '0 0 1rem 0' }}>{currentExercise.question}</h4>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
                          {currentExercise.options.map((option, index) => (
                            <button
                              key={index}
                              onClick={() => setAnsweredExercises({ ...answeredExercises, [selectedExerciseIndex]: index })}
                              style={{
                                background: userAnswer === index
                                  ? isCorrect
                                    ? '#10b981'
                                    : '#ef4444'
                                  : '#334155',
                                color: 'white',
                                padding: '0.75rem 1rem',
                                borderRadius: '4px',
                                border: 'none',
                                cursor: 'pointer',
                                textAlign: 'left',
                                transition: 'background 0.2s',
                                fontWeight: userAnswer === index ? 'bold' : 'normal',
                              }}
                              disabled={userAnswer !== undefined}
                            >
                              {userAnswer === index && (isCorrect ? '✓ ' : '✗ ')}
                              {option}
                            </button>
                          ))}
                        </div>

                        {userAnswer !== undefined && (
                          <div style={{
                            marginTop: '1rem',
                            padding: '1rem',
                            background: isCorrect ? '#065f46' : '#7f1d1d',
                            borderRadius: '4px',
                            color: isCorrect ? '#86efac' : '#fca5a5',
                            fontWeight: 'bold',
                          }}>
                            {isCorrect ? '✓ ¡Respuesta correcta!' : '✗ Respuesta incorrecta. Intenta de nuevo.'}
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
                        <button
                          onClick={() => {
                            setSelectedExerciseIndex(Math.max(0, selectedExerciseIndex - 1));
                          }}
                          disabled={selectedExerciseIndex === 0}
                          style={{
                            background: selectedExerciseIndex === 0 ? '#475569' : '#6366f1',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            borderRadius: '4px',
                            border: 'none',
                            cursor: selectedExerciseIndex === 0 ? 'not-allowed' : 'pointer',
                            fontWeight: 'bold',
                          }}
                        >
                          ← Anterior
                        </button>
                        
                        <div style={{ color: '#94a3b8', display: 'flex', alignItems: 'center' }}>
                          {selectedExerciseIndex + 1} / {exercises.length}
                        </div>

                        <button
                          onClick={() => {
                            setSelectedExerciseIndex(Math.min(exercises.length - 1, selectedExerciseIndex + 1));
                          }}
                          disabled={selectedExerciseIndex === exercises.length - 1}
                          style={{
                            background: selectedExerciseIndex === exercises.length - 1 ? '#475569' : '#6366f1',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            borderRadius: '4px',
                            border: 'none',
                            cursor: selectedExerciseIndex === exercises.length - 1 ? 'not-allowed' : 'pointer',
                            fontWeight: 'bold',
                          }}
                        >
                          Siguiente →
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {isTrackedFreeCourse && (
                <button
                  className={`lx-lesson-toggle ${completedLessonIds.includes(selectedLesson.id) ? 'is-done' : ''}`}
                  onClick={() => {
                    void toggleLessonCompletion(selectedLesson.id);
                    setSelectedLesson(null);
                  }}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: completedLessonIds.includes(selectedLesson.id) ? '#10b981' : '#6366f1',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                  }}
                >
                  {completedLessonIds.includes(selectedLesson.id) ? '✓ Completado' : 'Marcar como visto'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
