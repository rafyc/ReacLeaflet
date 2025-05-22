
import React, { useRef, useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, useScroll } from "motion/react";
import { FixedSizeList as List } from "react-window";
import { Typography } from "@mui/material";
import { booleanPointInPolygon, point, polygon } from "@turf/turf";
import L from "leaflet";
import markers from "../data/markers";
import { geojsonData } from "../data/geojsonData";

const RenderList = ({ map, markerRef, clusterRef, width }) => {
    const scrollableRef = useRef(null);
    const { scrollYProgress } = useScroll({ container: scrollableRef });
    return (
        <div style={{ position: "relative", height: 200, width }}>
            <motion.div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    backgroundColor: "#cb3968",
                    originX: 0,
                    scaleX: scrollYProgress,
                    zIndex: 100,
                }}
            />

            <List
                height={200}
                width={width}
                itemCount={markers.length}
                itemSize={35}
                outerRef={scrollableRef}
                itemData={{ markers, map, markerRef, clusterRef }}
                children={Row}
            />
        </div>
    )
};
const Row = ({ index, style, data }) => {
    const [isInside, setIsInside] = useState(null);
    const { map, markers } = data
    const marker = markers[index];

    useEffect(() => {
        const extractpoly = geojsonData.features[0].geometry.coordinates[0];
        const poly = polygon([extractpoly]);

        const pt = point([marker.geocode[1], marker.geocode[0]]);

        setIsInside(booleanPointInPolygon(pt, poly));


    }, [marker.geocode])
    const handleClick = () => {
        if (map) {
            map.flyTo(marker.geocode, 18);
        }

        const onMoveEnd = () => {
            map.eachLayer((layer) => {
                if (
                    layer instanceof L.Marker &&
                    layer.getLatLng().lat === marker.geocode[0] &&
                    layer.getLatLng().lng === marker.geocode[1]
                ) {
                    layer.openPopup();
                }
            });
            map.off('moveend', onMoveEnd);
        };

        map.on('moveend', onMoveEnd);

    };
    return (
        <div className={index % 2 ? 'ListItemOdd' : 'ListItemEven'} style={style} onClick={handleClick}>
            {marker.popUp} |{" "} {isInside ? <Typography fontWeight={700}>&nbsp;Dans la zone</Typography> : <Typography color='warning' fontWeight={700}>&nbsp;En dehors de la zone</Typography>}
        </div>
    )
}


export default RenderList;
