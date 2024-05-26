import React, { useState, useEffect } from "react";
import NavBar from "../NavBar/NavBar";
import Footer from "../Footer/Footer";
import { MdOutlineMyLocation } from "react-icons/md";
import { BsFillFilterSquareFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import Map from "../Map/Map";
import municipalitiesData from "../../file/municipios_boyaca_coordenadas.json";

const OfferCard = ({ id, title, description, start_day, image_url }) => {
  return (
    <Link to={`/offer/${id}`} style={{ textDecoration: 'none' }}>
      <div className="w-3/5 h-42 mx-auto bg-white rounded-lg shadow-md p-4 mb-4 flex items-center justify-start gap-4">
        <img src={image_url} alt="Offer" className="w-24 h-auto object-cover" />
        <div className="text-left flex flex-col justify-center">
          <h3 className="my-2">{title}</h3>
          <p className="my-2">{description}</p>
          <span className="my-2">{start_day}</span>
        </div>
      </div>
    </Link>
  );
};


const MunicipalityFilter = ({ applyFilters, closeFilterMenu }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMunicipality, setSelectedMunicipality] = useState(null);

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleApplyFilters = () => {
    applyFilters(selectedMunicipality ? [selectedMunicipality] : []);
    closeFilterMenu(); // Cierra el componente de filtrado
  };

  const selectMunicipality = (municipality) => {
    if (selectedMunicipality === municipality) {
      setSelectedMunicipality(null);
    } else {
      setSelectedMunicipality(municipality);
    }
  };

  return (
    <div className="absolute top-full right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg">
      <input
        type="text"
        placeholder="Buscar municipio"
        className="w-full p-2 border-b border-gray-200 outline-none"
        value={searchTerm}
        onChange={handleInputChange}
      />
      <div className="overflow-y-auto max-h-48">
        <label key="todos" className="block px-4 py-2 cursor-pointer">
          <input
            type="radio"
            checked={selectedMunicipality === "TODOS"}
            onChange={() => selectMunicipality("TODOS")}
            className="mr-2 cursor-pointer"
          />
          TODOS
        </label>
        {municipalitiesData
          .filter((municipality) => municipality.Municipio.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((municipality) => (
            <label key={municipality.Municipio} className="block px-4 py-2 cursor-pointer">
              <input
                type="radio"
                checked={selectedMunicipality === municipality.Municipio}
                onChange={() => selectMunicipality(municipality.Municipio)}
                className="mr-2 cursor-pointer"
              />
              {municipality.Municipio}
            </label>
          ))}
      </div>
      <button className="block w-full text-center py-2 bg-green-500 text-white font-semibold" onClick={handleApplyFilters}>
        Aplicar filtro
      </button>
      {selectedMunicipality && (
        <div className="py-2 px-4 bg-gray-100">
          Filtro activo:
          <span className="ml-2 bg-gray-200 px-2 py-1 rounded-full text-sm">{selectedMunicipality}</span>
        </div>
      )}
    </div>
  );
};


const OffersHeader = ({ applyFilters }) => {
  const [showMap, setShowMap] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const toggleFilterMenu = () => {
    setShowFilterMenu(!showFilterMenu);
  };

  const closeFilterMenu = () => {
    setShowFilterMenu(false);
  };

  return (
    <div className="h-30 w-4/5 mx-auto mt-8 relative">
      <div className="flex justify-around items-center w-full">
        <button className="flex items-center mr-4" onClick={() => setShowMap(true)}>
          <MdOutlineMyLocation className="text-xl mr-2" />
          Tunja, Boyacá
        </button>
        <input
          type="text"
          placeholder="Buscar ofertas"
          className="flex-grow p-2.5 text-lg border-2 border-black rounded-lg outline-none mr-2.5 text-gray-800 placeholder-gray-400 focus:border-green-400"
        />
        <div className="relative">
          <BsFillFilterSquareFill className="text-xl cursor-pointer" onClick={toggleFilterMenu} />
          {showFilterMenu && (
            <MunicipalityFilter applyFilters={applyFilters} closeFilterMenu={closeFilterMenu} />
          )}
        </div>
      </div>
      <h1 className="text-xl mt-4">Ofertas</h1>
      {showMap && <Map isMapOpen={showMap} closeMap={() => setShowMap(false)} />}
    </div>
  );
};
const OffersContainer = ({ filteredMunicipality }) => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOffers = async () => {
      setLoading(true);
      try {
        const endpoint = filteredMunicipality
          ? `http://127.0.0.1:8000/get_offers-by-municipality/${filteredMunicipality}`
          : "http://127.0.0.1:8000/get_offers";
        const response = await fetch(endpoint);
        const data = await response.json();

        // Validate if the data is an array
        if (Array.isArray(data)) {
          setOffers(data);
        } else {
          setOffers([]);
          console.error("API response is not an array:", data);
        }
      } catch (error) {
        console.error("Error fetching offers:", error);
        setOffers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, [filteredMunicipality]);

  return (
    <div className="flex flex-col justify-center gap-5 p-4 w-4/5 mx-auto">
      {loading ? (
        <p className="text-center">Cargando...</p>
      ) : offers.length > 0 ? (
        offers.map((offer) => (
          <OfferCard
            key={offer.id_offer}
            id={offer.id_offer}
            title={offer.name_offer}
            description={offer.description}
            start_day={offer.start_day}
            image_url={offer.image_url}
          />
        ))
      ) : (
        <p className="text-center">No se encontraron ofertas.</p>
      )}
      <button className="bg-white border border-black py-2 px-5 rounded-full cursor-pointer text-lg my-4 mx-auto">
        Cargar más
      </button>
    </div>
  );
};
const Home = () => {
  const [filteredMunicipality, setFilteredMunicipality] = useState(null);

  const applyMunicipalityFilters = (municipality) => {
    setFilteredMunicipality(municipality);
  };

  return (
    <div className="flex flex-col w-screen min-h-screen bg-gradient-to-b from-custom-green1 via-custom-green2 to-custom-green4 justify-between">
      <NavBar />
      <div className="flex-grow">
        <OffersHeader applyFilters={applyMunicipalityFilters} />
        <OffersContainer filteredMunicipality={filteredMunicipality} />
      </div>
      <Footer />
    </div>
  );
};


export default Home;
