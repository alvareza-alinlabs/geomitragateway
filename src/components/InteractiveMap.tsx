import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// @ts-ignore
import icon from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapLocationSelectorProps {
  position: { lat: number, lng: number };
  onPositionChange: (pos: { lat: number, lng: number }) => void;
}

function LocationMarker({ position, onPositionChange }: { position: { lat: number, lng: number }, onPositionChange: (pos: { lat: number, lng: number }) => void }) {
  const map = useMap();
  
  useMapEvents({
    click(e) {
      onPositionChange({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });

  useEffect(() => {
    if (position) {
      const lat = Number(position.lat);
      const lng = Number(position.lng);
      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        try {
          map.flyTo([lat, lng], 18, { animate: true, duration: 1 });
        } catch (e) {
          console.error("Leaflet flyTo error:", e);
        }
      }
    }
  }, [position, map]);

  if (!position) return null;
  const lat = Number(position.lat);
  const lng = Number(position.lng);
  
  return (!Number.isFinite(lat) || !Number.isFinite(lng)) ? null : (
    <Marker position={[lat, lng]} />
  );
}

export default function InteractiveMap({ position, onPositionChange }: MapLocationSelectorProps) {
  const defaultCenter: [number, number] = [-6.200000, 106.816666]; // Jakarta default
  let center = defaultCenter;
  if (position) {
    const lat = Number(position.lat);
    const lng = Number(position.lng);
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      center = [lat, lng];
    }
  }
  
  return (
    <div className="w-full h-full relative z-0">
      <MapContainer 
        center={center} 
        zoom={18} 
        scrollWheelZoom={true} 
        dragging={true}
        zoomControl={false}
        attributionControl={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={position} onPositionChange={onPositionChange} />
      </MapContainer>
    </div>
  );
}
