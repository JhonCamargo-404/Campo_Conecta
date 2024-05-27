import React from "react";
import NavBar from "./NavBarAdmin";
import Footer from "../../Footer/Footer";
import image1 from "../../../Assets/ad1.png";

const HomeAdmin = () => {
  return (
    <div className="flex flex-col w-screen min-h-screen bg-white justify-between">
      <NavBar />
      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="bg-white p-4 rounded-lg mb-8">
          <h1 className="text-4xl font-bold text-border">Bienvenido administrador</h1>
        </div>
        <div className="max-w-md max-h-96 overflow-hidden rounded-lg shadow-lg">
          <img
            src={image1}
            alt="Imagen"
            className="w-full h-auto object-cover"
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomeAdmin;