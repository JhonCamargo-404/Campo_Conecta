import React, { useState, useContext } from "react";
import "./Login.css";
import { FaUser, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {jwtDecode} from "jwt-decode";
import ValidationComponent from "./Validation_Component/ValidationComponent"; // Asegúrate de ajustar la ruta según tu estructura de proyecto

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const { setUser } = useContext(AuthContext);
  const [validationMessage, setValidationMessage] = useState("");
  const [showValidation, setShowValidation] = useState(false);

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    const isValidEmail = /\S+@\S+\.\S+/.test(value);
    setErrors({ ...errors, email: isValidEmail ? "" : "Correo electrónico no válido" });
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setErrors({ ...errors, password: "" });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (errors.email) {
      setValidationMessage("Por favor, corrija los errores en el formulario.");
      setShowValidation(true);
      return;
    }
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
        setValidationMessage("Login successful!");
        setShowValidation(true);
        if (decoded.rol === 'A') {
          navigate("/HomeAdmin", { state: { isLoggedIn: true } });
        } else if (decoded.rol === 'U') {
          navigate("/home", { state: { isLoggedIn: true } });
        }
      } else {
        const data = await response.json();
        setValidationMessage(`Error: ${data.message || "Login failed"}`);
        setShowValidation(true);
      }
    } catch (error) {
      setValidationMessage(`Error: ${error.message}`);
      setShowValidation(true);
    }
  };

  const handleCloseValidation = () => {
    setShowValidation(false);
    setValidationMessage("");
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
              onChange={handleEmailChange}
              required
            />
            <FaUser className="icon" />
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={handlePasswordChange}
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
      {showValidation && (
        <ValidationComponent
          message={validationMessage}
          onClose={handleCloseValidation}
        />
      )}
    </div>
  );
};

export default Login;
