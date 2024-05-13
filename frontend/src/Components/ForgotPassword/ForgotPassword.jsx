import React from "react";
import "./ForgotPassword.css";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
return(
    <>
        <div className="forgot-password">
            <div className="wraper-forgot-password">
                <form action="">
                    <div className="main-forgot">
                        <div className="forgot-password-image">

                        </div>
                        <div className="info-forgot">
                            <div className="forgot-password-title">
                                <h1 tag="title">Recuperar contraseña</h1>
                            </div>
                            <div className="forgot-password-description">
                                <p tag="description">Ingresa tu correo electrónico para recuperar tu contraseña</p>
                            </div>

                            <div className="forgot-password-email">
                                <input type="email" placeholder="Correo electrónico" required/>
                            </div>

                        </div>
                    </div>
                </form>
                <div className="forgot-password-buttons">
                    <Link to="../home">
                        <button className="forgot-password-button" type="submit">Enviar</button>
                    </Link>
                </div>
            </div>
        </div>
    </>
);
};
export default ForgotPassword;