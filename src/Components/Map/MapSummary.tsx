import { useEffect, useState } from "react";
import styles from "./MapSummary.module.css";
import PlanningSheets from "../Planning/Calendar/PlanningSheets/PlanningSheets";
import TimeLineSummary from "./TimeLineSummary";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { MenuItem, TextField } from "@mui/material";
import { useResizeDetector } from "react-resize-detector";

let timeout: NodeJS.Timeout;
export default function MapSummary() {
  const {
    width: mapWidth,
    height: mapHeight,
    ref: mapWrapperRef,
  } = useResizeDetector();

  const tileProviders = [
    {
      name: "Sobre",
      maxZomm: 19,
      url: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
    },
    {
      name: "Détaillé niveau 1",
      maxZomm: 20,
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
    },
    {
      name: "Détaillé niveau 2",
      maxZomm: 20,
      url: "https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png",
    },
    {
      name: "Détaillées niveau 3",
      maxZomm: 20,
      url: "https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png",
    },
    /*    {
      name: "Old school",
      maxZomm: 20,
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}",
    }, */

    {
      name: "Satellite",
      maxZomm: 20,
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    },

    {
      name: "OpenStreetMap",
      maxZomm: 19,
      url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    },
    {
      name: "Aéroport",
      maxZomm: 18,
      url: "https://tileserver.memomaps.de/tilegen/{z}/{x}/{y}.png",
    },
    /*     {
      name: "terrain",
      maxZomm: 20,
      url: "https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}.png",
    }, */
  ];
  const layers = [
    {
      name: "Aucun",
      url: "",
    },
    {
      name: "Train",
      url: "https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png",
    },
    {
      name: "Vélo",
      url: "https://tile.waymarkedtrails.org/cycling/{z}/{x}/{y}.png",
    },
    {
      name: "Randonnées",
      url: "https://tile.waymarkedtrails.org/hiking/{z}/{x}/{y}.png",
    },
  ];
  const [urlProvider, setUrlProvider] = useState(tileProviders[0].url);
  const [layerUrl, setLayerUrl] = useState(layers[0].url);
  const [drawMap, setDrawMap] = useState(false);

  useEffect(() => {
    setDrawMap(false);
    timeout = setTimeout(() => setDrawMap(true), 500);
    return () => {
      timeout && clearTimeout(timeout);
    };
  }, [mapWidth, mapHeight]);

  return (
    <div className={styles.container}>
      <TimeLineSummary />
      <div className={styles.rightPart}>
        <PlanningSheets />
        <TextField
          select
          onChange={(e) => setUrlProvider(e.target.value)}
          value={urlProvider}
        >
          {tileProviders.map((provider) => (
            <MenuItem key={provider.name} value={provider.url}>
              {provider.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          onChange={(e) => setLayerUrl(e.target.value)}
          value={layerUrl}
        >
          {layers.map((provider) => (
            <MenuItem key={provider.name} value={provider.url}>
              {provider.name}
            </MenuItem>
          ))}
        </TextField>

        <div className={styles.mapWrapper} ref={mapWrapperRef}>
          {drawMap && (
            <MapContainer
              center={[51.505, -0.09]}
              zoom={13}
              scrollWheelZoom={true}
              style={{
                height: mapHeight ?? "50px",
                width: mapWidth ?? "100px",
              }}
            >
              <TileLayer url={urlProvider} />
              <TileLayer url={layerUrl} />
              <Marker position={[51.505, -0.09]}>
                <Popup>
                  A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
              </Marker>
            </MapContainer>
          )}
        </div>
      </div>
    </div>
  );
}
