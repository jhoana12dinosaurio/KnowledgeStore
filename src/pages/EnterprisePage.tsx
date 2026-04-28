import { useState, type FormEvent } from 'react';
import type { EnterpriseSolution, RelatedCompany } from '../types';
import { SectionHeader } from '../components/SectionHeader';

interface EnterprisePageProps {
  solutions: EnterpriseSolution[];
  companies: RelatedCompany[];
  onBackHome: () => void;
  onViewCourses: () => void;
}

export function EnterprisePage({ solutions, companies, onBackHome, onViewCourses }: EnterprisePageProps) {
  const [sent, setSent] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <section className="ev-enterprise-page ev-page-shell">
      <div className="ev-page-hero ev-enterprise-hero">
        <div>
          <span className="ev-eyebrow">Learnix para empresas</span>
          <h1>Capacitación digital para equipos que necesitan crecer rápido</h1>
          <p>
            Organiza rutas de aprendizaje, mide avances y brinda cursos especializados a tus colaboradores desde una sola plataforma.
          </p>
          <div className="ev-enterprise-actions ev-enterprise-actions-top">
            <button className="ev-cta-btn" onClick={onViewCourses} type="button">Explorar rutas</button>
            <button className="ev-cta-btn ev-cta-secondary" onClick={onBackHome} type="button">Volver al inicio</button>
          </div>
        </div>
        <div className="ev-enterprise-panel">
          <div className="ev-panel-header"><span></span><span></span><span></span></div>
          <h3>Panel corporativo</h3>
          <div className="ev-progress-item"><span>Frontend</span><strong>86%</strong></div>
          <div className="ev-progress-bar"><span style={{ width: '86%' }}></span></div>
          <div className="ev-progress-item"><span>Data Science</span><strong>72%</strong></div>
          <div className="ev-progress-bar"><span style={{ width: '72%' }}></span></div>
          <div className="ev-progress-item"><span>Marketing</span><strong>64%</strong></div>
          <div className="ev-progress-bar"><span style={{ width: '64%' }}></span></div>
        </div>
      </div>

      <SectionHeader
        title="Soluciones"
        highlight="corporativas"
        description="Herramientas pensadas para capacitar, medir y acompañar el crecimiento de equipos completos."
      />

      <div className="ev-enterprise-grid">
        {solutions.map((item) => (
          <article className="ev-enterprise-card" key={item.title}>
            <div className="ev-enterprise-icon">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </div>

      <div className="ev-process-grid">
        {['Diagnóstico del equipo', 'Ruta de cursos', 'Seguimiento mensual', 'Certificación final'].map((step, index) => (
          <div className="ev-process-card" key={step}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <h3>{step}</h3>
            <p>{index === 0 ? 'Identificamos brechas de habilidades.' : index === 1 ? 'Armamos un camino de aprendizaje.' : index === 2 ? 'Medimos avance con reportes claros.' : 'Entregamos evidencias de logro.'}</p>
          </div>
        ))}
      </div>

      <div className="ev-two-column-section">
        <article className="ev-section-card">
          <span className="ev-eyebrow">Solicitud corporativa</span>
          <h2>Formulario para empresas</h2>
          <p>Permite registrar empresas interesadas, cantidad de colaboradores, área de capacitación y mensaje comercial.</p>
          <form className="ev-form" onSubmit={handleSubmit}>
            <div className="ev-form-grid">
              <label>Nombre del contacto<input required placeholder="Nombre y apellido" /></label>
              <label>Correo corporativo<input required type="email" placeholder="contacto@empresa.com" /></label>
              <label>Empresa<input required placeholder="Nombre de la empresa" /></label>
              <label>Cantidad de colaboradores
                <select defaultValue="">
                  <option value="" disabled>Selecciona un rango</option>
                  <option>1 a 20</option>
                  <option>21 a 100</option>
                  <option>101 a 500</option>
                  <option>Más de 500</option>
                </select>
              </label>
              <label>Área de interés
                <select defaultValue="">
                  <option value="" disabled>Selecciona un área</option>
                  <option>Desarrollo Web</option>
                  <option>Data Science</option>
                  <option>Marketing Digital</option>
                  <option>Idiomas</option>
                  <option>Habilidades blandas</option>
                </select>
              </label>
              <label>Urgencia
                <select defaultValue="normal">
                  <option value="normal">Normal</option>
                  <option value="alta">Alta</option>
                  <option value="piloto">Deseo iniciar un piloto</option>
                </select>
              </label>
            </div>
            <label>Necesidad de capacitación<textarea rows={4} placeholder="Describe el objetivo de la empresa, perfiles y resultados esperados." /></label>
            <button className="ev-small-primary-btn" type="submit">Enviar solicitud</button>
            {sent && <p className="ev-success-message">Solicitud corporativa enviada. En una versión real, ventas recibiría este registro.</p>}
          </form>
        </article>

        <article className="ev-section-card">
          <span className="ev-eyebrow">Apartados necesarios</span>
          <h2>Qué incluye el módulo empresas</h2>
          <ul className="ev-timeline-list">
            <li><strong>Gestión de colaboradores:</strong> alta, baja y grupos por área.</li>
            <li><strong>Rutas asignadas:</strong> cursos obligatorios y recomendados.</li>
            <li><strong>Reportes:</strong> avance, asistencia, notas y certificados.</li>
            <li><strong>Soporte:</strong> contacto con asesor y seguimiento mensual.</li>
          </ul>
        </article>
      </div>

      <div className="ev-related-companies">
        <h3>Empresas relacionadas</h3>
        <div className="ev-company-cards">
          {companies.map((company) => (
            <article className="ev-company-card" key={company.name}>
              <div className="ev-company-card-header">
                <span className="ev-company-logo">{company.name.charAt(0)}</span>
                <div>
                  <h4>{company.name}</h4>
                  <span>{company.industry}</span>
                </div>
              </div>
              <p>{company.description}</p>
              <span className="ev-company-meta">{company.employees} empleados</span>
              <strong className="ev-company-result">{company.result}</strong>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
