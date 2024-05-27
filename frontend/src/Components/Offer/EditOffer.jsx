import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UploadComponent } from '../ViewOffer/UploadComponent';
import NavBar from "../NavBar/NavBar";
import axios from 'axios';
import InputField from './InputField';
import SelectField from './SelectField';
import TextareaField from './TextareaField';
import municipiosData from '../../file/municipios_boyaca_coordenadas.json';
import { AlertComponent } from "../Alert/AlertComponent";

const EditOffer = () => {
  const navigate = useNavigate();
  const { offerId } = useParams();
  const [formData, setFormData] = useState({
    name_offer: '',
    start_day: '',
    description: '',
    municipality: '',
    coordinates: '',
    salary: 0,
    feeding: '',
    workingHours: 0,
    workingDay: '',
    images: [],
    deletedImages: []
  });
  const [alertInfo, setAlertInfo] = useState({ visible: false, color: '', title: '', description: '' });

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/get_offer/${offerId}`);
        const offer = response.data;
        setFormData({
          name_offer: offer.name_offer,
          start_day: offer.start_day,
          description: offer.description,
          municipality: offer.municipality,
          coordinates: offer.coordinates,
          salary: offer.salary,
          feeding: offer.feeding,
          workingHours: offer.workingHours,
          workingDay: offer.workingDay,
          images: offer.image_urls,
          deletedImages: []
        });
      } catch (error) {
        console.error('Error fetching offer:', error);
        setAlertInfo({
          visible: true,
          color: 'error',
          title: 'Error al cargar la oferta',
          description: 'Intente de nuevo más tarde.'
        });
      }
    };

    if (offerId) {
      fetchOffer();
    }
  }, [offerId]);

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

  const handleImageRemove = (image) => {
    setFormData(prevState => ({
      ...prevState,
      images: prevState.images.filter(img => img !== image),
      deletedImages: [...prevState.deletedImages, image]
    }));
  };

  const handleFilesSelected = (files) => {
    setFormData(prevState => ({
      ...prevState,
      images: [...prevState.images, ...files]
    }));
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

    formData.images.forEach((image, i) => {
      if (typeof image === 'object') {
        data.append(`new_images`, image);
      }
    });

    if (formData.deletedImages.length > 0) {
      data.append('deleted_images', JSON.stringify(formData.deletedImages));
    }

    try {
      const response = await axios.put(`http://localhost:8000/updateOffer/${offerId}`, data, config);
      console.log('Success:', response);
      navigate('/ConfirmOffer');
    } catch (error) {
      console.error('Error:', error);
      setAlertInfo({
        visible: true,
        color: 'error',
        title: 'Error al actualizar la oferta',
        description: 'Intente de nuevo más tarde.'
      });
    }
  };

  return (
    <>
      <NavBar />
      <div className="offer-container">
        <div className="offer-wrapper">
          <form onSubmit={handleSubmit}>
            <h1>Formulario de Actualización de Ofertas</h1>
            {alertInfo.visible && (
              <div style={{ position: 'fixed', top: 10, right: 10, zIndex: 1000 }}>
                <AlertComponent color={alertInfo.color} title={alertInfo.title} description={alertInfo.description} />
              </div>
            )}
            <div className="input-box-image">
              <UploadComponent 
                initialImages={formData.images}
                onFilesSelected={handleFilesSelected}
                onImageRemove={handleImageRemove}
              />
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
              <button type="submit" className="create-offer-button">Actualizar oferta</button>
              <button type="button" onClick={() => navigate(-1)} className="cancel-button">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditOffer;
