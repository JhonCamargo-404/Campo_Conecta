import React, { useState } from 'react';
import './MyProfile.css'; 
import MenuAdmin from "./MenuAdmin";
import NavBarAdmin from './NavBarAdmin';

// Componente para los campos del formulario
const InputField = ({ label, type, name, value, onChange }) => (
  <div className="input-group">
    <label htmlFor={name}>{label}</label>
    <input
      type={type}
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      className="input-field"
    />
  </div>
);

const MyProfile = () => {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para manejar la actualización del perfil
  };

  const handleReset = () => {
    setProfile({
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
    });
  };

  return (
    //prueba
    <div className="main-wrapper">
      <NavBarAdmin />
      <div className="main-container">
        <MenuAdmin />
        <div className="profile-container">
          <div className="profile-section">
            <h2>Perfil de usuario</h2>
            <h3>Información de la cuenta</h3>
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-row">
                <InputField
                  label="Nombres"
                  type="text"
                  name="firstName"
                  value={profile.firstName}
                  onChange={handleChange}
                />
                <InputField
                  label="Apellidos"
                  type="text"
                  name="lastName"
                  value={profile.lastName}
                  onChange={handleChange}
                />
              </div>

              <div className="form-row">
                <InputField
                  label="Número"
                  type="tel"
                  name="phoneNumber"
                  value={profile.phoneNumber}
                  onChange={handleChange}
                />
                <InputField
                  label="Email"
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                />
              </div>
              
              <div className="buttons">
                <button type="submit" className="update-button">Actualizar perfil</button>
                <button type="button" className="delete-button" onClick={handleReset}>Borrar todo</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
