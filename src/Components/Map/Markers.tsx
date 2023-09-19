import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { ParisCoord } from "./MapSummary";

export default function Markers() {
  return (
    <>
      <Marker position={ParisCoord}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </>
  );
}
