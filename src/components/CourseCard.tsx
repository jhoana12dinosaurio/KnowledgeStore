import { StarRating } from './StarRating';

type Course = {
  id: number;
  title: string;
  category: string;
  level: string;
  duration: string;
  rating: number;
  students: number;
  instructor: string;
  image: string;
  price: string;
  featured?: boolean;
};

export const CourseCard = ({ course, onClick }: { course: Course; onClick?: () => void }) => (
  <div className="lx-course-card" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
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
        <span className="lx-meta-item">
          <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13">
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
          </svg>
          {(course.students / 1000).toFixed(1)}k
        </span>
        <span className="lx-meta-item">
          <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13">
            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
          </svg>
          {course.duration}
        </span>
      </div>
      <div className="lx-card-footer">
        <span className="lx-level-tag">{course.level}</span>
        <span className={`lx-price${course.price !== 'Gratis' ? ' lx-price-paid' : ''}`}>
          {course.price}
        </span>
      </div>
    </div>
  </div>
);
