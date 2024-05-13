import React from 'react';
import { LuUser2 } from "react-icons/lu";
import { FaLock } from "react-icons/fa";
import { BsFilePost } from "react-icons/bs";
import { RiAdvertisementLine } from "react-icons/ri";
import { NavLink } from 'react-router-dom';  // Importa Link de react-router-dom

const SideMenu = () => {
  const activeStyle = { fontWeight: 'bold' }; 

  return (
    <div className="flex-none w-64 h-full shadow-lg p-5 rounded-lg mr-10">
      <NavLink to="/Profile" style={({ isActive }) => isActive ? activeStyle : undefined} className="flex items-center mb-5 no-underline text-black hover:text-blue-700"> 
        <LuUser2 className="icon mr-2 align-middle"/>
        Mi perfil
      </NavLink>
      <NavLink to="/SecuritySettings" style={({ isActive }) => isActive ? activeStyle : undefined} className="flex items-center mb-5 no-underline text-black hover:text-blue-700">
        <FaLock className="icon mr-2 align-middle"/>
        Seguridad
      </NavLink>
      <NavLink to="/MyOffers" style={({ isActive }) => isActive ? activeStyle : undefined} className="flex items-center mb-5 no-underline text-black hover:text-blue-700">
        <BsFilePost className="icon mr-2 align-middle"/>
        Mis postulaciones
      </NavLink>
      <NavLink to="/MyAdvertisements" style={({ isActive }) => isActive ? activeStyle : undefined} className="flex items-center mb-5 no-underline text-black hover:text-blue-700">
        <RiAdvertisementLine className="icon mr-2 align-middle"/>
        Mis anuncios
      </NavLink>
    </div>
  );
};

export default SideMenu;
