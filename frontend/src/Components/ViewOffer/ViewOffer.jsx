import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import Modal from 'react-modal';
import axios from 'axios';

import NavBar from "../NavBar/NavBar";
import ImageCarousel from "./ImageCarousel";
import BasicDateRangePicker from './BasicDateRangePicker';
import { UploadComponent } from './UploadComponent';

import "./ViewOffer.css";

const ViewOffer = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [offer, setOffer] = useState(null);
    const userId = 2;  // Asume que tienes el userId de alguna manera, por ejemplo, desde el estado o el contexto.
    const [dateRange, setDateRange] = useState([null, null]);
    const [error, setError] = useState('');
    const [hasApplied, setHasApplied] = useState(false);
    const [cv, setCv] = useState('');
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [files, setFiles] = useState([]);  // Estado para manejar los archivos

    useEffect(() => {
        const fetchOfferDetails = async () => {
            const response = await axios.get(`http://127.0.0.1:8000/get_offer/${id}`);
            const data = response.data;
            setOffer(data);
        };

        const fetchAppliedStatus = async () => {
            const response = await axios.get(`http://localhost:8000/has_applied/${userId}/${id}`);
            setHasApplied(response.data.has_applied);
        };

        const fetchCv = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/get_cv/${userId}`);
                if (response.data.cv) {
                    setCv(response.data.cv);  // Si el CV existe, lo establece
                } else {
                    setIsUploadModalOpen(true);  // Si no hay CV, abre el modal para subir uno
                }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    // Tratar la ausencia de CV no como un error sino como un estado esperado
                    setIsUploadModalOpen(true);  // Abre el modal para que el usuario pueda subir un CV
                } else {
                    console.error('Error fetching CV:', error);
                    setError('An unexpected error occurred while fetching your CV.');
                }
            }
        };


        fetchOfferDetails();
        fetchAppliedStatus();
        fetchCv();
    }, [id, userId]);

    const handleDateChange = (newValue) => {
        setDateRange(newValue);
    };

    const handleFilesSelected = (selectedFiles) => {
        setFiles(selectedFiles);
        if (selectedFiles.length > 0) {
            uploadFile(selectedFiles[0]);  // Sube el primer archivo seleccionado
        }
    };

    const uploadFile = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await axios.post(`http://localhost:8000/upload_cv/${userId}`, formData, {
                headers: {'Content-Type': 'multipart/form-data'}
            });
            setCv(file.name);
            setIsUploadModalOpen(false);
        } catch (error) {
            console.error('Error uploading CV:', error);
        }
    };

    const handleApplyClick = () => {
        if (!cv) {  // Chequea si el CV no está cargado
            setIsUploadModalOpen(true);  // Abre el modal para cargar CV
            return;  // Detiene la ejecución adicional hasta que el CV sea cargado
        }
        if (dateRange[0] && dateRange[1]) {
            const checkInDate = dateRange[0].format('YYYY-MM-DD');
            const checkOutDate = dateRange[1].format('YYYY-MM-DD');
            const data = {
                startDate: checkInDate,
                endDate: checkOutDate,
                id_user: userId,
                id_offer: id
            };
            axios.post('http://localhost:8000/submit-dates', data)
                .then(response => {
                    navigate('/ApplicationConfirmed');
                    setError('');  // Clear error on success
                })
                .catch(error => {
                    console.error('Error sending dates:', error);
                });
        } else {
            setError('Please select both start and end dates.');
        }
    };

    if (!offer) return <div>Loading...</div>;

    return (
        <>
            <NavBar />
            <div className="view-offer">
                <div className="main-view">
                    <ImageCarousel images={offer.image_urls} />
                    <div className="info-offer">
                        <div className="view-offer-title">
                            <h1>{offer.name_offer}</h1>
                        </div>
                        <div className="view-offer-description">
                            <p>{offer.description}</p>
                            <BasicDateRangePicker
                                offerId={id}
                                value={dateRange}
                                onChange={handleDateChange}
                            />
                            <div className="apply-button-container">
                                <button className="apply-button" onClick={handleApplyClick} disabled={hasApplied}>
                                    {hasApplied ? 'Ya Aplicaste' : 'Aplicar'}
                                </button>
                            </div>
                            {error && <div className="error-message">{error}</div>}
                        </div>
                    </div>
                </div>
                <div className="view-offer-details">
                    <div>
                        <strong>Salario:</strong> ${offer.salary}
                    </div>
                    <div>
                        <strong>Alimentación:</strong> {offer.feeding}
                    </div>
                    <div>
                        <strong>Día de inicio:</strong> {new Date(offer.start_day).toLocaleDateString()}
                    </div>
                </div>
            </div>
            <Modal
                isOpen={isUploadModalOpen}
                onRequestClose={() => setIsUploadModalOpen(false)}
                contentLabel="Upload CV"
                className="ReactModal__Content" // Clase para el contenido
                overlayClassName="ReactModal__Overlay" // Clase para el overlay
            >
                <h2>Subir CV</h2>
                <UploadComponent onFilesSelected={handleFilesSelected} />
                <div className="upload-footer">
                    <button onClick={handleFilesSelected} className="upload-button">Enviar CV</button>
                    <button className="close-button" onClick={() => setIsUploadModalOpen(false)}>Cerrar</button>
                </div>
            </Modal>
        </>
    );
};

export default ViewOffer;
