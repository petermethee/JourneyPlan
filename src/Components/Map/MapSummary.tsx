import React, { useState } from "react";
import styles from "./MapSummary.module.css";
import PlanningSheets from "../Planning/Calendar/PlanningSheets/PlanningSheets";
import TimeLineSummary from "./TimeLineSummary";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default function MapSummary() {
  const tileProviders = {
    toner: "https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}.png",
    tonerLite:
      "https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}.png",
    watercolor:
      "https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg",
    terrain:
      "https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}.png",
  };
  const [tileProvider, setTileProvider] = useState();
  return (
    <div className={styles.container}>
      <TimeLineSummary />
      <div>
        <PlanningSheets />

        <MapContainer
          center={[51.505, -0.09]}
          zoom={13}
          scrollWheelZoom={true}
          className={styles.mapContainer}
        >
          <TileLayer
            // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            url="https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg"
            // url="https://{s}.basemaps.cartocdn.com/voyager/{z}/{x}/{y}{r}.png"
          />
          <Marker position={[51.505, -0.09]}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}
