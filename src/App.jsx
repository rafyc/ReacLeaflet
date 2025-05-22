import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet'
import './App.css'
import 'leaflet/dist/leaflet.css'
import MarkerClusterGroup from 'react-leaflet-cluster'
import { Icon } from 'leaflet'
import emplacementIcon from './assets/emplacement.png';
import 'leaflet-control-geocoder'
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import { polygon } from '@turf/turf';
import { centerOfMass } from "@turf/center-of-mass";
import AutoSizer from "react-virtualized-auto-sizer";
import CustomBox from './assets/components/customBox';
import { Typography } from '@mui/material';
import { css } from '@emotion/react'
import markers from './assets/data/markers.js';
import { geojsonData } from './assets/data/geojsonData.js';
import RenderList from "./assets/components/renderList.jsx";
import MapContext from './assets/components/MapContext.js';
import LeafletControlGeocoder from './assets/components/LeafletControlGeocoder';
/** @jsxImportSource @emotion/react */


const customIcons = new Icon({
    iconUrl: emplacementIcon,
    iconSize: [30, 30]
})



function App() {
    const [mapInstance, setMapInstance] = useState(null);
    const [centerMass, setCenterMass] = useState(null)
    const clusterRef = useRef(null);
    const markerRef = useRef([]);

    useEffect(() => {
        const extractpoly = geojsonData.features[0].geometry.coordinates[0];
        const poly = polygon([extractpoly]);
        const centerMass = centerOfMass(poly)
        const coordinateCenterMass = [centerMass.geometry.coordinates[1], centerMass.geometry.coordinates[0]];
        console.log('coordinateCenterMass', coordinateCenterMass);
        setCenterMass(coordinateCenterMass)
    }, [])

    return (
        <CustomBox>
            <div id='header'>
                <CustomBox
                    css={(theme) => css`
                padding: 32px;
                box-shadow: 0px 4px 20px black;
                position: relative;
                z-index: 1;
                background-color: ${theme.palette.grey[700]};
                color: ${theme.palette.primary.main};
              `}
                >
                    <Typography align='center' variant="h4" fontWeight={700} color="text.secondary">Feuille de route - Autoformation React + Leaflet</Typography>
                </CustomBox>
                <AutoSizer disableHeight>
                    {({ width }) => (
                        <RenderList
                            width={width}
                            map={mapInstance}
                            markerRef={markerRef}
                            clusterRef={clusterRef}
                        />
                    )}
                </AutoSizer>
            </div>
            <MapContainer center={[44.83235168457031, -0.5929398536682129]} zoom={11}>
                <MapContext onMapReady={setMapInstance} />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MarkerClusterGroup
                    chunkedLoading
                    disableClusteringAtZoom={18}
                    ref={clusterRef}>
                    {markers.slice(0, -1).map((mark, ind) => (
                        <Marker
                            ref={(ref) => markerRef.current[ind] = ref}
                            key={ind}
                            position={mark.geocode}
                            icon={customIcons}>
                            <Popup>{mark.popUp}</Popup>
                        </Marker>
                    ))}
                </MarkerClusterGroup>

                <Marker position={markers[markers.length - 1].geocode} icon={customIcons}>
                    <Popup>{markers[markers.length - 1].popUp}</Popup>
                </Marker>

                {centerMass && (
                    <Marker position={centerMass} >
                        <Popup>Centre de masse</Popup>
                    </Marker>
                )}
                <LeafletControlGeocoder />
                <GeoJSON data={geojsonData} />
            </MapContainer>
        </CustomBox>
    )
}


export default App
