import { useEffect, useState } from 'react';
import {  useNavigate,useParams } from 'react-router-dom';

type Course = {
  id: number;
  title: string;
  description: string;
  category: string;
  instructor_name: string;
  level: string;
  duration_hrs: number;
  price: number;
  total_students: number;
  total_reviews: number;
  thumbnail_url?: string | null;
};

type Lesson = {
  id: number;
  title: string;
  description: string | null;
  duration_min: number;
  position: number;
  is_free: boolean;
};

export default function CourseDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'loaded' | 'notfound' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (!slug) return;

    setStatus('loading');
    setErrorMessage('');

    fetch(`/api/courses/${encodeURIComponent(slug)}`)
      .then(async (res) => {
        if (res.status === 404) {
          setStatus('notfound');
          return null;
        }
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body?.error || 'Error al cargar el curso');
        }
        const json = await res.json();
        return json.course as Course;
      })
      .then((courseData) => {
        if (!courseData) return;
        setCourse(courseData);
        return fetch(`/api/courses/${courseData.id}/lessons`);
      })
      .then(async (res) => {
        if (!res) return;
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body?.error || 'Error al cargar las lecciones');
        }
        const json = await res.json();
        setLessons(json.lessons || []);
        setStatus('loaded');
      })
      .catch((err) => {
        if (status !== 'notfound') {
          setStatus('error');
          setErrorMessage(err.message || 'Error inesperado');
        }
      });
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
        </div>
      </div>
    );
  }

  if (!course) {
    return null;
  }

  return (
    <div className="lx-course-detail lx-container">
        <div className="lx-course-detail-header">
  <button
    className="lx-back-btn"
    onClick={() => navigate(-1)}
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
                <span className={course.price === 0 ? 'lx-price' : 'lx-price lx-price-paid'}>
                  {course.price === 0 ? 'Gratis' : `$${course.price}`}
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
                  <strong>{course.total_reviews > 0 ? `${course.total_reviews} reseñas` : 'Sin reseñas'}</strong>
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
            {lessons.map((lesson, index) => (
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
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
