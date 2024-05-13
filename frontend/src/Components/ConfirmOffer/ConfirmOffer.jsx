import React from "react";
import "./ConfirmOffer.css";
import { Link } from "react-router-dom";

const ConfirmOffer = () => {
  return (
    <>
      <div className="contariner-confirmOffer">
        <div className="wrapper-confirmOffer">
          <from action="">
            <h1 className="titulo">¡ Oferta creada con éxito !</h1>

            <div className="confirm-text">
              <div className="imagen-confirm-text"></div>
              <div className="sub-confirm-text">
                <h1>
                  Su oferta ahora está visible, pronto recibirá solicitudes de
                  interés.
                </h1>
              </div>
            </div>
            <div className="return-home-button">
            <button className="return-home" type="submit">
              <Link to="../Home">Volver al inicio</Link>
            </button>
            </div>
          </from>
        </div>
      </div>
    </>
  );
};

export default ConfirmOffer;
