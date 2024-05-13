import React from "react";
import "./Footer.css";

const Footer = () => {
    return (
      <footer>
        <div className="footer-column">
          <div className="footer-icon">
            {/* Icono o imagen */}
          </div>
          <p className="footer-text">Lorem ipsum dolor sit amet.</p>
        </div>
        <div className="footer-column">
          <div className="footer-icon">
            {/* Icono o imagen */}
          </div>
          <p className="footer-text">Lorem ipsum dolor sit amet.</p>
        </div>
        <div className="footer-column">
          <div className="footer-icon">
            {/* Icono o imagen */}
          </div>
          <p className="footer-text">Lorem ipsum dolor sit amet.</p>
        </div>
        {/* Repite para más columnas si es necesario */}
      </footer>
    );
  };

export default Footer;