import { useEffect, useState } from "react";
import styles from "./MapSummary.module.css";
import PlanningSheets from "../Planning/Calendar/PlanningSheets/PlanningSheets";
import TimeLineSummary from "./TimeLineSummary";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useResizeDetector } from "react-resize-detector";
import { MapDetails, MapTypes, SatelliteExtansions } from "./TileProviders";
import Layers from "./Layers";

let timeout: NodeJS.Timeout;
export const ParisCoord: [number, number] = [48.8566, 2.3522];
export default function MapSummary() {
  const {
    width: mapWidth,
    height: mapHeight,
    ref: mapWrapperRef,
  } = useResizeDetector();

  const [mapTypeIndex, setMapTypeIndex] = useState(0);
  const [mapDetailIndex, setMapDetailIndex] = useState(0);
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

        <div className={styles.mapWrapper} ref={mapWrapperRef}>
          {drawMap && (
            <MapContainer
              center={ParisCoord}
              zoom={13}
              scrollWheelZoom
              style={{
                height: mapHeight ?? "50px",
                width: mapWidth ?? "100px",
              }}
              attributionControl={false}
            >
              <TileLayer
                url={MapTypes[mapTypeIndex].url}
                maxZoom={MapTypes[mapTypeIndex].maxZoom}
              />
              {mapDetailIndex !== 0 && (
                <TileLayer
                  url={MapDetails[mapDetailIndex].url}
                  maxZoom={MapDetails[mapDetailIndex].maxZoom}
                />
              )}
              {mapTypeIndex === 4 &&
                SatelliteExtansions.map((extansion) => (
                  <TileLayer url={extansion.url} maxZoom={extansion.maxZoom} />
                ))}
              <Marker position={ParisCoord}>
                <Popup>
                  A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
              </Marker>
            </MapContainer>
          )}
          <Layers
            mapDetailIndex={mapDetailIndex}
            mapTypeIndex={mapTypeIndex}
            setMapDetailIndex={(id) => setMapDetailIndex(id)}
            setMapTypeIndex={(id) => setMapTypeIndex(id)}
          />
        </div>
      </div>
    </div>
  );
}
