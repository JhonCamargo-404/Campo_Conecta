import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UploadComponent } from './UploadComponent';
import NavBar from "../NavBar/NavBar";
import axios from 'axios';
import InputField from './InputField';
import SelectField from './SelectField';
import TextareaField from './TextareaField';
import municipiosData from '../../file/municipios_boyaca_coordenadas.json';
import { AlertComponent } from "../Alert/AlertComponent";

const Offer = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name_offer: '',
    start_day: '',
    description: '',
    municipality: '',
    coordinates: '',
    salary: 0,
    feeding: '',
    workingHours: 0,
    workingDay: '', // Correctly initialize workingDay
    images: []
  });
  const [alertInfo, setAlertInfo] = useState({ visible: false, color: '', title: '', description: '' });

  useEffect(() => {
    if (municipiosData.length > 0) {
      const { Municipio, Latitud, Longitud } = municipiosData[0];
      setFormData(prev => ({
        ...prev,
        municipality: Municipio,
        coordinates: `${Latitud}, ${Longitud}`
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));

    if (name === "municipality") {
      const municipioSeleccionado = municipiosData.find(m => m.Municipio === value);
      if (municipioSeleccionado) {
        const { Latitud, Longitud } = municipioSeleccionado;
        setFormData(prev => ({
          ...prev,
          coordinates: `${Latitud}, ${Longitud}`
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = sessionStorage.getItem('token');
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    };

    const data = new FormData();
    data.append('labor_details', JSON.stringify({
      salary: formData.salary,
      feeding: formData.feeding,
      workingHours: formData.workingHours,
      workingDay: formData.workingDay
    }));
    data.append('offer_details', JSON.stringify({
      name_offer: formData.name_offer,
      start_day: formData.start_day,
      description: formData.description,
      municipality: formData.municipality,
      coordinates: formData.coordinates
    }));

    if (formData.images && formData.images.length > 0) {
      formData.images.forEach((image, i) => {
        data.append(`images`, image);
      });
    }

    try {
      const response = await axios.post('http://localhost:8000/add_offer/', data, config);
      console.log('Success:', response);
      navigate('/ConfirmOffer');
    } catch (error) {
      console.error('Error:', error);
      setAlertInfo({ visible: false });  
      setTimeout(() => {
        setAlertInfo({
          visible: true,
          color: 'error',
          title: 'Error al enviar la oferta',
          description: 'Intente de nuevo más tarde.'
        });
      }, 100); 
    }
  };

  return (
    <>
      <NavBar />
      <div className="offer-container">
        <div className="offer-wrapper">
          <form onSubmit={handleSubmit}>
            <h1>Formulario de Creación de Ofertas</h1>
            <div style={{ position: 'fixed', top: 10, right: 10, zIndex: 1000 }}>
              {alertInfo.visible && <AlertComponent color={alertInfo.color} title={alertInfo.title} description={alertInfo.description} />}            
            </div>
            <div className="input-box-image">
              <UploadComponent onFilesSelected={(files) => setFormData(prev => ({ ...prev, images: files }))} />
            </div>

            <div className="todo">
              <InputField
                label="Título"
                type="text"
                name="name_offer"
                placeholder="Título de la Oferta"
                value={formData.name_offer}
                onChange={handleChange}
              />

              <SelectField
                label="Ubicación"
                name="municipality"
                options={municipiosData.map(m => m.Municipio)}
                value={formData.municipality}
                onChange={handleChange}
              />

              <InputField
                label="Horas de trabajo"
                type="number"
                name="workingHours"
                placeholder="Horas semanales de trabajo"
                value={formData.workingHours}
                onChange={handleChange}
              />

              <InputField
                label="Salario"
                type="number"
                name="salary"
                placeholder="Salario que ofrece"
                value={formData.salary}
                onChange={handleChange}
              />

              <InputField
                label="Fecha de inicio"
                type="date"
                name="start_day"
                placeholder="Seleccione las fechas"
                value={formData.start_day}
                onChange={handleChange}
              />

              <SelectField
                label="¿Ofrece alojamiento?"
                name="accommodation"
                options={["Si", "No"]}
                value={formData.accommodation}
                onChange={handleChange}
              />

              <SelectField
                label="¿Ofrece alimentación?"
                name="feeding"
                options={["Si", "No"]}
                value={formData.feeding}
                onChange={handleChange}
              />

              <SelectField
                label="Jornada"
                name="workingDay" // Ensure the name matches the state property
                options={["Completa", "Media"]}
                value={formData.workingDay}
                onChange={handleChange}
              />

              <TextareaField
                label="Descripción"
                name="description"
                placeholder="Haz una breve descripción de la oferta"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
            <div className="button-container">
              <button type="submit" className="create-offer-button">Crear oferta</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Offer;
