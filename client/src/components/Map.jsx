import React, { useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icon issues in React
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Component to handle map clicks
const LocationSelector = ({ onSelect }) => {
  useMapEvents({
    click(e) {
      onSelect(e.latlng); // latlng is {lat: ..., lng: ...}
    },
  });
  return null;
};

const KottakkalMap = ({cb}) => {
  const defaultPosition = [10.99903785181553, 75.99184158408261];
  const [selectedPosition, setSelectedPosition] = useState(null);

  return (
    <MapContainer
      center={defaultPosition}
      zoom={15}
      style={{ height: '100vh', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      {/* Initial Marker */}
      <Marker position={defaultPosition}>
        <Popup>Kottakkal, Kerala</Popup>
      </Marker>

      {/* Click-to-select handler */}
      <LocationSelector
        onSelect={(latlng) => {
          console.log('Selected:', latlng);
          cb([latlng.lat, latlng.lng])
          setSelectedPosition([latlng.lat, latlng.lng]);
        }}
      />

      {/* Marker for clicked location */}
      {selectedPosition && (
        <Marker position={selectedPosition}>
          <Popup>
            Selected Location:
            <br />
            Lat: {selectedPosition[0].toFixed(5)},<br />
            Lng: {selectedPosition[1].toFixed(5)}
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default KottakkalMap;
