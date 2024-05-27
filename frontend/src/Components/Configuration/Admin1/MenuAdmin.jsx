import React from 'react';
import { LuUser2 } from "react-icons/lu";
import { FaLock } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { RiAdvertisementLine } from "react-icons/ri";
import { NavLink } from 'react-router-dom';  // Importa Link de react-router-dom

const MenuAdmin = () => {
  const activeStyle = { fontWeight: 'bold' };

  return (
    <div className="flex-none w-64 h-full shadow-lg p-5 rounded-lg mr-10">
      <NavLink to="/MyProfile" style={({ isActive }) => isActive ? activeStyle : undefined} className="flex items-center mb-5 no-underline text-black hover:text-blue-700">
        <LuUser2 className="icon mr-2 align-middle" />
        Perfil de usuario
      </NavLink>
      <NavLink to="/SecuritySettingsAdmin" style={({ isActive }) => isActive ? activeStyle : undefined} className="flex items-center mb-5 no-underline text-black hover:text-blue-700">
        <FaLock className="icon mr-2 align-middle" />
        Seguridad
      </NavLink>
      <NavLink to="/DeleteUsers" style={({ isActive }) => isActive ? activeStyle : undefined} className="flex items-center mb-5 no-underline text-black hover:text-blue-700">
        <FaUsers className="icon mr-2 align-middle" />
        Usuarios
      </NavLink>
      <NavLink to="/DeleteMyAdvertisement" style={({ isActive }) => isActive ? activeStyle : undefined} className="flex items-center mb-5 no-underline text-black hover:text-blue-700">
        <RiAdvertisementLine className="icon mr-2 align-middle" />
        Anuncios
      </NavLink>
    </div>
  );
};

export default MenuAdmin;
