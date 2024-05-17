import React, { useState } from "react";
import "./Login.css";
import { FaUser, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
        localStorage.setItem("token", data.access_token);
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
              placeholder="Constraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <FaLock className="icon" />
          </div>
          <div className="remember-forgot">
            <label>
              <input type="checkbox" />
              Recordar datos{" "}
            </label>
            <a href="#"> ¿Olvidaste la contraseña?</a>
          </div>
          <button type="submit">Entrar</button>
          <div className="register-link">
            <p>
              ¿No tienes una cuenta?
              <a href="../Register"> ¡Registrate!</a>
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
