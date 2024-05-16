import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

const Map = ({ isMapOpen, closeMap }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [locations, setLocations] = useState([]);
  const mapRef = useRef(null);

  const markerIcon = new L.Icon({
    iconUrl: require('../../Assets/marcador.png'),
    iconSize: [30, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
  });

  useEffect(() => {
    if (isMapOpen) {
      // Obtener la ubicación del usuario
      navigator.geolocation.getCurrentPosition(
        function(position) {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        function() {
          alert("No se pudo obtener tu ubicación");
        }
      );

      // Obtener las ubicaciones de las ofertas del backend
      axios.get('http://localhost:8000/get_offers')
        .then(response => {
          const offers = response.data;
          const offerLocations = offers
            .map(offer => {
              let coords = offer.coordinates.split(',');
              if (coords.length === 2) {
                return {
                  lat: parseFloat(coords[0]),
                  lng: parseFloat(coords[1]),
                  title: offer.name_offer,
                  imageUrl: offer.image_url,
                  offerId: offer.id_offer
                };
              } else {
                return null;
              }
            })
            .filter(location => location !== null); // Filtrar ubicaciones válidas
          setLocations(offerLocations);
        })
        .catch(error => {
          console.error('Error fetching offers:', error);
        });
    }
  }, [isMapOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mapRef.current && !mapRef.current.contains(event.target)) {
        closeMap();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeMap]);

  return (
    <div className={`fixed inset-0 bg-white bg-opacity-75 z-50 flex justify-center items-center ${isMapOpen ? 'block' : 'hidden'}`} onClick={e => e.stopPropagation()} >
      <div className="relative w-full max-w-3xl h-2/3 bg-white rounded-lg shadow-xl" ref={mapRef}>
        <button className="absolute top-3 right-3 text-lg" onClick={closeMap}>X</button>
        {userLocation && (
          <MapContainer center={userLocation} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {locations.map((location, index) => (
              <Marker 
                key={index} 
                position={[location.lat, location.lng]} 
                icon={markerIcon}
              >
                <Popup>
                  <div>
                    <h3>{location.title}</h3>
                    <a href={`/offer/${location.offerId}`} target="_blank" rel="noopener noreferrer">
                      <img src={location.imageUrl} alt={location.title} style={{ width: '100px', height: 'auto' }} />
                    </a>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>
    </div>
  );
};

export default Map;
