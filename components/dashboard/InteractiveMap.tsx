'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Location } from '@/app/dashboard/page';

interface InteractiveMapProps {
  selectedLocation: Location | null;
  onLocationSelect: (location: Location) => void;
}

function InteractiveMapComponent({ selectedLocation, onLocationSelect }: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || mapRef.current === null || mapInstanceRef.current !== null) {
      return;
    }

    const initializeMap = async () => {
      try {
        // Dynamic import of Leaflet only on client side
        const L = await import('leaflet');
        await import('leaflet/dist/leaflet.css');
        
        // Fix for default markers in Leaflet with Next.js
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        });

        // Check if container is already initialized
        if (mapRef.current && !(mapRef.current as any)._leaflet_id) {
          mapInstanceRef.current = L.map(mapRef.current, {
            center: [39.8283, -98.5795],
            zoom: 4,
            zoomControl: true,
          });

          // Add tile layer
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
          }).addTo(mapInstanceRef.current);

          // Add click handler
          mapInstanceRef.current.on('click', async (e: any) => {
            const { lat, lng } = e.latlng;
            
            try {
              // Reverse geocoding to get address
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
              );
              const data = await response.json();
              const address = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
              
              onLocationSelect({ lat, lng, address });
            } catch (error) {
              console.error('Reverse geocoding failed:', error);
              onLocationSelect({ lat, lng });
            }
          });

          setIsMapReady(true);
        }
      } catch (error) {
        console.error('Map initialization failed:', error);
      }
    };

    initializeMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        setIsMapReady(false);
      }
    };
  }, [isClient, onLocationSelect]);

  useEffect(() => {
    if (mapInstanceRef.current && selectedLocation && isMapReady) {
      // Dynamic import of Leaflet for marker operations
      import('leaflet').then((L) => {
        // Remove existing marker
        if (markerRef.current) {
          mapInstanceRef.current.removeLayer(markerRef.current);
        }

        // Add new marker
        markerRef.current = L.marker([selectedLocation.lat, selectedLocation.lng])
          .addTo(mapInstanceRef.current)
          .bindPopup(
            selectedLocation.address || `${selectedLocation.lat.toFixed(4)}, ${selectedLocation.lng.toFixed(4)}`
          )
          .openPopup();

        // Center map on marker
        mapInstanceRef.current.setView([selectedLocation.lat, selectedLocation.lng], 10);
      });
    }
  }, [selectedLocation, isMapReady]);

  if (!isClient) {
    return (
      <div className="relative w-full h-full">
        <div
          className="w-full h-full rounded-lg overflow-hidden border border-white/10 flex items-center justify-center"
          style={{ minHeight: '300px' }}
        >
          <div className="text-white">Loading map...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div
        ref={mapRef}
        className="w-full h-full rounded-lg overflow-hidden border border-white/10"
        style={{ minHeight: '300px' }}
      />
      {!isMapReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800/50 rounded-lg">
          <div className="text-white">Loading map...</div>
        </div>
      )}
    </div>
  );
}

// Export with dynamic import to avoid SSR issues
export default dynamic(() => Promise.resolve(InteractiveMapComponent), {
  ssr: false,
  loading: () => (
    <div className="relative w-full h-full">
      <div
        className="w-full h-full rounded-lg overflow-hidden border border-white/10 flex items-center justify-center"
        style={{ minHeight: '300px' }}
      >
        <div className="text-white">Loading map...</div>
      </div>
    </div>
  ),
});