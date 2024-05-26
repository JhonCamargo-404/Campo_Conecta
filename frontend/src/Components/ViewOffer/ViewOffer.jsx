import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Modal from 'react-modal';
import axios from 'axios';
import NavBar from "../NavBar/NavBar";
import ImageCarousel from "./ImageCarousel";
import BasicDateRangePicker from './BasicDateRangePicker';
import { UploadComponent } from './UploadComponent';
import { AuthContext } from "../../context/AuthContext";  // Importa AuthContext

import "./ViewOffer.css";

const ViewOffer = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { user, logout } = useContext(AuthContext);  // Usa el contexto de autenticación
    const [offer, setOffer] = useState(null);
    const [dateRange, setDateRange] = useState([null, null]);
    const [error, setError] = useState('');
    const [hasApplied, setHasApplied] = useState(false);
    const [cv, setCv] = useState('');
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [files, setFiles] = useState([]);

    useEffect(() => {
        const fetchOfferDetails = async () => {
            const response = await axios.get(`http://127.0.0.1:8000/get_offer/${id}`);
            const data = response.data;
            setOffer(data);
        };

        const fetchAppliedStatus = async () => {
            if (user) {
                try {
                    const response = await axios.get(`http://localhost:8000/has_applied/${user.id}/${id}`);
                    setHasApplied(response.data.has_applied);
                } catch (error) {
                    console.error('Error fetching applied status:', error);
                    if (error.response) {
                        console.error('Response data:', error.response.data);
                        console.error('Response status:', error.response.status);
                    }
                }
            }
        };

        const fetchCv = async () => {
            try {
                if (user) {
                    const response = await axios.get(`http://localhost:8000/get_cv/${user.id}`);
                    if (response.data.cv) {
                        setCv(response.data.cv);
                    } else {
                        setIsUploadModalOpen(true);
                    }
                }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    setIsUploadModalOpen(true);
                } else {
                    console.error('Error fetching CV:', error);
                    setError('An unexpected error occurred while fetching your CV.');
                }
            }
        };

        fetchOfferDetails();
        fetchAppliedStatus();
        fetchCv();
    }, [id, user]);

    const handleDateChange = (newValue) => {
        setDateRange(newValue);
    };

    const handleFilesSelected = (selectedFiles) => {
        setFiles(selectedFiles);
        if (selectedFiles.length > 0) {
            uploadFile(selectedFiles[0]);
        }
    };

    const uploadFile = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await axios.post(`http://localhost:8000/upload_cv/${user.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setCv(file.name);
            setIsUploadModalOpen(false);
        } catch (error) {
            console.error('Error uploading CV:', error);
        }
    };

    const handleApplyClick = () => {
        if (!cv) {
            setIsUploadModalOpen(true);
            return;
        }
        if (dateRange[0] && dateRange[1]) {
            const checkInDate = dateRange[0].format('YYYY-MM-DD');
            const checkOutDate = dateRange[1].format('YYYY-MM-DD');
            const data = {
                startDate: checkInDate,
                endDate: checkOutDate,
                id_user: user.id,
                id_offer: id
            };
            axios.post('http://localhost:8000/submit-dates', data)
                .then(response => {
                    navigate('/ApplicationConfirmed');
                    setError('');
                })
                .catch(error => {
                    console.error('Error sending dates:', error);
                });
        } else {
            setError('Please select both start and end dates.');
        }
    };

    const handleLoginClick = () => {
        navigate('/login');
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
                                {user ? (
                                    <button className="apply-button" onClick={handleApplyClick} disabled={hasApplied}>
                                        {hasApplied ? 'Ya Aplicaste' : 'Aplicar'}
                                    </button>
                                ) : (
                                    <button className="apply-button" onClick={handleLoginClick}>
                                        Iniciar Sesión
                                    </button>
                                )}
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
                className="ReactModal__Content"
                overlayClassName="ReactModal__Overlay"
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
