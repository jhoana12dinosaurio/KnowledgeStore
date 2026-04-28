import { useState, type FormEvent } from 'react';
import type { Membership } from '../types';
import { MembershipCard } from '../components/MembershipCard';
import { SectionHeader } from '../components/SectionHeader';
import { platformFaqs } from '../data/siteData';

interface PricingPageProps {
  memberships: Membership[];
  onPlanAction: (planId: string) => void;
}

export function PricingPage({ memberships, onPlanAction }: PricingPageProps) {
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [sent, setSent] = useState(false);

  const handlePlanAction = (planId: string) => {
    setSelectedPlan(planId);
    onPlanAction(planId);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <section className="ev-page-shell ev-pricing-page">
      <div className="ev-page-hero">
        <div>
          <span className="ev-eyebrow">Planes de aprendizaje</span>
          <h1>Escoge el plan que se adapte a tu meta</h1>
          <p>Desde cursos gratuitos hasta soluciones para empresas con seguimiento y rutas personalizadas.</p>
        </div>
      </div>

      <SectionHeader
        title="Elige tu"
        highlight="plan"
        description="Comparación clara de beneficios para estudiantes, profesionales y equipos."
      />

      <div className="ev-membership-cards ev-pricing-cards">
        {memberships.map((membership) => (
          <MembershipCard key={membership.id} membership={membership} onAction={handlePlanAction} />
        ))}
      </div>

      <div className="ev-section-card ev-table-card">
        <span className="ev-eyebrow">Comparación</span>
        <h2>Tabla de beneficios por plan</h2>
        <div className="ev-responsive-table">
          <table>
            <thead>
              <tr>
                <th>Beneficio</th>
                <th>Básico</th>
                <th>Pro</th>
                <th>Empresas</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Cursos gratuitos</td><td>Sí</td><td>Sí</td><td>Sí</td></tr>
              <tr><td>Cursos premium</td><td>No</td><td>Sí</td><td>Sí</td></tr>
              <tr><td>Certificado verificado</td><td>Básico</td><td>Sí</td><td>Sí</td></tr>
              <tr><td>Mentoría</td><td>No</td><td>Grupal</td><td>Personalizada</td></tr>
              <tr><td>Reportes de avance</td><td>No</td><td>Personal</td><td>Equipo completo</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="ev-two-column-section">
        <article className="ev-section-card">
          <span className="ev-eyebrow">Solicitud de plan</span>
          <h2>Formulario de contratación</h2>
          <p>Este formulario deja preparada la parte de conversión para usuarios interesados en pagar o solicitar información.</p>
          <form className="ev-form" onSubmit={handleSubmit}>
            <div className="ev-form-grid">
              <label>Nombre completo<input required placeholder="Nombre y apellido" /></label>
              <label>Correo<input required type="email" placeholder="correo@ejemplo.com" /></label>
              <label>Plan
                <select value={selectedPlan} onChange={(e) => setSelectedPlan(e.target.value)}>
                  {memberships.map((membership) => <option key={membership.id} value={membership.id}>{membership.name}</option>)}
                </select>
              </label>
              <label>Tipo de usuario
                <select defaultValue="estudiante">
                  <option value="estudiante">Estudiante</option>
                  <option value="profesional">Profesional</option>
                  <option value="empresa">Empresa</option>
                </select>
              </label>
            </div>
            <label>Comentario<textarea rows={4} placeholder="Indica tus dudas sobre el plan o la forma de pago." /></label>
            <button className="ev-small-primary-btn" type="submit">Enviar solicitud</button>
            {sent && <p className="ev-success-message">Solicitud de plan enviada de forma simulada.</p>}
          </form>
        </article>
        <article className="ev-section-card">
          <span className="ev-eyebrow">Pagos</span>
          <h2>Campos necesarios para una integración real</h2>
          <ul className="ev-clean-list">
            <li>Datos del usuario y plan seleccionado.</li>
            <li>Método de pago o pasarela externa.</li>
            <li>Comprobante o código de operación.</li>
            <li>Estado de suscripción y fecha de vencimiento.</li>
          </ul>
        </article>
      </div>

      <div className="ev-faq-grid">
        {platformFaqs.map((faq) => (
          <article key={faq.question}>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
