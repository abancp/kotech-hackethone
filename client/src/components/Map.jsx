import React, { useState, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
  Circle
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { point } from 'leaflet';

// Leaflet default icons
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// ✅ Custom icon for live location (blue)
const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Component to handle map click
const LocationSelector = ({ onSelect }) => {
  useMapEvents({
    click(e) {
      onSelect(e.latlng);
    },
  });
  return null;
};

// Component to track live location
const LiveLocation = ({ setLivePosition }) => {
  const map = useMap();

  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn('Geolocation is not supported');
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const latlng = [latitude, longitude];
        setLivePosition(latlng);
        map.setView(latlng, 15);
      },
      (err) => console.error('Geolocation error:', err),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [map, setLivePosition]);

  return null;
};

const KottakkalMap = ({ cb, pointer }) => {
  const defaultPosition = [10.99903785181553, 75.99184158408261];
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [livePosition, setLivePosition] = useState(null);

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


      <LocationSelector
        onSelect={(latlng) => {
          cb([latlng.lat, latlng.lng]);
          setSelectedPosition([latlng.lat, latlng.lng]);
        }}
      />

      {selectedPosition && (
        <Marker position={selectedPosition} icon={greenIcon}>
          <Popup>
            📌 Selected Location
            <br />
            Lat: {selectedPosition[0].toFixed(5)}
            <br />
            Lng: {selectedPosition[1].toFixed(5)}
          </Popup>
        </Marker>
      )}
      {
        (new Date().getHours() === 16 && new Date().getMinutes() >= 45) || (new Date().getHours() === 17 && new Date().getMinutes() <= 30) &&
        <Circle
          center={[10.99869, 75.99169]}
          radius={150}
          pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.3 }}
        >
          <Popup>
            {"School Rush 4:45 to 5:00"}
          </Popup>

        </Circle>
      }
      {
        (new Date().getHours() === 16 && new Date().getMinutes() >= 45) || (new Date().getHours() === 17 && new Date().getMinutes() <= 30) &&

        <Circle
          center={[10.99715, 75.98680]}
          radius={150}
          pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.3 }}

        >
          <Popup>
            School Rush 4:45 to 5:00
          </Popup>

        </Circle>}
      {
        (new Date().getHours() === 16 && new Date().getMinutes() >= 45) || (new Date().getHours() === 17 && new Date().getMinutes() <= 30) &&

        <Circle
          center={[11.00099, 76.00363]}
          radius={150}
          pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.3 }}

        >
          <Popup>
            School Rush 4:45 to 5:00
          </Popup>

        </Circle>
      }


      <LiveLocation setLivePosition={setLivePosition} />

      {livePosition && (
        <Marker position={livePosition} icon={blueIcon}>
          <Popup>
            📍 Your Live Location
            <br />
            Lat: {livePosition[0].toFixed(5)}
            <br />
            Lng: {livePosition[1].toFixed(5)}
          </Popup>
        </Marker>
      )}
      {console.log(pointer)}
      {
        pointer?.map((p) => (
          <Marker position={p.place} icon={redIcon}>
            <Popup>
              {p.type}
              <br />
              Lat: {p.place[0].toFixed(5)}
              <br />
              Lng: {p.place[1].toFixed(5)}
            </Popup>
          </Marker>
        ))
      }
    </MapContainer>
  );
};

export default KottakkalMap;
