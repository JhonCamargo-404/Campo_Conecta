import React from 'react';

const Postulaciones = () => {
  // Suponiendo que tengas un estado o prop para tus postulaciones
  const postulaciones = [
    { estado: 'en revision', texto: 'Proin id justo ac dui blandit sollicitudin.' },
    { estado: 'rechazado', texto: 'Proin id justo ac dui blandit sollicitudin.' },
    { estado: 'aceptado', texto: 'Proin id justo ac dui blandit sollicitudin.' },
    // ... otros estados
  ];

  // Función para determinar los colores basados en el estado
  const colorClases = (estado) => {
    switch(estado) {
      case 'en revision':
        return 'text-yellow-500 bg-yellow-100';
      case 'rechazado':
        return 'text-red-500 bg-red-100';
      case 'aceptado':
        return 'text-green-500 bg-green-100';
      default:
        return '';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-10 bg-white big-container">
      <div className="w-full max-w-4xl px-4">
        <h1 className="text-4xl font-bold text-gray-700 mb-8 text-center">Mis postulaciones</h1>
        {postulaciones.map((postulacion, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-12 w-12 bg-gray-200 rounded-full mr-4"></div>
                <div className="text-gray-700">{postulacion.texto}</div>
              </div>
              <span className={`px-4 py-1 rounded-full text-sm font-semibold uppercase ${colorClases(postulacion.estado)}`}>
                {postulacion.estado}
              </span>
            </div>
            <div className="flex justify-end mt-4 space-x-3">
              <button className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md font-medium">
                Editar
              </button>
              <button className="px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-md font-medium">
                Eliminar
              </button>
            </div>
          </div>
        ))}
        <div className="flex justify-center mt-4">
          <button className="px-8 py-2 border rounded-full border-gray-300 text-gray-700 text-sm font-medium shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-opacity-50">
            Cargar más
          </button>
        </div>
      </div>
    </div>
  );
};

export default Postulaciones;