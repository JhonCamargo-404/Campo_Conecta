import React, { useState } from 'react';
import NavBar from "./NavBarAdmin";
import MenuAdmin from "./MenuAdmin";


const UpdatePasswordModal = ({ isOpen, onClose }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleSave = (e) => {
    e.preventDefault();
    if (!newPassword.trim() || !confirmPassword.trim()) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    // Aquí puedes agregar la lógica para actualizar la contraseña en el backend.
    setError('');
    onClose(); // Cerrar modal si todo está correcto.
  };

  const handleBackgroundClick = (e) => {
    if (e.target.id === 'modal-background') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div id="modal-background" className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={handleBackgroundClick}>
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h3 className="text-2xl mb-4">Digite su nueva contraseña</h3>
        {error && <div className="text-sm mb-4 text-orange-500">{error}</div>}
        <form onSubmit={handleSave}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              CONTRASEÑA NUEVA
            </label>
            <input
              type="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Ingrese una nueva contraseña"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="mb-8">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              REPITA LA CONTRASEÑA
            </label>
            <input
              type="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Ingrese de nuevo la contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Guardar
          </button>
        </form>
      </div>
    </div>
  );
};

const SecuritySettingsContent = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleUpdatePassword = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); 
  };
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="w-full px-4">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Login</h2>
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-gray-700 mb-4 md:mb-0">Contraseña</p>
            <button
              onClick={handleUpdatePassword}
              className="px-6 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Actualizar contraseña
            </button>
          </div>
        </div>
        <UpdatePasswordModal isOpen={isModalOpen} onClose={handleCloseModal} />
      </div>
    </div>
  );
};


const SecuritySettingsAdmin = () => {
  return (
    <div className="flex flex-col w-screen h-full min-h-screen">
      <NavBar />
      <div className="flex flex-1 min-h-0 bg-white p-5">
        <MenuAdmin />
        <div className="flex-1 overflow-y-auto">
          <SecuritySettingsContent />
        </div>
      </div>
    </div>
  );
};

export default SecuritySettingsAdmin;
