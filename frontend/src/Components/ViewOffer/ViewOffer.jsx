import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import "./ViewOffer.css";
import NavBar from "../NavBar/NavBar";
import ImageCarousel from "./ImageCarousel";
import BasicDateRangePicker from './BasicDateRangePicker'; 
import axios from 'axios';

const ViewOffer = () => {
    const { id } = useParams();
    const [offer, setOffer] = useState(null);
    const userId = 1; // Asume que tienes el userId de alguna manera, por ejemplo, desde el estado o el contexto.
    const [dateRange, setDateRange] = useState([null, null]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOfferDetails = async () => {
            const response = await fetch(`http://127.0.0.1:8000/get_offer/${id}`);
            const data = await response.json();
            setOffer(data);
        };

        fetchOfferDetails();
    }, [id]);

    const handleDateChange = (newValue) => {
        setDateRange(newValue);
    };

    const handleApplyClick = () => {
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
                    console.log('Dates sent successfully:', response.data);
                    setError(''); // Clear error on success
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
                                <button className="apply-button" onClick={handleApplyClick}>Aplicar</button>
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
        </>
    );
};

export default ViewOffer;
