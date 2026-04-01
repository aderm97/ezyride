'use client';
import { useEffect, useRef } from 'react';
import { MockMap } from './MockMap';

const MBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const HAS_VALID_TOKEN = MBOX_TOKEN && MBOX_TOKEN.startsWith('pk.');

// Lazy-load Mapbox only when we have a valid public token
let MapboxMap: any = null;
let MapboxMarker: any = null;
let MapboxSource: any = null;
let MapboxLayer: any = null;

if (HAS_VALID_TOKEN) {
  try {
    const rmgl = require('react-map-gl/mapbox');
    MapboxMap = rmgl.default;
    MapboxMarker = rmgl.Marker;
    MapboxSource = rmgl.Source;
    MapboxLayer = rmgl.Layer;
    require('mapbox-gl/dist/mapbox-gl.css');
  } catch {
    // Mapbox not available, will fall back to MockMap
  }
}

interface LiveMapProps {
  pickupLat?: number;
  pickupLng?: number;
  dropoffLat?: number;
  dropoffLng?: number;
  status?: string;
}

export function LiveMap({ pickupLat, dropoffLat, pickupLng, dropoffLng, status }: LiveMapProps) {
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (!HAS_VALID_TOKEN || !mapRef.current) return;
    if (pickupLat && pickupLng && dropoffLat && dropoffLng) {
      const minLng = Math.min(pickupLng, dropoffLng);
      const minLat = Math.min(pickupLat, dropoffLat);
      const maxLng = Math.max(pickupLng, dropoffLng);
      const maxLat = Math.max(pickupLat, dropoffLat);

      mapRef.current.fitBounds(
        [[minLng, minLat], [maxLng, maxLat]],
        { padding: 70, duration: 1500 }
      );
    } else if (pickupLat && pickupLng) {
       mapRef.current.flyTo({ center: [pickupLng, pickupLat], zoom: 14, duration: 1000 });
    }
  }, [pickupLat, pickupLng, dropoffLat, dropoffLng]);

  // Fall back to MockMap if no valid public Mapbox token
  if (!HAS_VALID_TOKEN || !MapboxMap) {
    return <MockMap pickupLat={pickupLat} pickupLng={pickupLng} dropoffLat={dropoffLat} dropoffLng={dropoffLng} status={status} />;
  }

  const defaultCenter = pickupLat && pickupLng 
    ? { longitude: pickupLng, latitude: pickupLat } 
    : { longitude: -0.1278, latitude: 51.5074 };

  const routeGeoJSON = (pickupLat && dropoffLat && pickupLng && dropoffLng) ? {
    type: 'Feature' as const,
    properties: {},
    geometry: {
      type: 'LineString' as const,
      coordinates: [
        [pickupLng, pickupLat],
        [dropoffLng, dropoffLat]
      ]
    }
  } : null;

  return (
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 mix-blend-color z-10 pointer-events-none opacity-50 bg-slate-900" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10 pointer-events-none" />
      
      <MapboxMap
        ref={mapRef}
        mapboxAccessToken={MBOX_TOKEN}
        initialViewState={{
          longitude: defaultCenter.longitude,
          latitude: defaultCenter.latitude,
          zoom: 13
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        attributionControl={false}
      >
        {pickupLat && pickupLng && (
          <MapboxMarker longitude={pickupLng} latitude={pickupLat} anchor="bottom">
            <div className="flex flex-col items-center group cursor-pointer">
              <div className="bg-cta text-white px-3 py-1 rounded-full font-bold shadow-lg text-xs transform -translate-y-2 group-hover:scale-110 transition-transform">Pickup</div>
              <div className="w-5 h-5 bg-cta rounded-full mx-auto border-4 border-white shadow-md relative">
                <div className="absolute inset-0 rounded-full animate-ping bg-cta opacity-75"></div>
              </div>
            </div>
          </MapboxMarker>
        )}

        {dropoffLat && dropoffLng && (
          <MapboxMarker longitude={dropoffLng} latitude={dropoffLat} anchor="bottom">
            <div className="flex flex-col items-center group cursor-pointer">
              <div className="bg-rose-500 text-white px-3 py-1 rounded-full font-bold shadow-lg text-xs transform -translate-y-2 group-hover:scale-110 transition-transform">Destination</div>
              <div className="w-5 h-5 bg-rose-500 rounded-full mx-auto border-4 border-white shadow-md" />
            </div>
          </MapboxMarker>
        )}

        {routeGeoJSON && (
          <MapboxSource id="route-source" type="geojson" data={routeGeoJSON}>
            <MapboxLayer 
              id="route-line"
              type="line"
              paint={{
                'line-color': '#0ea5e9',
                'line-width': 4,
                'line-dasharray': [2, 2]
              }}
            />
          </MapboxSource>
        )}
      </MapboxMap>
    </div>
  );
}
