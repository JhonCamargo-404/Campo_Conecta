import React, { useState } from "react";
import "./NewPassword.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const NewPassword = () => {
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleNewPasswordChange = (event) => {
        setNewPassword(event.target.value);
    };

    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (newPassword !== confirmPassword) {
            alert("Las contraseñas no coinciden");
            return;
        }

        try {
            const response = await axios.post("http://localhost:8000/reset-password/", {
                email: email,
                new_password: newPassword
            });

            if (response.status === 200) {
                alert("Contraseña actualizada correctamente");
                navigate("/home");
            }
        } catch (error) {
            console.error("Error al actualizar la contraseña:", error);
            alert("Error al actualizar la contraseña");
        }
    };

    return (
        <div className="new-password">
            <div className="wraper-new-password">
                <form onSubmit={handleSubmit}>
                    <div className="main-new">
                        <div className="new-password-image"></div>
                        <div className="info-new">
                            <div className="new-password-title">
                                <h1>Nueva Contraseña</h1>
                            </div>
                            <div className="input-email">
                                <input
                                    type="email"
                                    placeholder="Ingrese su correo electrónico"
                                    value={email}
                                    onChange={handleEmailChange}
                                    required
                                />
                            </div>
                            <div className="input-new-password">
                                <input
                                    type="password"
                                    placeholder="Ingrese Nueva Contraseña"
                                    value={newPassword}
                                    onChange={handleNewPasswordChange}
                                    required
                                />
                            </div>
                            <div className="confirm-new-password">
                                <input
                                    type="password"
                                    placeholder="Confirmar Nueva Contraseña"
                                    value={confirmPassword}
                                    onChange={handleConfirmPasswordChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div className="new-password-buttons">
                        <button className="new-password-button" type="submit">
                            Enviar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewPassword;
