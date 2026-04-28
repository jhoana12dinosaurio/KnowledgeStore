import { useMemo, useState, type FormEvent } from 'react';
import type { BlogPost } from '../types';
import { SectionHeader } from '../components/SectionHeader';

interface BlogPageProps {
  posts: BlogPost[];
}

export function BlogPage({ posts }: BlogPageProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Todos');
  const [subscribed, setSubscribed] = useState(false);

  const categories = useMemo(() => ['Todos', ...Array.from(new Set(posts.map((post) => post.category)))], [posts]);

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesCategory = category === 'Todos' || post.category === category;
      const matchesQuery = !normalizedQuery ||
        post.title.toLowerCase().includes(normalizedQuery) ||
        post.summary.toLowerCase().includes(normalizedQuery) ||
        post.author.toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [posts, query, category]);

  const handleSubscribe = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubscribed(true);
  };

  return (
    <section className="ev-page-shell ev-blog-page">
      <div className="ev-page-hero">
        <div>
          <span className="ev-eyebrow">Blog Learnix</span>
          <h1>Ideas simples para aprender mejor y avanzar profesionalmente</h1>
          <p>Artículos cortos sobre tecnología, marketing, diseño, idiomas y productividad para estudiantes.</p>
        </div>
        <div className="ev-newsletter-mini">
          <h3>Recibe novedades</h3>
          <p>Suscríbete para recibir recursos, guías y próximos cursos.</p>
        </div>
      </div>

      <SectionHeader
        title="Últimos"
        highlight="artículos"
        description="Contenido práctico para reforzar lo aprendido dentro de la plataforma."
      />

      <div className="ev-blog-toolbar">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar artículos..." />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>

      <div className="ev-blog-grid">
        {filteredPosts.map((post) => (
          <article className="ev-blog-card" key={post.id}>
            <div className="ev-blog-icon">{post.icon}</div>
            <span className="ev-blog-category">{post.category}</span>
            <h3>{post.title}</h3>
            <p>{post.summary}</p>
            <div className="ev-blog-meta">
              <span>{post.author}</span>
              <span>{post.date}</span>
              <span>{post.readTime}</span>
            </div>
            <button className="ev-small-primary-btn" type="button">Leer artículo</button>
          </article>
        ))}
      </div>

      <div className="ev-two-column-section">
        <article className="ev-section-card">
          <span className="ev-eyebrow">Newsletter</span>
          <h2>Formulario de suscripción</h2>
          <p>Sirve para captar usuarios interesados en cursos, recursos y novedades de la plataforma.</p>
          <form className="ev-form" onSubmit={handleSubscribe}>
            <div className="ev-form-grid">
              <label>Nombre<input required placeholder="Tu nombre" /></label>
              <label>Correo<input required type="email" placeholder="correo@ejemplo.com" /></label>
              <label>Interés principal
                <select defaultValue="">
                  <option value="" disabled>Selecciona un interés</option>
                  <option>Tecnología</option>
                  <option>Marketing</option>
                  <option>Diseño</option>
                  <option>Idiomas</option>
                </select>
              </label>
              <label>Frecuencia
                <select defaultValue="semanal">
                  <option value="semanal">Semanal</option>
                  <option value="quincenal">Quincenal</option>
                  <option value="mensual">Mensual</option>
                </select>
              </label>
            </div>
            <button className="ev-small-primary-btn" type="submit">Suscribirme</button>
            {subscribed && <p className="ev-success-message">Suscripción simulada registrada.</p>}
          </form>
        </article>
        <article className="ev-section-card">
          <span className="ev-eyebrow">Apartados</span>
          <h2>Secciones sugeridas del blog</h2>
          <ul className="ev-clean-list">
            <li>Guías para elegir cursos.</li>
            <li>Consejos para entrevistas y portafolios.</li>
            <li>Casos de éxito de estudiantes.</li>
            <li>Recursos descargables y plantillas.</li>
          </ul>
        </article>
      </div>
    </section>
  );
}
