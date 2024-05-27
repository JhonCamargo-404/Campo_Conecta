import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const Postulaciones = () => {
  const [postulaciones, setPostulaciones] = useState([]);
  const token = sessionStorage.getItem('token');
  const [userId, setUserId] = useState(token ? jwtDecode(token).id_user : null);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/get_applications/${userId}`)
      .then(response => {
        setPostulaciones(response.data);
        console.log(response.data);
      })
      .catch(error => console.error('Error fetching applications:', error));
  }, [userId]);

  const handleDelete = async (id_applicant, id_offer) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar esta postulación?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://127.0.0.1:8000/delete_application/${id_applicant}/${id_offer}`);
        setPostulaciones(postulaciones.filter(postulacion => postulacion.id_applicant !== id_applicant || postulacion.id_offer !== id_offer));
      } catch (error) {
        console.error("Error deleting application:", error);
      }
    }
  };

  const colorClases = (estado) => {
    switch (estado) {
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
                {postulacion.image_url ? (
                  <img src={postulacion.image_url} alt="Offer" className="flex-shrink-0 h-12 w-12 rounded-full mr-4 object-cover" />
                ) : (
                  <div className="flex-shrink-0 h-12 w-12 bg-gray-200 rounded-full mr-4"></div>
                )}
                <div className="text-gray-700">{postulacion.name_offer}</div>
              </div>
              <span className={`px-4 py-1 rounded-full text-sm font-semibold uppercase ${colorClases(postulacion.estado)}`}>
                {postulacion.estado}
              </span>
            </div>
            <div className="flex justify-end mt-4 space-x-3">
              <button
                onClick={() => handleDelete(postulacion.id_applicant, postulacion.id_offer)}
                className="px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-md font-medium"
              >
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
