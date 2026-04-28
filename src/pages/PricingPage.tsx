import { useMemo, useState, type FormEvent } from 'react';
import type { Membership } from '../types';
import { MembershipCard } from '../components/MembershipCard';
import { SectionHeader } from '../components/SectionHeader';
import { platformFaqs } from '../data/siteData';

interface PricingPageProps {
  memberships: Membership[];
}

type PaymentChannelId = 'card' | 'wallet' | 'transfer' | 'paypal' | 'invoice';

interface PaymentChannel {
  id: PaymentChannelId;
  icon: string;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  actionLabel: string;
  externalUrl?: string;
}

const paymentChannels: PaymentChannel[] = [
  {
    id: 'card',
    icon: '💳',
    title: 'Tarjeta de crédito o débito',
    subtitle: 'Visa, Mastercard y tarjetas nacionales',
    badge: 'Automático',
    description: 'Formulario preparado para conectar una pasarela real como Culqi, Izipay, Mercado Pago o Stripe.',
    actionLabel: 'Abrir formulario de tarjeta'
  },
  {
    id: 'wallet',
    icon: '📱',
    title: 'Yape o Plin',
    subtitle: 'Pago móvil con envío de comprobante',
    badge: 'Rápido',
    description: 'Muestra los datos del pago, un código de operación y un botón para abrir WhatsApp y enviar el comprobante.',
    actionLabel: 'Abrir pago móvil'
  },
  {
    id: 'transfer',
    icon: '🏦',
    title: 'Transferencia bancaria',
    subtitle: 'BCP, Interbank, BBVA o Banco de la Nación',
    badge: 'Manual',
    description: 'Canal pensado para pagos por depósito o transferencia, con CCI, titular y validación manual.',
    actionLabel: 'Ver datos bancarios'
  },
  {
    id: 'paypal',
    icon: '🌐',
    title: 'PayPal',
    subtitle: 'Pago internacional externo',
    badge: 'Externo',
    description: 'Botón que abre una pasarela externa en una nueva pestaña. En producción se reemplaza por un checkout real.',
    actionLabel: 'Abrir PayPal',
    externalUrl: 'https://www.paypal.com/'
  },
  {
    id: 'invoice',
    icon: '🧾',
    title: 'Factura para empresas',
    subtitle: 'Cotización, orden de compra y pago mensual',
    badge: 'Corporativo',
    description: 'Flujo para empresas que necesitan factura, varios usuarios, contrato y validación del área de administración.',
    actionLabel: 'Abrir solicitud empresarial'
  }
];

const bankData = {
  holder: 'Learnix Educación Digital S.A.C.',
  ruc: '20600000001',
  account: 'Cuenta corriente: 191-0000000-0-00',
  cci: 'CCI: 002-191-000000000000-00'
};

