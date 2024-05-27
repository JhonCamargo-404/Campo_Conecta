import React from "react";
import "./ApplicationConfirmed.css";
import { Link } from "react-router-dom";

const ConfirmOffer = () => {
  return (
    <>
      <div className="contariner-ApplicationConfirmed">
        <div className="wrapper-confirmAplication">
          <from action="">
            <h1 className="titulo">¡ Solicitud enviada con éxito !</h1>

            <div className="confirm-text">
              <div className="imagen-confirm-text"></div>
              <div className="confirmation-message">
                <h1>
                  El host estará en contacto en el caso de seleccionarlo.
                  <p className="paragraph-1">¡Gracias por apoyar el campo colombiano!</p>
                  <p className="paragraph-2">Recuerda postularte a mas ofertas para tener mayor posibilidad de ser seleccionado</p>
                </h1>
              </div>
            </div>
            <div className="return-home-button">
              <button className="return-home" type="submit">
                <Link to="/Home">Volver al inicio</Link>
              </button>
            </div>
          </from>
        </div>
      </div>
    </>
  );
};

export default ConfirmOffer;
