import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PdfViewer from './PdfViewer';

const Applicants = ({ offerId, closeModal }) => {
  const [applicants, setApplicants] = useState([]);
  const [selectedCv, setSelectedCv] = useState(null);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/get_applicants/${offerId}`);
        setApplicants(response.data);
      } catch (error) {
        console.error("Error fetching applicants:", error);
      }
    };

    fetchApplicants();
  }, [offerId]);

  const handlePdfView = (cv) => {
    console.log("Attempting to view PDF at URL:", cv);
    if (cv) {
      setSelectedCv(cv);
    } else {
      alert('Este aplicante no tiene CV.');
    }
  };

  const handleClosePdfViewer = () => {
    setSelectedCv(null);
  };

  const handleAccept = async (applicantId) => {
    try {
      const response = await axios.post(`http://127.0.0.1:8000/accept_applicant/${applicantId}`);
      if (response.data.success) {
        alert('Postulación aceptada');
        // Aquí podrías también actualizar el estado en el frontend si es necesario
      }
    } catch (error) {
      console.error('Error al aceptar postulación:', error);
      alert('Error al procesar la solicitud');
    }
  };

  const handleReject = async (applicantId) => {
    try {
      const response = await axios.post(`http://127.0.0.1:8000/reject_applicant/${applicantId}`);
      if (response.data.success) {
        alert('Postulación rechazada');
        // Igual que con aceptar, actualizar estado en el frontend si es necesario
      }
    } catch (error) {
      console.error('Error al rechazar postulación:', error);
      alert('Error al procesar la solicitud');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl relative">
        <h2 className="text-2xl font-bold mb-4">Postulaciones</h2>
        <button className="absolute top-4 right-4 text-lg" onClick={closeModal}>X</button>
        <div className="space-y-4">
          {applicants.map((applicant, index) => (
            <div key={index} className="bg-gray-100 p-4 rounded-lg flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div className="text-gray-700">
                  <div>{applicant.user_name} {applicant.user_last_name}</div>
                  <div className="text-sm text-gray-500">{applicant.email}</div>
                  <div className="text-sm text-gray-500">Edad: {applicant.age}</div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 bg-gray-200 rounded-full" onClick={() => handlePdfView(applicant.cv)}>
                  <i className="fas fa-eye"></i>
                </button>
                <button className="p-2 bg-green-200 rounded-full" onClick={() => handleAccept(applicant.id_applicant)}>
                  <i className="fas fa-check"></i>
                </button>
                <button className="p-2 bg-red-200 rounded-full" onClick={() => handleReject(applicant.id_applicant)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
        <button onClick={closeModal} className="mt-4 px-4 py-2 bg-black text-white rounded-full">Volver</button>
      </div>
      {selectedCv && (
        <PdfViewer fileUrl={selectedCv} onClose={handleClosePdfViewer} />
      )}
    </div>
  );
};

export default Applicants;
