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
              <div key={lesson.id} className="lx-lesson-card">
                <div className="lx-lesson-index">{index + 1}</div>
                <div className="lx-lesson-content">
                  <h3 className="lx-lesson-title">{lesson.title}</h3>
                  <div className="lx-lesson-meta">
                    <span>{lesson.duration_min} min</span>
                    {lesson.is_free && <span className="lx-badge-free">Gratis</span>}
                  </div>
                  {isTrackedFreeCourse && (
                    <div className="lx-lesson-actions">
                      <button
                        className={`lx-lesson-toggle${completedLessonIds.includes(lesson.id) ? ' is-done' : ''}`}
                        onClick={() => void toggleLessonCompletion(lesson.id)}
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
      </div>
    </div>
  );
}
