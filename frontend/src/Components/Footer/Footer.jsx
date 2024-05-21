import React from "react";
import "./Footer.css";
import image1 from "../../Assets/f1.png";
import image2 from "../../Assets/f2.png";
import image3 from "../../Assets/f3.png";
import image4 from "../../Assets/f4.png";

const Footer = () => {
  return (
    <footer>
      <div className="footer-column">
        <div
          className="footer-icon"
          style={{ backgroundImage: `url(${image1})` }}
        ></div>
        <p className="footer-text">Elige la ubicación de tu oferta.</p>
      </div>
      <div className="footer-column">
        <div 
          className="footer-icon"
          style={{ backgroundImage: `url(${image2})` }}
        ></div>
        <p className="footer-text">Completa tu perfil para destacar ante otros postulantes.</p>
      </div>
      <div className="footer-column">
        <div 
          className="footer-icon"
          style={{backgroundImage: `url(${image3})` }}
        ></div>
        <p className="footer-text">Postúlate a los anuncios que sean aptos para tu perfil.</p>
      </div>
      <div className="footer-column">
        <div 
          className="footer-icon"
          style={{backgroundImage: `url(${image4})` }}
        ></div>
        <p className="footer-text">Puedes elegir ofertas que te dan hospedaje.</p>
      </div>
    </footer>
  );
};

export default Footer;
