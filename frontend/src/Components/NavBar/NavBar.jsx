import React, { useState } from "react";
import { BsFilePost } from "react-icons/bs";
import { FaRegUser, FaLock, FaAd, FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="h-12 z-50 flex items-center px-4 bg-custom-green">
      <div className="text-white text-lg mr-8">LOGO</div>
      <div className="flex items-center">
        <Link to="/Home" className="text-white no-underline ml-8 text-sm">Inicio</Link>
        <Link to="/Offer" className="text-white no-underline ml-8 text-sm">Crear oferta</Link>
      </div>
      <div className="ml-auto relative">
        <button onClick={() => setIsOpen(!isOpen)}>
          <FaRegUser className="text-3xl text-black" />
        </button>
        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
            <div className="px-4 py-2 text-sm text-gray-700 font-semibold">Ngoc Pham</div>
            <Link to="/Profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              <FaRegUser className="mr-2"/> Mi perfil
            </Link>
            <Link to="/SecuritySettings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              <FaLock className="mr-2"/> Seguridad
            </Link>
            <Link to="/MyOffers" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              <BsFilePost className="mr-2"/> Mis postulaciones
            </Link>
            <Link to="/MyAdvertisements" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              <FaAd className="mr-2"/> Mis anuncios
            </Link>
            <Link to="/Home" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              <FaSignOutAlt className="mr-2"/> Cerrar sesión
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
