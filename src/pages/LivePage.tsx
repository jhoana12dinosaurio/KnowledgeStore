import { useState, type FormEvent } from 'react';
import type { LiveSession } from '../types';
import { SectionHeader } from '../components/SectionHeader';

interface LivePageProps {
  sessions: LiveSession[];
}

export function LivePage({ sessions }: LivePageProps) {
  const [selectedSession, setSelectedSession] = useState<LiveSession | null>(null);
  const [sent, setSent] = useState(false);

  const handleReserve = (session: LiveSession) => {
    setSelectedSession(session);
    setSent(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <section className="ev-page-shell ev-live-page">
      <div className="ev-page-hero ev-live-hero">
        <div>
          <span className="ev-eyebrow">Clases en vivo</span>
          <h1>Aprende con instructores en sesiones prácticas</h1>
          <p>Reserva tu lugar en workshops, mentorías y clases abiertas para resolver dudas en tiempo real.</p>
        </div>
        <div className="ev-live-counter">
          <strong>{sessions.length}</strong>
          <span>sesiones próximas</span>
        </div>
      </div>

      <SectionHeader
        title="Próximas"
        highlight="sesiones"
        description="Elige una clase y aparta tu espacio. Los cupos son limitados."
      />

      <div className="ev-live-list">
        {sessions.map((session) => (
          <article className="ev-live-card" key={session.id}>
            <div className="ev-live-icon">{session.icon}</div>
            <div className="ev-live-content">
              <span>{session.topic} · {session.level}</span>
              <h3>{session.title}</h3>
              <p>Con {session.instructor}</p>
            </div>
            <div className="ev-live-date">
              <strong>{session.date}</strong>
              <span>{session.time}</span>
            </div>
            <div className="ev-live-seats">{session.seats} cupos</div>
            <button className="ev-small-primary-btn" onClick={() => handleReserve(session)} type="button">Reservar</button>
          </article>
        ))}
      </div>

      <div className="ev-two-column-section">
        <article className="ev-section-card">
          <span className="ev-eyebrow">Agenda</span>
          <h2>Estructura de una sesión</h2>
          <ul className="ev-timeline-list">
            <li><strong>Bienvenida:</strong> presentación del instructor y objetivos.</li>
            <li><strong>Demostración:</strong> desarrollo de un ejercicio práctico.</li>
            <li><strong>Preguntas:</strong> resolución de dudas en vivo.</li>
            <li><strong>Reto:</strong> actividad corta para aplicar lo aprendido.</li>
          </ul>
        </article>
        <article className="ev-section-card">
          <span className="ev-eyebrow">Formulario rápido</span>
          <h2>Reserva directa</h2>
          <form className="ev-form" onSubmit={handleSubmit}>
            <label>Nombre completo<input required placeholder="Nombre y apellido" /></label>
            <label>Correo<input required type="email" placeholder="correo@ejemplo.com" /></label>
            <label>Sesión
              <select value={selectedSession?.id ?? ''} onChange={(e) => setSelectedSession(sessions.find((session) => session.id === Number(e.target.value)) ?? null)} required>
                <option value="" disabled>Selecciona una sesión</option>
                {sessions.map((session) => <option key={session.id} value={session.id}>{session.title}</option>)}
              </select>
            </label>
            <label>Nivel de experiencia
              <select defaultValue="principiante">
                <option value="principiante">Principiante</option>
                <option value="intermedio">Intermedio</option>
                <option value="avanzado">Avanzado</option>
              </select>
            </label>
            <button className="ev-small-primary-btn" type="submit">Confirmar reserva</button>
            {sent && <p className="ev-success-message">Reserva simulada registrada correctamente.</p>}
          </form>
        </article>
      </div>
    </section>
  );
}
