import { useMemo, useState, type FormEvent } from 'react';
import type { Course } from '../types';
import { courseLevels } from '../data/courses';
import { learningPaths } from '../data/siteData';
import { CourseCard } from '../components/CourseCard';
import { SectionHeader } from '../components/SectionHeader';

type SortOption = 'popular' | 'rating' | 'duration' | 'price';
type ModalMode = 'syllabus' | 'enroll' | null;

interface CoursesPageProps {
  courses: Course[];
  categories: readonly string[];
  searchTerm: string;
  selectedCategory: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

function parseDuration(duration: string) {
  return Number(duration.replace('h', '')) || 0;
}

function parsePrice(price: string) {
  return price === 'Gratis' ? 0 : Number(price.replace('$', '')) || 0;
}

export function CoursesPage({ courses, categories, searchTerm, selectedCategory, onSearchChange, onCategoryChange }: CoursesPageProps) {
  const [selectedLevel, setSelectedLevel] = useState('Todos');
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [advisorSent, setAdvisorSent] = useState(false);
  const [enrollmentSent, setEnrollmentSent] = useState(false);

  const filteredCourses = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return courses
      .filter((course) => {
        const matchesSearch = !normalizedSearch ||
          course.title.toLowerCase().includes(normalizedSearch) ||
          course.category.toLowerCase().includes(normalizedSearch) ||
          course.instructor.toLowerCase().includes(normalizedSearch) ||
          course.tags.some((tag) => tag.toLowerCase().includes(normalizedSearch));
        const matchesCategory = selectedCategory === 'Todos' || course.category === selectedCategory;
        const matchesLevel = selectedLevel === 'Todos' || course.level === selectedLevel;
        return matchesSearch && matchesCategory && matchesLevel;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'duration') return parseDuration(a.duration) - parseDuration(b.duration);
        if (sortBy === 'price') return parsePrice(a.price) - parsePrice(b.price);
        return b.students - a.students;
      });
  }, [courses, searchTerm, selectedCategory, selectedLevel, sortBy]);

  const featuredCount = filteredCourses.filter((course) => course.featured).length;
  const freeCount = filteredCourses.filter((course) => course.price === 'Gratis').length;
  const averageRating = filteredCourses.length
    ? (filteredCourses.reduce((sum, course) => sum + course.rating, 0) / filteredCourses.length).toFixed(1)
    : '0.0';

  const toggleFavorite = (courseId: number) => {
    setFavorites((current) => current.includes(courseId)
      ? current.filter((id) => id !== courseId)
      : [...current, courseId]
    );
  };

  const clearFilters = () => {
    onSearchChange('');
    onCategoryChange('Todos');
    setSelectedLevel('Todos');
    setSortBy('popular');
  };

  const openCourseModal = (course: Course, mode: ModalMode) => {
    setSelectedCourse(course);
    setModalMode(mode);
    setEnrollmentSent(false);
  };

  const closeModal = () => {
    setSelectedCourse(null);
    setModalMode(null);
  };

  const handleAdvisorSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAdvisorSent(true);
  };

  const handleEnrollmentSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEnrollmentSent(true);
  };

  return (
    <section className="ev-catalog ev-page-shell">
      <div className="ev-catalog-header ev-page-hero">
        <div className="ev-catalog-info">
          <span className="ev-eyebrow">Catálogo actualizado</span>
          <h1>
            {selectedCategory === 'Todos'
              ? searchTerm
                ? `Resultados para "${searchTerm}"`
                : 'Todos los cursos'
              : selectedCategory}
          </h1>
          <p>{filteredCourses.length} cursos encontrados. Filtra por categoría, nivel o preferencia de búsqueda.</p>
        </div>
        <div className="ev-catalog-search ev-enhanced-search">
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
          <input
            placeholder="Buscar por curso, instructor o etiqueta..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="ev-catalog-summary">
        <div><strong>{featuredCount}</strong><span>destacados</span></div>
        <div><strong>{freeCount}</strong><span>gratuitos</span></div>
        <div><strong>{averageRating}</strong><span>rating promedio</span></div>
        <div><strong>{favorites.length}</strong><span>guardados</span></div>
      </div>

      <div className="ev-catalog-toolbar">
        <div className="ev-catalog-filters ev-filter-group">
          {categories.map((category) => (
            <button
              key={category}
              className={`ev-filter-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => onCategoryChange(category)}
              type="button"
            >
              {category}
              {category !== 'Todos' && <span className="ev-filter-count">{courses.filter((course) => course.category === category).length}</span>}
            </button>
          ))}
        </div>

        <div className="ev-secondary-filters">
          <label>
            Nivel
            <select value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)}>
              {courseLevels.map((level) => <option key={level}>{level}</option>)}
            </select>
          </label>
          <label>
            Ordenar
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortOption)}>
              <option value="popular">Más populares</option>
              <option value="rating">Mejor valorados</option>
              <option value="duration">Menor duración</option>
              <option value="price">Menor precio</option>
            </select>
          </label>
        </div>
      </div>

      <SectionHeader
        title="Rutas"
        highlight="recomendadas"
        description="Apartados creados para orientar el aprendizaje según una meta concreta."
      />
      <div className="ev-path-grid">
        {learningPaths.map((path) => (
          <article className="ev-section-card" key={path.title}>
            <span className="ev-card-pill">{path.duration}</span>
            <h3>{path.title}</h3>
            <p>{path.description}</p>
            <ul className="ev-clean-list">
              {path.modules.map((module) => <li key={module}>{module}</li>)}
            </ul>
            <strong className="ev-card-result">{path.outcome}</strong>
          </article>
        ))}
      </div>

      <div className="ev-catalog-grid ev-catalog-grid-enhanced">
        {filteredCourses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            detailed
            isFavorite={favorites.includes(course.id)}
            onToggleFavorite={toggleFavorite}
            onViewSyllabus={(item) => openCourseModal(item, 'syllabus')}
            onEnroll={(item) => openCourseModal(item, 'enroll')}
          />
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="ev-no-results">
          <span>🔍</span>
          <h3>No se encontraron cursos</h3>
          <p>Intenta con otros términos de búsqueda o cambia el filtro de categoría.</p>
          <button onClick={clearFilters} type="button">Ver todos los cursos</button>
        </div>
      )}

      <div className="ev-two-column-section ev-courses-extra">
        <article className="ev-section-card">
          <span className="ev-eyebrow">Orientación</span>
          <h2>Formulario para recibir recomendación de cursos</h2>
          <p>Este formulario ayuda a simular cómo la plataforma podría recomendar una ruta según el perfil del estudiante.</p>
          <form className="ev-form" onSubmit={handleAdvisorSubmit}>
            <div className="ev-form-grid">
              <label>Nombre completo<input required placeholder="Ej. Yameli Cano" /></label>
              <label>Correo<input required type="email" placeholder="correo@ejemplo.com" /></label>
              <label>Meta principal
                <select defaultValue="">
                  <option value="" disabled>Selecciona una meta</option>
                  <option>Conseguir prácticas</option>
                  <option>Mejorar mi trabajo actual</option>
                  <option>Crear un emprendimiento</option>
                  <option>Aprender por hobby</option>
                </select>
              </label>
              <label>Tiempo disponible
                <select defaultValue="">
                  <option value="" disabled>Selecciona una opción</option>
                  <option>2 a 4 horas por semana</option>
                  <option>5 a 8 horas por semana</option>
                  <option>Más de 8 horas por semana</option>
                </select>
              </label>
            </div>
            <label>Área de interés<textarea rows={4} placeholder="Cuéntanos qué deseas aprender y tu nivel actual." /></label>
            <button className="ev-small-primary-btn" type="submit">Solicitar recomendación</button>
            {advisorSent && <p className="ev-success-message">Solicitud registrada. En una versión real, se enviaría al asesor académico.</p>}
          </form>
        </article>

        <article className="ev-section-card ev-checklist-card">
          <span className="ev-eyebrow">Proceso</span>
          <h2>Flujo sugerido del estudiante</h2>
          <ul className="ev-timeline-list">
            <li><strong>1. Registro:</strong> el estudiante crea su cuenta.</li>
            <li><strong>2. Diagnóstico:</strong> completa sus intereses y nivel.</li>
            <li><strong>3. Inscripción:</strong> elige un curso o una ruta.</li>
            <li><strong>4. Seguimiento:</strong> revisa avance, tareas y certificados.</li>
          </ul>
        </article>
      </div>

      {selectedCourse && modalMode && (
        <div className="ev-modal-backdrop" role="presentation" onClick={closeModal}>
          <div className="ev-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <button className="ev-modal-close" onClick={closeModal} type="button">×</button>
            {modalMode === 'syllabus' ? (
              <>
                <span className="ev-eyebrow">Temario</span>
                <h2>{selectedCourse.title}</h2>
                <p>{selectedCourse.description}</p>
                <div className="ev-syllabus-list">
                  <div><strong>Módulo 1</strong><span>Fundamentos y conceptos base</span></div>
                  <div><strong>Módulo 2</strong><span>Prácticas guiadas con ejercicios</span></div>
                  <div><strong>Módulo 3</strong><span>Proyecto aplicado del curso</span></div>
                  <div><strong>Módulo 4</strong><span>Evaluación y certificado</span></div>
                </div>
                <button className="ev-small-primary-btn" onClick={() => setModalMode('enroll')} type="button">Inscribirme a este curso</button>
              </>
            ) : (
              <>
                <span className="ev-eyebrow">Inscripción</span>
                <h2>Formulario de inscripción</h2>
                <p>Curso seleccionado: <strong>{selectedCourse.title}</strong></p>
                <form className="ev-form" onSubmit={handleEnrollmentSubmit}>
                  <div className="ev-form-grid">
                    <label>Nombre completo<input required placeholder="Nombre y apellido" /></label>
                    <label>Correo electrónico<input required type="email" placeholder="correo@ejemplo.com" /></label>
                    <label>Teléfono<input placeholder="+51 999 999 999" /></label>
                    <label>Modalidad
                      <select defaultValue="grabado">
                        <option value="grabado">Curso grabado</option>
                        <option value="vivo">Con clases en vivo</option>
                        <option value="mentoria">Con mentoría</option>
                      </select>
                    </label>
                  </div>
                  <label>Comentario adicional<textarea rows={3} placeholder="Indica tus dudas o disponibilidad." /></label>
                  <button className="ev-small-primary-btn" type="submit">Enviar inscripción</button>
                  {enrollmentSent && <p className="ev-success-message">Inscripción simulada enviada correctamente.</p>}
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
