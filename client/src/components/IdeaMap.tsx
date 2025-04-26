import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Idea } from '@shared/schema';

// Custom marker icon setup
const getCustomIcon = (color = '#7c3aed') => {
  return L.divIcon({
    className: 'custom-marker-icon',
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <i class="fas fa-building" style="color: white; font-size: 12px;"></i>
      </div>
      <div style="
        position: absolute;
        bottom: -8px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-top: 10px solid ${color};
        filter: drop-shadow(0 4px 3px rgba(0, 0, 0, 0.1));
      "></div>
    `,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -35]
  });
};

// Component to handle auto-panning to marker
function AutoPanToMarker({ position }: { position: [number, number] }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(position, map.getZoom(), {
      animate: true,
      duration: 1
    });
  }, [map, position[0], position[1]]);
  
  return null;
}

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
  
  // Get a custom marker icon for this startup
  const customIcon = getCustomIcon('#7c3aed'); // Using purple color
  
  return (
    <div style={{ height: '300px' }}>
      <MapContainer 
        center={position} 
        zoom={10} 
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          key="tiles"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <AutoPanToMarker position={position} />
        
        <Marker position={position} icon={customIcon}>
          <Popup>
            <div className="text-sm py-1">
              <div className="font-bold text-primary mb-1">{idea.name}</div>
              <div className="flex items-center gap-1 text-sm">
                <i className="fas fa-map-marker-alt text-secondary text-xs"></i>
                <span>{idea.city || 'Headquarters'}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1 font-mono">
                {position[0].toFixed(4)}, {position[1].toFixed(4)}
              </div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}