import React from 'react';
import "./Offer.css";

const SelectField = ({ label, name, options, value, onChange }) => {
  return (
    <div className="input-box-offer">
      <div className="input-field-offer">
        <label className="tag-offer">{label}</label>
        <select
          className="select-option"
          name={name}
          onChange={onChange}
          value={value}
        >
          {options.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SelectField;
