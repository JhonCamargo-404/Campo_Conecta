import React from 'react';
import "./Offer.css";

const TextareaField = ({ label, name, placeholder, value, onChange }) => {
  return (
    <div className="input-box-offer">
      <div className="input-field-offer">
        <label className="tag-offer">{label}</label>
        <textarea
          className="text-area"
          name={name}
          placeholder={placeholder}
          required
          onChange={onChange}
          value={value}
        ></textarea>
      </div>
    </div>
  );
};

export default TextareaField;
