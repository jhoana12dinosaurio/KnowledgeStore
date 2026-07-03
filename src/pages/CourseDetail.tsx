import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ApiError, getJson } from '../services/api';

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

export default function CourseDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'loaded' | 'notfound' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

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

      try {
        const response = await getJson<{ course: Course }>(`/courses/${encodeURIComponent(slug)}`, {
          signal: controller.signal,
        });

        if (!response.course) {
          setStatus('notfound');
          return;
        }

        setCourse(response.course);
        setLessons(Array.isArray(response.course.lessons) ? response.course.lessons : []);
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

  return (
    <div className="lx-course-detail lx-container">
      <div className="lx-course-detail-header">
        <button className="lx-back-btn" onClick={() => navigate(-1)}>
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
              <div className="lx-course-detail-actions">
                <button className="lx-btn lx-btn-primary lx-btn-lg">Inscribirme</button>
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
