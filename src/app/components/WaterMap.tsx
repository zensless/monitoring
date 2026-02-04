import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';

export interface MonitoringLocation {
  id: string;
  name: string;
  position: [number, number];
  ph: number;
  ec: number;
  tds: number;
}

interface WaterMapProps {
  locations: MonitoringLocation[];
  onLocationSelect?: (location: MonitoringLocation) => void;
}

const getStatusColor = (ph: number) => {
  if (ph >= 6.5 && ph <= 8.5) return '#22c55e'; // green
  if (ph >= 6.0 && ph <= 9.0) return '#eab308'; // yellow
  return '#ef4444'; // red
};

const getStatusText = (ph: number) => {
  if (ph >= 6.5 && ph <= 8.5) return 'Baik';
  if (ph >= 6.0 && ph <= 9.0) return 'Cukup';
  return 'Buruk';
};

const getStatusColorClass = (ph: number) => {
  if (ph >= 6.5 && ph <= 8.5) return 'text-green-600';
  if (ph >= 6.0 && ph <= 9.0) return 'text-yellow-600';
  return 'text-red-600';
};

export function WaterMap({ locations, onLocationSelect }: WaterMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current, {
      center: [-6.9111, 107.7771],
      zoom: 14,
      scrollWheelZoom: true,
    });

    mapInstanceRef.current = map;

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || locations.length === 0) return;

    const map = mapInstanceRef.current;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Add markers for each location
    const markers: L.Marker[] = [];

    locations.forEach((location) => {
      const color = getStatusColor(location.ph);
      const stationNumber = location.id.replace('TA', '');

      // Create custom icon
      const icon = L.divIcon({
        className: 'custom-div-icon',
        html: `
          <div style="
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background-color: ${color};
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            color: white;
            font-size: 12px;
          ">
            ${stationNumber}
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -15],
      });

      const marker = L.marker(location.position as [number, number], { icon })
        .addTo(map)
        .bindPopup(`
          <div style="padding: 8px; min-width: 200px;">
            <h4 style="font-weight: 600; font-size: 16px; margin-bottom: 8px;">${location.name}</h4>
            <div style="display: flex; flex-direction: column; gap: 4px; font-size: 14px;">
              <div style="display: flex; justify-content: space-between; gap: 16px;">
                <span style="color: #6b7280;">pH:</span>
                <span style="font-weight: 500;">
                  ${location.ph.toFixed(1)} 
                  <span style="color: ${color};">(${getStatusText(location.ph)})</span>
                </span>
              </div>
              <div style="display: flex; justify-content: space-between; gap: 16px;">
                <span style="color: #6b7280;">EC:</span>
                <span style="font-weight: 500;">${location.ec.toFixed(2)} mS/cm</span>
              </div>
              <div style="display: flex; justify-content: space-between; gap: 16px;">
                <span style="color: #6b7280;">TDS:</span>
                <span style="font-weight: 500;">${location.tds} ppm</span>
              </div>
            </div>
            <div style="padding-top: 8px; margin-top: 8px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
              Koordinat: ${location.position[0].toFixed(6)}, ${location.position[1].toFixed(6)}
            </div>
          </div>
        `);

      marker.on('click', () => {
        setSelectedId(location.id);
        if (onLocationSelect) {
          onLocationSelect(location);
        }
      });

      markers.push(marker);
    });

    // Fit bounds to show all markers
    if (markers.length > 0) {
      const group = L.featureGroup(markers);
      map.fitBounds(group.getBounds(), { padding: [50, 50] });
    }
  }, [locations, onLocationSelect]);

  return (
    <div className="relative w-full h-[500px] rounded-lg overflow-hidden border shadow-lg">
      {/* Legend overlay */}
      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md z-[1000]">
        <h4 className="font-semibold text-sm mb-2">Status Kualitas Air</h4>
        <div className="text-xs space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Baik (pH 6,5-8,5)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span>Cukup (pH 6,0-9,0)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Buruk</span>
          </div>
        </div>
      </div>

      {/* Map title overlay */}
      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg px-4 py-2 shadow-md z-[1000]">
        <h3 className="font-semibold text-sm">Cileles, Jatinangor</h3>
        <p className="text-xs text-muted-foreground">Stasiun Pemantauan Air</p>
      </div>

      {/* Map container */}
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}
