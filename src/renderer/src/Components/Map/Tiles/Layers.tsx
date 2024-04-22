import { useCallback, useEffect, useState } from "react";
import { MapDetails, MapTypes } from "./TileProviders";
import LayersRoundedIcon from "@mui/icons-material/LayersRounded";
import DynamicFeedRoundedIcon from "@mui/icons-material/DynamicFeedRounded";
import { IconButton } from "@mui/material";
import { Map } from "leaflet";
import MapButtonLayer from "./MapButtonLayer";
import styles from "./Layers.module.css";

export default function Layers({
  setMapTypeIndex,
  setMapDetailIndex,
  mapTypeIndex,
  mapDetailIndex,
  map,
}: {
  setMapTypeIndex: (id: number) => void;
  setMapDetailIndex: (id: number) => void;
  mapTypeIndex: number;
  mapDetailIndex: number;
  map: Map;
}) {
  const [position, setPosition] = useState(() => map.getCenter());
  const [zoom, setZoom] = useState(() => map.getZoom());

  const [showMapTypesSuggestions, setShowMapTypesSuggestions] = useState(false);
  const [showMapDetailsSuggestions, setShowMapDetailsSuggestions] =
    useState(false);

  /*   const onClick = useCallback(() => {
    map.setView(ParisCoord, 13);
  }, [map]); */

  const onMove = useCallback(() => {
    setPosition(map.getCenter());
  }, [map]);

  const onZoom = useCallback(() => {
    setZoom(map.getZoom());
  }, [map]);

  useEffect(() => {
    map.on("move", onMove);
    map.on("zoomend", onZoom);
    return () => {
      map.off("move", onMove);
      map.off("zoomend", onZoom);
    };
  }, [map, onMove, onZoom]);

  return (
    <>
      <div
        className={styles.mapTypeWrapper}
        onMouseLeave={() => setShowMapTypesSuggestions(false)}
        style={{
          width: showMapTypesSuggestions ? MapTypes.length * 110 + 50 : "auto",
        }}
      >
        {MapTypes.map((mapType, index) => (
          <MapButtonLayer
            index={index}
            mapItem={mapType}
            mapSelectedIndex={mapTypeIndex}
            setSelectedIndex={() => setMapTypeIndex(index)}
            showSuggestions={showMapTypesSuggestions}
            position={position}
            zoom={zoom}
            key={mapType.name}
          />
        ))}

        <IconButton
          sx={{
            boxShadow: "0 0 16px 0 #00000094",
            backgroundColor: "white",
          }}
          onMouseEnter={() => setShowMapTypesSuggestions(true)}
        >
          <LayersRoundedIcon />
        </IconButton>
      </div>

      <div
        className={styles.mapDetailWrapper}
        onMouseLeave={() => setShowMapDetailsSuggestions(false)}
        style={{
          width: showMapDetailsSuggestions
            ? MapDetails.length * 110 + 50
            : "auto",
        }}
      >
        {MapDetails.map((mapDetails, index) => (
          <MapButtonLayer
            index={index}
            mapItem={mapDetails}
            mapSelectedIndex={mapDetailIndex}
            setSelectedIndex={() => setMapDetailIndex(index)}
            showSuggestions={showMapDetailsSuggestions}
            position={position}
            zoom={zoom}
            key={mapDetails.name}
          />
        ))}

        <IconButton
          sx={{
            boxShadow: "0 0 16px 0 #00000094",
            backgroundColor: "white",
          }}
          onMouseEnter={() => setShowMapDetailsSuggestions(true)}
        >
          <DynamicFeedRoundedIcon />
        </IconButton>
      </div>
    </>
  );
}
