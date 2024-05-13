import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import "./ViewOffer.css";
import NavBar from "../NavBar/NavBar";
import ImageCarousel from "./ImageCarousel";

const ViewOffer = () => {
    const { id } = useParams();
    const [offer, setOffer] = useState(null);

    useEffect(() => {
        const fetchOfferDetails = async () => {
            const response = await fetch(`http://127.0.0.1:8000/get_offer/${id}`);
            const data = await response.json();
            console.log(data);
            setOffer(data);
        };

        fetchOfferDetails();
    }, [id]);

    if (!offer) return <div>Loading...</div>;

    return (
        <>
            <NavBar />
            <div className="view-offer">
                <div className="main-view">
                    <ImageCarousel images={offer.image_urls} /> {/* Asumiendo que offer.images es un array de URLs */}
                    <div className="info-offer">
                        <div className="view-offer-title">
                            <h1>{offer.name_offer}</h1>
                        </div>
                        <div className="view-offer-description">
                            <p>{offer.description}</p>
                            <button className="apply-button">Aplicar</button>
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
