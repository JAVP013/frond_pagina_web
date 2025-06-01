// src/pages/admimlog.tsx
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import "../styles/adminlog.css";

const AdminLogin: React.FC = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/admin/login", { userId, password });
      // Aquí espera que el backend retorne { success: true } o el token.
      if (response.data.success || response.data.token) {
        login();
        setError("");
      } else {
        setError("Credenciales incorrectas o usuario no encontrado");
      }
    } catch (err: any) {
      console.error(err);
      setError("Error de servidor o de red");
    }
  };

  return (
    <div className="admin-login-background">
      <div className="admin-login-container">
        <div className="login-box">
          <h2>Admin Login</h2>
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <input
                type="text"
                placeholder="ID usuario"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="btn-gradient">
              Ingresar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
