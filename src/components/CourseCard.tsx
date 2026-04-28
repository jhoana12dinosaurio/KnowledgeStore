import type { Course } from '../types';
import { StarRating } from './StarRating';

interface CourseCardProps {
  course: Course;
  isFavorite?: boolean;
  detailed?: boolean;
  onToggleFavorite?: (courseId: number) => void;
  onViewSyllabus?: (course: Course) => void;
  onEnroll?: (course: Course) => void;
}

export function CourseCard({ course, isFavorite = false, detailed = false, onToggleFavorite, onViewSyllabus, onEnroll }: CourseCardProps) {
  return (
    <article className={`ev-course-card ${detailed ? 'ev-course-card-detailed' : ''}`}>
      <div className="ev-course-image">
        <span>{course.image}</span>
        {course.price === 'Gratis' && <span className="ev-course-badge">Gratis</span>}
        {course.featured && <span className="ev-course-featured">⭐ Popular</span>}
      </div>
      <div className="ev-course-content">
        <span className="ev-course-category">{course.category}</span>
        <h3>{course.title}</h3>
        <p className="ev-course-instructor">Por {course.instructor}</p>
        {detailed && <p className="ev-course-description">{course.description}</p>}
        <div className="ev-course-meta">
          <StarRating rating={course.rating} />
          <span className="ev-meta-item">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" /></svg>
            {(course.students / 1000).toFixed(1)}k
          </span>
          <span className="ev-meta-item">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" /></svg>
            {course.duration}
          </span>
        </div>
        {detailed && (
          <div className="ev-course-tags">
            {course.tags.map((tag) => <span key={tag}>{tag}</span>)}
          </div>
        )}
        <div className="ev-course-footer">
          <span className="ev-course-level">{course.level}</span>
          <span className="ev-course-price">{course.price}</span>
        </div>
        {detailed && (
          <div className="ev-course-actions-row">
            <button className="ev-small-primary-btn" onClick={() => onViewSyllabus?.(course)} type="button">Ver temario</button>
            <button className="ev-small-primary-btn ev-small-secondary-btn" onClick={() => onEnroll?.(course)} type="button">Inscribirme</button>
            <button className={`ev-icon-action ${isFavorite ? 'active' : ''}`} onClick={() => onToggleFavorite?.(course.id)} type="button">
              {isFavorite ? 'Guardado' : 'Guardar'}
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
