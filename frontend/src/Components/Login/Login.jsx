import React, { useState, useContext } from "react";
import "./Login.css";
import { FaUser, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem("token", data.access_token);
        localStorage.setItem("token", data.access_token);    
        const decoded = jwtDecode(data.access_token);
        setUser(decoded);
        navigate("/home", { state: { isLoggedIn: true } });
      } else {
        const data = await response.json();
        alert(data.detail);
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <div className="container-login">
      <div className="wrapper-login">
        <form onSubmit={handleLogin}>
          <h1>Iniciar Sesión</h1>
          <div className="input-box">
            <input
              type="text"
              placeholder="Usuario"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <FaUser className="icon" />
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <FaLock className="icon" />
          </div>
          <div className="remember-forgot">
            <label>
              <input type="checkbox" />
              Recordar datos
            </label>
            <Link to="/ForgotPassword">¿Olvidaste la contraseña?</Link>
          </div>
          <button type="submit">Entrar</button>
          <div className="register-link">
            <p>
              ¿No tienes una cuenta?
              <Link to="/Register">¡Regístrate!</Link>
            </p>
          </div>
        </form>
      </div>
      <div className="image-wrapper-login">
        <div className="image-login"></div>
      </div>
    </div>
  );
};

export default Login;
