import React, { useState } from "react";
import "./Register.css";
import ValidationComponent from "./Validation_Component/ValidationComponent";
import "./Validation_Component/ValidationComponent.css";
import { Link } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    repeat_password: "",
    age: ""
  });

  const [errors, setErrors] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    repeat_password: "",
    age: ""
  });

  const [message, setMessage] = useState("");
  const [showValidation, setShowValidation] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "age") {
      const ageValue = value.replace(/\D/g, "");
      setFormData({ ...formData, age: ageValue });
      setErrors({
        ...errors,
        age: ageValue && (parseInt(ageValue) < 18) ? "Debes ser mayor de 18 años" : ""
      });
    } else {
      setFormData({ ...formData, [name]: value });
      if (name === "email") {
        const isValidEmail = /\S+@\S+\.\S+/.test(value);
        setErrors({ ...errors, email: isValidEmail ? "" : "Correo electrónico no válido" });
      } else if (name === "repeat_password") {
        setErrors({ ...errors, repeat_password: value === formData.password ? "" : "Las contraseñas no coinciden" });
      } else {
        setErrors({ ...errors, [name]: "" });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isFormValid()) {
      try {
        const response = await axios.post("http://localhost:8000/register/", formData);
        setMessage(response.data.message);
        setShowValidation(true);
        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          password: "",
          repeat_password: "",
          age: ""
        });
      } catch (error) {
        if (error.response && error.response.data.detail) {
          setMessage(`Error al registrar usuario: ${error.response.data.detail}`);
        } else {
          console.error("Error al registrar usuario:", error);
          setMessage("Error al registrar usuario. Por favor, inténtelo de nuevo.");
        }
        setShowValidation(true);
      }
    } else {
      console.error("El formulario contiene errores de validación.");
    }
  };

  const isFormValid = () => {
    return Object.values(errors).every(error => error === "") && formData.age !== "";
  };

  const closeValidation = () => {
    setShowValidation(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className="container-register">
        <div className="wrapper-register">
          <form onSubmit={handleSubmit}>
            <h1>Registro</h1>
            <div className="input-box">
              <input type="text" name="first_name" placeholder="Nombre" value={formData.first_name} onChange={handleChange} required />
              {errors.first_name && <p className="error-message">{errors.first_name}</p>}
            </div>
            <div className="input-box">
              <input type="text" name="last_name" placeholder="Apellido" value={formData.last_name} onChange={handleChange} required />
              {errors.last_name && <p className="error-message">{errors.last_name}</p>}
            </div>
            <div className="input-box">
              <input type="email" name="email" placeholder="Correo" value={formData.email} onChange={handleChange} required />
              {errors.email && <p className="error-message">{errors.email}</p>}
            </div>
            <div className="input-box">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span className="password-toggle" onClick={togglePasswordVisibility}>
                {showPassword ? (
                  <span className="lets-icons--eye"></span>
                ) : (
                  <span className="lets-icons--hide-eye"></span>
                )}
              </span>
              {errors.password && <p className="error-message">{errors.password}</p>}
            </div>
            <div className="input-box">
              <input type="password" name="repeat_password" placeholder="Repetir contraseña" value={formData.repeat_password} onChange={handleChange} required />
               <span className="password-toggle" onClick={togglePasswordVisibility}>
                {showPassword ? (
                  <span className="lets-icons--eye"></span>
                ) : (
                  <span className="lets-icons--hide-eye"></span>
                )}
              </span>
              {errors.repeat_password && <p className="error-message">{errors.repeat_password}</p>}
            </div>
            <div className="input-box">
              <input type="text" name="age" placeholder="Edad" value={formData.age} onChange={handleChange} required />
              {errors.age && <p className="error-message">{errors.age}</p>}
            </div>
            <button type="submit">
              <p>Registrarse</p>
            </button>
            {showValidation && <ValidationComponent message={message} onClose={closeValidation} />}
            <div className="register-link">
              <p>
                ¿Ya tienes una cuenta?
                <Link to="../Login"> ¡Inicia Sesión!</Link>
              </p>
            </div>
          </form>
        </div>
        <div className="image-wrapper-register">
          <div className="image-register"></div>
        </div>
      </div>
    </>
  );
};

export default Register;
