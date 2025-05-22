import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-control-geocoder';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';

function LeafletControlGeocoder() {
  const map = useMap();
  useEffect(() => {
    const geocoderControl = L.Control.geocoder({
      query: "",
      placeholder: "Search here...",
      defaultMarkGeocode: true,
      geocoder: L.Control.Geocoder.nominatim()
    })
    geocoderControl.addTo(map);
    return () => {
      map.removeControl(geocoderControl);
    };
  }, [map]);
}

export default LeafletControlGeocoder
