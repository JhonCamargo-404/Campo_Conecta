import React from "react";
import "./NewPassword.css";
import { Link } from "react-router-dom";

const NewPassword = () => {
    return (
        <>
            <div className="new-password">
                <div className="wraper-new-password">
                    <form action="">
                        <div className="main-new">
                            <div className="new-password-image">
                                
                            </div>
                            <div className="info-new">
                                <div className="new-password-title">
                                    <h1 tag="title">Nueva Contraseña</h1>
                                </div>
                                <div className="input-new-password">
                                <input type="password" placeholder="ingrese Nueva Contraseña" required />                            
                                </div>                
                                <div className="confirm-new-password">
                                <input type="password" placeholder="Confirmar Nueva Contraseña" required />
                                </div>
                            </div>
                        </div>
                    </form>
                    <div className="new-password-buttons">
                        <Link to="../home">
                            <button className="new-password-button" type="submit">Enviar</button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};
export default NewPassword;