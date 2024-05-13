import React, { useRef, useEffect } from "react";
import "./ValidationComponent.css";

const ValidationComponent = ({ message, onClose }) => {
  const validationRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (validationRef.current && !validationRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="validation-overlay">
      <div ref={validationRef} className="validation-box">
        <p>{message}</p>
        {message.includes("Error") ? (
          <div className="error-image" />
        ) : (
          <div className="success-image" />
        )}
      </div>
      <span className="close-btn" onClick={onClose}>Cerrar</span>
    </div>
  );
};

export default ValidationComponent;