export function PricingPage({ memberships }: PricingPageProps) {
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [sent, setSent] = useState(false);
  const [activePayment, setActivePayment] = useState<PaymentChannelId>('card');
  const [paymentSent, setPaymentSent] = useState(false);
  const [copied, setCopied] = useState(false);

  const selectedMembership = useMemo(
    () => memberships.find((membership) => membership.id === selectedPlan) ?? memberships[0],
    [memberships, selectedPlan]
  );

  const activeChannel = paymentChannels.find((channel) => channel.id === activePayment) ?? paymentChannels[0];

  const handlePlanAction = (planId: string) => {
    setSelectedPlan(planId);
    setPaymentSent(false);
    if (planId === 'enterprise') {
      setActivePayment('invoice');
    } else {
      setActivePayment('card');
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  const handlePaymentSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPaymentSent(true);
  };

  const openPaymentChannel = (channel: PaymentChannel) => {
    setActivePayment(channel.id);
    setPaymentSent(false);
    setCopied(false);

    if (channel.externalUrl) {
      window.open(channel.externalUrl, '_blank', 'noopener,noreferrer');
    }

    if (channel.id === 'invoice') {
      setSelectedPlan('enterprise');
    }
  };

  const copyBankData = async () => {
    const text = `${bankData.holder}\n${bankData.ruc}\n${bankData.account}\n${bankData.cci}\nPlan: ${selectedMembership?.name ?? 'Pro'}\nMonto: ${selectedMembership?.price ?? '$29'} ${selectedMembership?.period ?? ''}`;

    try {
      await navigator.clipboard.writeText(text);
    } catch {
      console.info('El navegador no permitió copiar automáticamente los datos bancarios.');
    }

    setCopied(true);
  };

  const whatsappMessage = encodeURIComponent(
    `Hola, quiero confirmar mi pago en Learnix. Plan: ${selectedMembership?.name ?? 'Pro'} - Monto: ${selectedMembership?.price ?? '$29'} ${selectedMembership?.period ?? ''}. Adjuntaré mi comprobante.`
  );

  const renderPaymentContent = () => {
    if (activePayment === 'card') {
      return (
        <form className="ev-payment-form" onSubmit={handlePaymentSubmit}>
          <div className="ev-form-grid">
            <label>Nombre del titular<input required placeholder="Nombre como aparece en la tarjeta" /></label>
            <label>Número de tarjeta<input required inputMode="numeric" maxLength={19} placeholder="0000 0000 0000 0000" /></label>
            <label>Vencimiento<input required placeholder="MM/AA" /></label>
            <label>CVV<input required inputMode="numeric" maxLength={4} placeholder="123" /></label>
          </div>
          <label>Correo para comprobante<input required type="email" placeholder="correo@ejemplo.com" /></label>
          <button className="ev-small-primary-btn" type="submit">Pagar ahora de forma simulada</button>
          {paymentSent && <p className="ev-success-message">Pago con tarjeta abierto y procesado de forma simulada.</p>}
        </form>
      );
    }

    if (activePayment === 'wallet') {
      return (
        <div className="ev-wallet-layout">
          <div className="ev-qr-box">
            <span>QR</span>
            <small>Demo</small>
          </div>
          <div className="ev-payment-copy">
            <h3>Pago móvil</h3>
            <p>Escanea el QR de ejemplo o usa el número mostrado. Luego envía tu comprobante por WhatsApp.</p>
            <div className="ev-payment-data">
              <span>Número:</span><strong>999 999 999</strong>
              <span>Titular:</span><strong>Learnix Educación Digital</strong>
              <span>Código:</span><strong>LNX-{selectedMembership?.id.toUpperCase()}</strong>
            </div>
            <a className="ev-small-primary-btn ev-payment-link" href={`https://wa.me/51999999999?text=${whatsappMessage}`} target="_blank" rel="noreferrer">
              Abrir WhatsApp para enviar comprobante
            </a>
          </div>
        </div>
      );
    }

    if (activePayment === 'transfer') {
      return (
        <div className="ev-transfer-card">
          <h3>Datos para transferencia</h3>
          <p>Usa estos datos de prueba para representar el flujo de pago manual dentro de la maqueta.</p>
          <div className="ev-payment-data">
            <span>Titular:</span><strong>{bankData.holder}</strong>
            <span>RUC:</span><strong>{bankData.ruc}</strong>
            <span>Cuenta:</span><strong>{bankData.account}</strong>
            <span>CCI:</span><strong>{bankData.cci}</strong>
          </div>
          <button className="ev-small-primary-btn" type="button" onClick={copyBankData}>Copiar datos bancarios</button>
          {copied && <p className="ev-success-message">Datos copiados o listos para copiar manualmente.</p>}
        </div>
      );
    }

    if (activePayment === 'paypal') {
      return (
        <div className="ev-transfer-card">
          <h3>Pago externo con PayPal</h3>
          <p>Se abrió PayPal en una nueva pestaña. En una integración real, este botón enviaría el plan, monto y datos del usuario al checkout.</p>
          <a className="ev-small-primary-btn ev-payment-link" href="https://www.paypal.com/" target="_blank" rel="noreferrer">Abrir PayPal nuevamente</a>
        </div>
      );
    }

    return (
      <form className="ev-payment-form" onSubmit={handlePaymentSubmit}>
        <div className="ev-form-grid">
          <label>Empresa<input required placeholder="Nombre de la empresa" /></label>
          <label>RUC<input required placeholder="RUC de la empresa" /></label>
          <label>Contacto<input required placeholder="Nombre del responsable" /></label>
          <label>Correo corporativo<input required type="email" placeholder="empresa@correo.com" /></label>
          <label>Número de usuarios<input required type="number" min="1" placeholder="25" /></label>
          <label>Modalidad de pago
            <select defaultValue="factura">
              <option value="factura">Factura mensual</option>
              <option value="oc">Orden de compra</option>
              <option value="anual">Contrato anual</option>
            </select>
          </label>
        </div>
        <label>Detalle<textarea rows={4} placeholder="Indica los cursos, cantidad de estudiantes y datos de facturación." /></label>
        <button className="ev-small-primary-btn" type="submit">Enviar solicitud empresarial</button>
        {paymentSent && <p className="ev-success-message">Solicitud empresarial enviada de forma simulada.</p>}
      </form>
    );
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

      <div className="ev-section-card ev-payment-section">
        <div className="ev-payment-heading">
          <div>
            <span className="ev-eyebrow">Canales de pago</span>
            <h2>Selecciona un canal y ábrelo desde la web</h2>
            <p>Los canales funcionan como maqueta interactiva: algunos abren un panel interno y otros una pestaña externa.</p>
          </div>
          <div className="ev-selected-plan-box">
            <span>Plan seleccionado</span>
            <strong>{selectedMembership?.name}</strong>
            <small>{selectedMembership?.price} {selectedMembership?.period}</small>
          </div>
        </div>

        <div className="ev-payment-grid">
          {paymentChannels.map((channel) => (
            <button
              key={channel.id}
              type="button"
              className={`ev-payment-channel ${activePayment === channel.id ? 'active' : ''}`}
              onClick={() => openPaymentChannel(channel)}
            >
              <span className="ev-payment-icon">{channel.icon}</span>
              <span className="ev-payment-info">
                <strong>{channel.title}</strong>
                <small>{channel.subtitle}</small>
              </span>
              <em>{channel.badge}</em>
            </button>
          ))}
        </div>

        <div className="ev-payment-panel">
          <div className="ev-payment-panel-header">
            <div>
              <span>{activeChannel.icon}</span>
              <div>
                <h3>{activeChannel.title}</h3>
                <p>{activeChannel.description}</p>
              </div>
            </div>
            <button className="ev-ghost-action" type="button" onClick={() => openPaymentChannel(activeChannel)}>{activeChannel.actionLabel}</button>
          </div>
          {renderPaymentContent()}
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
              <label>Teléfono<input required type="tel" placeholder="+51 999 999 999" /></label>
              <label>Plan
                <select value={selectedPlan} onChange={(e) => setSelectedPlan(e.target.value)}>
                  {memberships.map((membership) => <option key={membership.id} value={membership.id}>{membership.name}</option>)}
                </select>
              </label>
              <label>Canal de pago preferido
                <select value={activePayment} onChange={(e) => setActivePayment(e.target.value as PaymentChannelId)}>
                  {paymentChannels.map((channel) => <option key={channel.id} value={channel.id}>{channel.title}</option>)}
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
          <span className="ev-eyebrow">Integración real</span>
          <h2>Campos necesarios para pagos reales</h2>
          <ul className="ev-clean-list">
            <li>Datos del usuario, plan seleccionado y monto.</li>
            <li>Pasarela de pago o canal externo configurado.</li>
            <li>Comprobante, código de operación o ID de transacción.</li>
            <li>Validación de estado: pendiente, pagado, rechazado o vencido.</li>
            <li>Fecha de inicio y vencimiento de la suscripción.</li>
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
