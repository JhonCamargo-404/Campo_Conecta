import React from "react";
import "./Login.css";
import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";

const Login = () => {
  return (
    <>
      <div className="container-login">
        <div className="wrapper-login">
          <from action="">
            <h1>Iniciar Sesión</h1>
            <div className="input-box">
              <input type="text" placeholder="Usuario" required />
              <FaUser className="icon" />
            </div>
            <div className="input-box">
              <input type="password" placeholder="Constraseña" required />
              <FaLock className="icon" />
            </div>
            <div className="remeber-forgot">
              <label>
                <input type="checkbox" />
                Recordar datos{" "}
              </label>
              <a href="#"> ¿Olvidaste la contraseña?</a>
            </div>
            <Link to="../Home">
              <button type="button">
                Entrar
              </button>
            </Link>
            <div className="register-link">
              <p>
                ¿No tienes una cuenta?
                <Link to="../Register"> ¡Registrate!</Link>
              </p>
            </div>
          </from>
        </div>
        <div className="image-wrapper-login">
          <div className="image-login"></div>
        </div>
      </div>
    </>
  );
};

export default Login;
