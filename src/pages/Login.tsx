import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authService";
import "../Auth.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const data = await loginUser(email, password);

    // 1. Validamos de forma segura que 'data' exista antes de leer sus propiedades
    if (data && data.token) {
      localStorage.setItem("token", data.token);
      
      if (data.user && data.user.name) {
        localStorage.setItem("userName", data.user.name);
      }

      // 2. Cambiado de "/home" a "/" para que te mande a la página principal real de tu app
      navigate("/"); 
    

    } else {
      // Si data existe pero no hay token, muestra el error. Si data es null, usa el texto por defecto.
      alert(data?.error || "Credenciales inválidas");
    }
  } catch (error) {
    // 3. Capturamos cualquier colapso de red o del backend para que la pantalla NUNCA se quede en negro
    console.error("Error crítico en el login:", error);
    alert("Hubo un problema de conexión con el servidor.");
  }
};

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Bienvenido</h1>
        <p className="auth-subtitle">Inicia sesión para continuar</p>

        <form onSubmit={handleLogin} className="auth-form">
          <input
            className="auth-input"
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="auth-input"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="auth-button" type="submit">
            Ingresar
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