import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UploadComponent } from './UploadComponent';
import NavBar from "../NavBar/NavBar";
import axios from 'axios';
import InputField from './InputField';
import LocationField from './LocationField';
import SelectField from './SelectField';
import TextareaField from './TextareaField';


const Offer = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name_offer: '',
    start_day: '',
    description: '',
    coordinates: '',
    salary: 0,
    feeding: '',
    workingHours: 0,
    workingDay: '',
    host_user_id: 1,
    images: []
  });

  const handleLocationClick = async () => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      const coordinates = `${latitude},${longitude}`;
      setFormData(prevState => ({
        ...prevState,
        location: 'Ubicación actual seleccionada',
        coordinates: coordinates  // Asumiendo que tienes un campo para coordenadas
      }));
    }, (error) => {
      console.error('Error obtaining location', error);
    });
  }

  const handleChange = (e) => {
    const { name, value, files } = e.target;
  
    if (name === "images") {
      setFormData(prevState => ({ ...prevState, [name]: [...files] }));
    } else if (name === "shift") {
      const shiftValue = value === "Completa" ? 'D' : 'N';
      setFormData(prevState => ({ ...prevState, workingDay: shiftValue }));
    } else {
      setFormData(prevState => ({ ...prevState, [name]: value }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
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
      coordinates: formData.coordinates
    }));
    data.append('host_user_id', formData.host_user_id);

  if (formData.images && formData.images.length > 0) {
    // Añadir cada archivo de imagen individualmente
    for (let i = 0; i < formData.images.length; i++) {
      data.append(`images`, formData.images[i]); // Usa el mismo nombre de campo para cada archivo
    }
  } else {
    console.error('No image file selected');
    return;
  }

    try {
      const response = await axios.post('http://localhost:8000/add_offer/', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Success:', response);
      navigate('/ConfirmOffer');
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    <>
      <NavBar />
      <div className="offer-container">
        <div className="offer-wrapper">
          <form onSubmit={handleSubmit}>
            <h1>Formulario de Creación de Ofertas</h1>
  
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
  
              <LocationField
                label="Ubicación"
                name="coordinates"
                placeholder="Municipio donde reside"
                value={formData.coordinates}
                onChange={handleChange}
                onClick={handleLocationClick}
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
                name="shift"
                options={["Completa", "Media"]}
                value={formData.workingDay === 'D' ? 'Completa' : 'Media'}
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