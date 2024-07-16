import React, { useRef, useEffect, useState } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";

export default function Map() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const tokyo = { lng: 2.294481, lat: 48.858372 };
  const [zoom] = useState(14);
  maptilersdk.config.apiKey = 'Czlrri2nbyZ5CTLnkHC0';

  useEffect(() => {
    if (map.current) return; // stops map from intializing more than once

    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.STREETS,
      center: [tokyo.lng, tokyo.lat],
      zoom: zoom
    });

  }, [tokyo.lng, tokyo.lat, zoom]);
  new maptilersdk.Marker({color: "#FF0000"})
  .setLngLat([2.294481,48.85837])
  .addTo(map.current);
  return (
      <div style={{
        position: 'relative',
        width: '100%',
        height: 'calc(100vh - 77px)'
      }}>
        <div ref={mapContainer} style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
        }} />
      </div>
    );
}