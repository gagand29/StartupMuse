import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Idea } from '@shared/schema';

// Fix Leaflet icon issue in React
// This is a workaround for an issue with Leaflet icons in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface IdeaMapProps {
  idea: Idea;
}

export default function IdeaMap({ idea }: IdeaMapProps) {
  // Convert latitude and longitude to numbers with fallbacks
  const lat = parseFloat(idea.latitude || '0') || 37.7749; // Default to San Francisco
  const lng = parseFloat(idea.longitude || '0') || -122.4194;
  
  // Check if coordinates are valid
  const validCoords = !isNaN(lat) && !isNaN(lng) && 
    lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
  
  // Fallback to default if invalid
  const position: [number, number] = validCoords 
    ? [lat, lng] 
    : [37.7749, -122.4194]; // Default to San Francisco
  
  return (
    <div className="rounded-lg overflow-hidden border-2 border-border" style={{ height: '300px' }}>
      <MapContainer 
        center={position} 
        zoom={10} 
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            <div className="text-sm">
              <strong>{idea.name}</strong><br />
              {idea.city || 'Headquarters'}<br />
              <span className="text-xs text-muted-foreground">{position[0].toFixed(4)}, {position[1].toFixed(4)}</span>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}