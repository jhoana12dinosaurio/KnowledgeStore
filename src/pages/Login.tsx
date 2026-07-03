import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ApiError } from '../services/api';
import { loginUser } from '../services/authService';
import '../auth.css';

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginUser(email, password);
      navigate('/', { replace: true });
    } catch (err) {
      const message = err instanceof ApiError
        ? err.message
        : 'Hubo un problema de conexión con el servidor.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Bienvenido</h1>
        <p className="auth-subtitle">Inicia sesión para continuar</p>

        <form onSubmit={handleLogin} className="auth-form">
          {error && <p className="auth-error">{error}</p>}

          <input
            className="auth-input"
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />

          <input
            className="auth-input"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />

          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>

        <p className="auth-footer">
          ¿No tienes cuenta?
          <Link to="/register">Regístrate</Link>
        </p>
      </div>
    </div>
  );
}
