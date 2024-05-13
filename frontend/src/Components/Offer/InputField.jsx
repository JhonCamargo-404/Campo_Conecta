import React from "react";
import "./Offer.css";

const InputField = ({ label, type, name, placeholder, value, onChange }) => {
    return (
      <div className="input-box-offer">
        <div className="input-field-offer">
          <label className="tag-offer">{label}</label>
          <input
            type={type}
            name={name}
            placeholder={placeholder}
            required
            onChange={onChange}
            value={value}
            className="input-style"
          />
        </div>
      </div>
    );
  };
  
  export default InputField;
  