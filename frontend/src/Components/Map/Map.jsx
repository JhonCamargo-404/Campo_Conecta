import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Map = ({ isMapOpen, closeMap }) => {
  const [userLocation, setUserLocation] = useState(null);
  const mapRef = useRef(null);

  const markerIcon = new L.Icon({
    iconUrl: require('../../Assets/marcador.png'),
    iconSize: [30, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
  });

  const locations = [
    { lat: 40.712776, lng: -74.005974, title: "New York" },
    { lat: 34.052235, lng: -118.243683, title: "Los Angeles" },
    { lat: 41.878113, lng: -87.629799, title: "Chicago" }
  ];

  useEffect(() => {
    if (isMapOpen) {
      navigator.geolocation.getCurrentPosition(
        function(position) {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        function() {
          alert("No se pudo obtener tu ubicación");
        }
      );
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
              <Marker key={index} position={[location.lat, location.lng]} icon={markerIcon}>
                <Popup>{location.title}</Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>
    </div>
  );
};

export default Map;
