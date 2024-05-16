import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Applicants = ({ offerId, closeModal }) => {
  const [applicants, setApplicants] = useState([]);

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl relative">
        <h2 className="text-2xl font-bold mb-4">Postulaciones</h2>
        <button className="absolute top-4 right-4 text-lg" onClick={closeModal}>X</button>
        <div className="space-y-4">
          {applicants.map((applicant, index) => (
            <div key={index} className="bg-gray-100 p-4 rounded-lg flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {applicant.cv ? (
                  <img src={applicant.cv} alt={applicant.user_name} className="w-12 h-12 rounded-full" />
                ) : (
                  <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                )}
                <div className="text-gray-700">
                  <div>{applicant.user_name} {applicant.user_last_name}</div>
                  <div className="text-sm text-gray-500">{applicant.email}</div>
                  <div className="text-sm text-gray-500">Edad: {applicant.age}</div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 bg-gray-200 rounded-full">
                  <i className="fas fa-eye"></i>
                </button>
                <button className="p-2 bg-green-200 rounded-full">
                  <i className="fas fa-check"></i>
                </button>
                <button className="p-2 bg-red-200 rounded-full">
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
        <button onClick={closeModal} className="mt-4 px-4 py-2 bg-black text-white rounded-full">Volver</button>
      </div>
    </div>
  );
};

export default Applicants;
