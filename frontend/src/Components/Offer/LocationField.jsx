import React from 'react';
import "./Offer.css";

const LocationField = ({ label, name, placeholder, value, onChange, onClick }) => {
  return (
    <div className="input-box-offer">
      <div className="input-field-offer">
        <label className="tag-offer">{label}</label>
        <div className="input-field-wrapper">
          <input
            type="text"
            name={name}
            placeholder={placeholder}
            required
            onChange={onChange}
            value={value}
            style={{ flex: 1 }}
          />
          <button type="button" onClick={onClick}>
            Usar Ubicación Actual
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationField;
