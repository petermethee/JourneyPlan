import React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  SVGOverlay,
} from "react-leaflet";
import { ParisCoord } from "./MapSummary";
import { AccomodationMarker } from "../../assets/AccomodationMarker";

export default function Markers() {
  return (
    <>
      <Marker
        riseOnHover
        riseOffset={10}
        position={ParisCoord}
        icon={AccomodationMarker}
      >
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </>
  );
}
