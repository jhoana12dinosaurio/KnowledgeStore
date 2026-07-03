import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ApiError } from '../services/api';
import { registerUser } from '../services/authService';
import '../auth.css';

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await registerUser(name, email, password);
      navigate('/', { replace: true });
    } catch (err) {
      const message = err instanceof ApiError
        ? err.message
        : 'Hubo un problema de conexión al registrar tu cuenta.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Crear Cuenta</h1>
        <p className="auth-subtitle">Regístrate para acceder a todos los cursos</p>

        <form onSubmit={handleRegister} className="auth-form">
          {error && <p className="auth-error">{error}</p>}

          <input
            className="auth-input"
            type="text"
            placeholder="Nombre completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
          />

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
            autoComplete="new-password"
            minLength={8}
            required
          />

          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? 'Creando cuenta…' : 'Registrarse'}
          </button>
        </form>

        <p className="auth-footer">
          ¿Ya tienes cuenta?
          <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
