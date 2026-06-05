import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/authService";
import "../Auth.css";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await registerUser(name, email, password);

      // 1. Validamos de forma segura que 'data' exista y traiga el token
      if (data && data.token) {
        localStorage.setItem("token", data.token);
        
        if (data.user && data.user.name) {
          localStorage.setItem("userName", data.user.name);
        }

        alert(data.message || "¡Registro exitoso! Bienvenido a Learnix.");
        
        // 2. Corregido: Te redirige a la raíz "/" para cargar tu Home.tsx real
        navigate("/");

        // 3. Forzamos el refresco para que el Navbar detecte que ya iniciaste sesión
        window.location.reload();
        
      } else {
        // Evitamos que explote si data es null usando el encadenamiento opcional (?.)
        alert(data?.error || "Error al registrarse");
      }
    } catch (error) {
      // Capturamos cualquier error de red o backend para evitar pantallas en negro
      console.error("Error crítico en el registro:", error);
      alert("Hubo un problema de conexión al registrar tu cuenta.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Crear Cuenta</h1>
        <p className="auth-subtitle">Regístrate para acceder a todos los cursos</p>

        <form onSubmit={handleRegister} className="auth-form">
          <input
            className="auth-input"
            type="text"
            placeholder="Nombre completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

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
            Registrarse
          </button>
        </form>

        <p className="auth-footer">
          ¿Ya tienes cuenta? 
          {/* Corregido también el link de abajo para que vaya al Login */}
          <Link to="/login"> Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}