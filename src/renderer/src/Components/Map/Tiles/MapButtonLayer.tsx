import React, { useEffect, useState } from "react";
import { ButtonBase } from "@mui/material";
import { MapContainer, TileLayer } from "react-leaflet";
import { LatLng, Map } from "leaflet";
import { ParisCoord } from "../MapSummary";
import styles from "./MapButtonLayer.module.css";

export default function MapButtonLayer({
  index,
  mapSelectedIndex,
  showSuggestions,
  mapItem,
  position,
  zoom,
  setSelectedIndex,
}: {
  index: number;
  mapSelectedIndex: number;
  showSuggestions: boolean;
  mapItem: {
    name: string;
    maxZoom: number;
    url: string;
  };
  position: LatLng;
  zoom: number;
  setSelectedIndex: () => void;
}) {
  const [map, setMap] = useState<Map | null>(null);

  useEffect(() => {
    map?.setView(position);
  }, [position, map]);

  useEffect(() => {
    map?.setZoom(zoom);
  }, [zoom, map]);

  return (
    <div
      className={`${styles.mapButton} ${
        mapSelectedIndex === index && styles.selectedMap
      } `}
      style={{
        right: showSuggestions ? 50 + index * 110 : -125,
        opacity: showSuggestions ? 1 : 0,
        transition: `all 100ms ease 0ms, right 200ms ease ${
          index * 40
        }ms, opacity 200ms ease ${index * 40}ms `,
      }}
    >
      <ButtonBase
        sx={{
          position: "absolute",
          height: "100%",
          width: "100%",
          zIndex: "1000 ",
        }}
        onClick={setSelectedIndex}
      />

      <MapContainer
        center={ParisCoord}
        zoom={5}
        scrollWheelZoom={false}
        className={styles.mapContainer}
        zoomControl={false}
        attributionControl={false}
        ref={setMap as any}
      >
        <TileLayer url={mapItem.url} maxZoom={mapItem.maxZoom} />
      </MapContainer>
      <span className={styles.mapName}>{mapItem.name}</span>
    </div>
  );
}
