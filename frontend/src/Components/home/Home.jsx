import React, { useState, useEffect } from "react";
import NavBar from "../NavBar/NavBar";
import Footer from "../Footer/Footer";
import { MdOutlineMyLocation } from "react-icons/md";
import { BsFillFilterSquareFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import Map from "../Map/Map";

const OfferCard = ({ id, title, municipality, description, start_day, image_url }) => {
  return (
    <Link to={`/offer/${id}`} style={{ textDecoration: 'none' }}>
      <div className="w-3/5 h-42 mx-auto bg-white rounded-lg shadow-md p-4 mb-4 flex items-center justify-start gap-4">
        <img src={image_url} alt="Offer" className="w-24 h-auto object-cover" />
        <div className="text-left flex flex-col justify-center">
          <h3 className="my-2"><strong>{title}</strong></h3>
          <h2 className="my-2" >{municipality}</h2>
          <p className="my-2">{description}</p>
          <span className="my-2">{start_day}</span>
        </div>
      </div>
    </Link>
  );
};

const OffersHeader = () => {
  const [showMap, setShowMap] = useState(false);

  return (
    <div className="h-30 w-4/5 mx-auto mt-8 relative">
      <div className="flex justify-around items-center w-full">
        <button className="flex items-center mr-4" onClick={() => setShowMap(true)}>
          <MdOutlineMyLocation className="text-xl mr-2" />
          Tunja, Boyacá
        </button>
        <input type="text" placeholder="Buscar ofertas" className="flex-grow p-2.5 text-lg border-2 border-black rounded-lg outline-none mr-2.5 text-gray-800 placeholder-gray-400 focus:border-green-400" />
        <BsFillFilterSquareFill className="text-xl cursor-pointer" />
      </div>
      <h1 className="text-xl mt-4">Ofertas</h1>
      {showMap && <Map isMapOpen={showMap} closeMap={() => setShowMap(false)} />}
    </div>
  );
};

const OffersContainer = () => {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/get_offers");

        const data = await response.json();
        console.log(data);
        setOffers(data);
      } catch (error) {
        console.error("Error fetching offers:", error);
      }
    };

    fetchOffers();
  }, []);

  return (
    <div className="flex flex-col justify-center gap-5 p-4 w-4/5 mx-auto">
      {offers.map((offer) => (
        <OfferCard
          key={offer.id_offer}
          id={offer.id_offer}
          title={offer.name_offer}
          municipality={offer.municipality}
          start_day={offer.start_day}
          image_url={offer.image_url}
        />
      ))}
      <button className="bg-white border border-black py-2 px-5 rounded-full cursor-pointer text-lg my-4 mx-auto">Cargar más</button>
    </div>
  );
};

const Home = () => {
  return (
    <div className="flex flex-col w-screen min-h-screen bg-gradient-to-b from-custom-green1 via-custom-green2 to-custom-green4 justify-between">
      <NavBar />
      <div className="flex-grow">
        <OffersHeader />
        <OffersContainer />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
