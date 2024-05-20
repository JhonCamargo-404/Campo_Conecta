import React, { useState, useContext } from "react";
import { BsFilePost } from "react-icons/bs";
import { FaRegUser, FaLock, FaAd, FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="h-12 z-50 flex items-center px-4 bg-custom-green">
      <div className="text-white text-lg mr-8">LOGO</div>
      <div className="flex items-center">
        <Link to="/Home" className="text-white no-underline ml-8 text-sm">Inicio</Link>
        {user && <Link to="/Offer" className="text-white no-underline ml-8 text-sm">Crear oferta</Link>}
      </div>
      <div className="ml-auto relative">
        <button onClick={() => setIsOpen(!isOpen)}>
          <FaRegUser className="text-3xl text-black" />
        </button>
        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
            {user ? (
              <>
                <div className="px-4 py-2 text-sm text-gray-700 font-semibold">{user.name}</div>
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
                <button onClick={logout} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <FaSignOutAlt className="mr-2"/> Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link to="/Login" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <FaLock className="mr-2"/> Iniciar sesión
                </Link>
                <Link to="/Register" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <FaRegUser className="mr-2"/> Registrarse
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
