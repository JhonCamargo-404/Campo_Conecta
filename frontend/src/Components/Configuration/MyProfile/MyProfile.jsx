import React, { useState, useContext } from 'react';
import './MyProfile.css'; 
import NavBar from "../../NavBar/NavBar";
import SideMenu from "../SideMenu/SideMenu";
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';

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

const UserProfile = () => {
  const { user } = useContext(AuthContext); 
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    age: '',
    email: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://127.0.0.1:8000/updateProfile/${user.id_user}`, profile, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        alert('Perfil actualizado con éxito');
      } else {
        alert('Error al actualizar el perfil: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      alert('Error al actualizar el perfil');
    }
  };

  const handleReset = () => {
    setProfile({
      firstName: '',
      lastName: '',
      age: '',
      email: '',
    });
  };

  return (
    <div className="main-wrapper">
      <NavBar />
      <div className="main-container">
        <SideMenu />
        <div className="profile-container">
          <div className="profile-section">
            <h2>Mi perfil</h2>
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
                  label="Edad"
                  type="number"
                  name="age"
                  value={profile.age}
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

export default UserProfile;
