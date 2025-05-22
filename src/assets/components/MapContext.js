import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

const MapContext = ({ onMapReady }) => {
  const map = useMap();
  useEffect(() => {
    if (map) {
      onMapReady(map);
    }
  }, [map, onMapReady]);
  return null;
};

export default MapContext;
