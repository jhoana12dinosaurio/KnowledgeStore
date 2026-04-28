import { useMemo, useState } from 'react';
import './App.css';
import type { Page } from './types';
import { allCourses, categories } from './data/courses';
import { blogPosts, enterpriseSolutions, liveSessions, memberships, relatedCompanies, stats } from './data/siteData';
import { StarRating } from './components/StarRating';
import { CoursesPage } from './pages/CoursesPage';
import { EnterprisePage } from './pages/EnterprisePage';
import { BlogPage } from './pages/BlogPage';
import { LivePage } from './pages/LivePage';
import { PricingPage } from './pages/PricingPage';
import { LoginPage } from './pages/LoginPage';

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [page, setPage] = useState<Page>('home');

  const featuredCourses = useMemo(() => allCourses.filter((course) => course.featured), []);

  const handleSearch = () => {
    setPage('courses');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const resetHome = () => {
    setPage('home');
    setSearchTerm('');
    setSelectedCategory('Todos');
  };

  const openCourses = () => {
    setPage('courses');
  };

  const openEnterprisePage = () => {
    setPage('enterprise');
  };

  const openPricingPage = () => {
    setPage('pricing');
  };

  const handlePlanAction = (planId: string) => {
    if (planId === 'enterprise') {
      setPage('enterprise');
      return;
    }
    setPage('login');
  };

  const renderPage = () => {
    if (page === 'courses') {
      return (
        <CoursesPage
          courses={allCourses}
          categories={categories}
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          onSearchChange={setSearchTerm}
          onCategoryChange={setSelectedCategory}
        />
      );
    }

    if (page === 'enterprise') {
      return (
        <EnterprisePage
          solutions={enterpriseSolutions}
          companies={relatedCompanies}
          onBackHome={resetHome}
          onViewCourses={openCourses}
        />
      );
    }

    if (page === 'blog') return <BlogPage posts={blogPosts} />;
    if (page === 'live') return <LivePage sessions={liveSessions} />;
    if (page === 'pricing') return <PricingPage memberships={memberships} />;
    if (page === 'login') return <LoginPage onBackHome={resetHome} />;

    return (
      <>
        {/* Hero Section */}
        <section className="ev-hero">
          <div className="ev-hero-glow"></div>
          <span className="ev-hero-badge">
            <span className="ev-badge-dot"></span>
            Más de 1,500 cursos disponibles
          </span>
          <h1>
            Aprende las habilidades <span>del futuro</span>
          </h1>
          <p className="ev-hero-sub">
            Únete a más de 6 millones de estudiantes aprendiendo tecnología, marketing, diseño e idiomas con los mejores expertos de Latinoamérica.
          </p>

          <div className="ev-search-wrapper">
            <div className="ev-search-box">
              <svg className="ev-search-icon" viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
              <input
                placeholder="Buscar cursos: React, Python, Marketing, Inglés..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyPress}
              />
              <button onClick={handleSearch}>Explorar cursos</button>
            </div>
            <div className="ev-search-tags">
              <span>Populares:</span>
              {['React', 'Python', 'Marketing', 'Inglés', 'Figma'].map(tag => (
                <button key={tag} onClick={() => { setSearchTerm(tag); setPage('courses'); }}>
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="ev-stats">
          {stats.map((stat) => (
            <div className="ev-stat" key={stat.label}>
              <span className="ev-stat-icon">{stat.icon}</span>
              <div className="ev-stat-content">
                <span className="ev-stat-value">{stat.value}</span>
                <span className="ev-stat-label">{stat.label}</span>
              </div>
            </div>
          ))}
        </section>

        {/* Featured Courses */}
        <section className="ev-featured">
          <div className="ev-section-header">
            <h2>Cursos <span>destacados</span></h2>
            <p>Los cursos más populares seleccionados para ti</p>
          </div>
          <div className="ev-courses-grid">
            {featuredCourses.slice(0, 6).map((course) => (
              <div className="ev-course-card" key={course.id}>
                <div className="ev-course-image">
                  <span>{course.image}</span>
                  {course.price === 'Gratis' && <span className="ev-course-badge">Gratis</span>}
                </div>
                <div className="ev-course-content">
                  <span className="ev-course-category">{course.category}</span>
                  <h3>{course.title}</h3>
                  <p className="ev-course-instructor">Por {course.instructor}</p>
                  <div className="ev-course-meta">
                    <StarRating rating={course.rating} />
                    <span className="ev-meta-item"><svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg> {(course.students / 1000).toFixed(1)}k</span>
                    <span className="ev-meta-item"><svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg> {course.duration}</span>
                  </div>
                  <div className="ev-course-footer">
                    <span className="ev-course-level">{course.level}</span>
                    <span className="ev-course-price">{course.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="ev-view-all" onClick={openCourses}>
            Ver todos los cursos
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
          </button>
        </section>

        {/* Categories Preview */}
        <section className="ev-categories-preview">
          <div className="ev-section-header">
            <h2>Explora por <span>categoría</span></h2>
            <p>Encuentra el camino de aprendizaje perfecto para ti</p>
          </div>
          <div className="ev-category-cards">
            {categories.filter(c => c !== 'Todos').map(category => {
              const count = allCourses.filter(c => c.category === category).length;
              return (
                <div
                  key={category}
                  className="ev-category-card"
                  onClick={() => { setSelectedCategory(category); setPage('courses'); }}
                >
                  <span className="ev-category-count">{count} cursos</span>
                  <h3>{category}</h3>
                  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                  </svg>
                </div>
              );
            })}
          </div>
        </section>

        {/* Memberships Section */}
        <section className="ev-memberships">
          <div className="ev-section-header">
            <h2>Elige tu <span>plan</span></h2>
            <p>Selecciona la membresía que mejor se adapte a tus necesidades</p>
          </div>
          <div className="ev-membership-cards">
            {memberships.map((membership) => (
              <div
                key={membership.id}
                className={`ev-membership-card ${membership.highlighted ? 'highlighted' : ''}`}
                style={{ '--accent-color': membership.color } as React.CSSProperties}
              >
                {membership.highlighted && (
                  <span className="ev-membership-popular">Más popular</span>
                )}
                <div className="ev-membership-header">
                  <h3>{membership.name}</h3>
                  <div className="ev-membership-price">
                    <span className="ev-price-amount">{membership.price}</span>
                    {membership.period && <span className="ev-price-period">{membership.period}</span>}
                  </div>
                  <p className="ev-membership-desc">{membership.description}</p>
                </div>
                <ul className="ev-membership-features">
                  {membership.features.map((feature, index) => (
                    <li key={index}>
                      <svg viewBox="0 0 24 24" fill="var(--accent-color)" width="18" height="18">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className={`ev-membership-btn ${membership.highlighted ? 'primary' : ''}`} onClick={() => handlePlanAction(membership.id)}>
                  {membership.buttonText}
                </button>
              </div>
            ))}
          </div>
        </section>
      </>
    );
  };

  return (
    <div className="ev-bg">
      {/* Animated Background Elements */}
      <div className="ev-bg-gradient"></div>
      <div className="ev-bg-orbs">
        <div className="ev-orb ev-orb-1"></div>
        <div className="ev-orb ev-orb-2"></div>
        <div className="ev-orb ev-orb-3"></div>
      </div>

      {/* Navbar */}
      <nav className="ev-navbar">
        <div className="ev-logo" onClick={resetHome}>
          <div className="ev-logo-icon">
            <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26">
              <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6A4.997 4.997 0 017 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z"/>
            </svg>
          </div>
          <span className="ev-logo-text">Learnix</span>
        </div>
        <ul className="ev-nav-links">
          <li className={page === 'courses' ? 'active' : ''} onClick={openCourses}>Cursos</li>
          <li className={page === 'enterprise' ? 'active' : ''} onClick={openEnterprisePage}>Empresas</li>
          <li className={page === 'blog' ? 'active' : ''} onClick={() => setPage('blog')}>Blog</li>
          <li className={`ev-nav-live ${page === 'live' ? 'active' : ''}`} onClick={() => setPage('live')}>Live <span className="ev-live-dot"></span></li>
          <li className={page === 'pricing' ? 'active' : ''} onClick={openPricingPage}>Precios</li>
        </ul>
        <div className="ev-nav-actions">
          <button className="ev-login-btn ev-login-ghost" onClick={() => setPage('login')}>Iniciar sesión</button>
          <button className="ev-login-btn" onClick={() => setPage('login')}>Comenzar gratis</button>
        </div>
      </nav>

      {renderPage()}

      {/* WhatsApp Floating Icon */}
      <a href="https://wa.me/51999999999" className="ev-whatsapp" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  );
}
