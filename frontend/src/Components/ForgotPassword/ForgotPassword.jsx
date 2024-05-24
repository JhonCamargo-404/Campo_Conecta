import React, { useState } from "react";
import "./ForgotPassword.css";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:8000/forgot-password/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });
        if (response.ok) {
            alert("Correo de recuperación enviado");
            navigate("/home");
        } else {
            alert("Error al enviar el correo de recuperación");
        }
    };

    return (
        <div className="forgot-password">
            <div className="wraper-forgot-password">
                <form onSubmit={handleSubmit}>
                    <div className="main-forgot">
                        <div className="forgot-password-image"></div>
                        <div className="info-forgot">
                            <div className="forgot-password-title">
                                <h1 tag="title">Recuperar contraseña</h1>
                            </div>
                            <div className="forgot-password-description">
                                <p tag="description">Ingresa tu correo electrónico para recuperar tu contraseña</p>
                            </div>
                            <div className="forgot-password-email">
                                <input 
                                    type="email" 
                                    placeholder="Correo electrónico" 
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </form>
                <div className="forgot-password-buttons">
                    <button className="forgot-password-button" type="submit" onClick={handleSubmit}>Enviar</button>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
