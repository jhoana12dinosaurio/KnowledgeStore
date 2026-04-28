import { useState, type FormEvent } from 'react';

interface LoginPageProps {
  onBackHome: () => void;
}

type AuthMode = 'login' | 'register' | 'recover';

export function LoginPage({ onBackHome }: LoginPageProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [sent, setSent] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  const changeMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setSent(false);
  };

  return (
    <section className="ev-page-shell ev-login-page">
      <div className="ev-login-card ev-auth-card">
        <span className="ev-eyebrow">Acceso Learnix</span>
        <h1>{mode === 'login' ? 'Iniciar sesión' : mode === 'register' ? 'Crear cuenta' : 'Recuperar contraseña'}</h1>
        <p>
          {mode === 'login'
            ? 'Ingresa tus datos para continuar aprendiendo. Esta pantalla está lista para conectarse a un backend.'
            : mode === 'register'
              ? 'Registra una cuenta nueva para simular el alta de estudiantes dentro de la plataforma.'
              : 'Coloca tu correo para simular el envío de un enlace de recuperación.'}
        </p>

        <div className="ev-auth-tabs">
          <button className={mode === 'login' ? 'active' : ''} onClick={() => changeMode('login')} type="button">Ingresar</button>
          <button className={mode === 'register' ? 'active' : ''} onClick={() => changeMode('register')} type="button">Registro</button>
          <button className={mode === 'recover' ? 'active' : ''} onClick={() => changeMode('recover')} type="button">Recuperar</button>
        </div>

        {mode === 'login' && (
          <form className="ev-login-form ev-form" onSubmit={handleSubmit}>
            <label>Correo electrónico<input required type="email" placeholder="tu-correo@ejemplo.com" /></label>
            <label>Contraseña<input required type="password" placeholder="********" /></label>
            <div className="ev-form-row-between">
              <label className="ev-check-label"><input type="checkbox" /> Recordarme</label>
              <button className="ev-text-btn" type="button" onClick={() => changeMode('recover')}>Olvidé mi contraseña</button>
            </div>
            <button className="ev-cta-btn" type="submit">Entrar</button>
            {sent && <p className="ev-success-message">Ingreso simulado correctamente.</p>}
          </form>
        )}

        {mode === 'register' && (
          <form className="ev-login-form ev-form" onSubmit={handleSubmit}>
            <div className="ev-form-grid">
              <label>Nombre completo<input required placeholder="Nombre y apellido" /></label>
              <label>Correo electrónico<input required type="email" placeholder="tu-correo@ejemplo.com" /></label>
              <label>Contraseña<input required type="password" placeholder="Crea una contraseña" /></label>
              <label>Perfil
                <select defaultValue="estudiante">
                  <option value="estudiante">Estudiante</option>
                  <option value="profesional">Profesional</option>
                  <option value="empresa">Empresa</option>
                </select>
              </label>
            </div>
            <label className="ev-check-label"><input required type="checkbox" /> Acepto términos y condiciones</label>
            <button className="ev-cta-btn" type="submit">Crear cuenta</button>
            {sent && <p className="ev-success-message">Cuenta simulada creada correctamente.</p>}
          </form>
        )}

        {mode === 'recover' && (
          <form className="ev-login-form ev-form" onSubmit={handleSubmit}>
            <label>Correo registrado<input required type="email" placeholder="tu-correo@ejemplo.com" /></label>
            <button className="ev-cta-btn" type="submit">Enviar enlace</button>
            {sent && <p className="ev-success-message">Solicitud de recuperación simulada enviada.</p>}
          </form>
        )}

        <div className="ev-auth-note">
          <h3>Formularios necesarios incluidos</h3>
          <p>Login, registro, recuperación de contraseña, aceptación de términos y selección de perfil.</p>
        </div>

        <button className="ev-link-button" onClick={onBackHome} type="button">Volver al inicio</button>
      </div>
    </section>
  );
}
