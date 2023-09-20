import { useEffect, useState } from "react";
import styles from "./MapSummary.module.css";
import PlanningSheets from "../Planning/Calendar/PlanningSheets/PlanningSheets";
import TimeLineSummary from "./TimeLineSummary";
import { MapContainer, TileLayer } from "react-leaflet";
import { useResizeDetector } from "react-resize-detector";
import { MapDetails, MapTypes, SatelliteExtansions } from "./TileProviders";
import Layers from "./Layers";
import Markers from "./Markers";
import { Map } from "leaflet";
import { useAppSelector } from "../../app/hooks";
import { selectPlanningArtifacts } from "../../features/Redux/planningSlice";
import { PlanningArtifactTable } from "../../Models/DataBaseModel";

let timeout: NodeJS.Timeout;
export const ParisCoord: [number, number] = [48.8566, 2.3522];
export default function MapSummary() {
  const {
    width: mapWidth,
    height: mapHeight,
    ref: mapWrapperRef,
  } = useResizeDetector();

  const planningArtifacts = useAppSelector(selectPlanningArtifacts);

  const [mapTypeIndex, setMapTypeIndex] = useState(0);
  const [mapDetailIndex, setMapDetailIndex] = useState(0);
  const [drawMap, setDrawMap] = useState(false);
  const [map, setMap] = useState<Map | null>(null);

  useEffect(() => {
    setDrawMap(false);
    timeout = setTimeout(() => setDrawMap(true), 500);
    return () => {
      timeout && clearTimeout(timeout);
    };
  }, [mapWidth, mapHeight]);

  useEffect(() => {
    let sortedArtifacts = planningArtifacts.slice().sort((a, b) => {
      let dateA = new Date(a.date);
      let dateB = new Date(b.date);

      if (dateA < dateB) {
        return -1;
      } else if (dateA > dateB) {
        return 1;
      } else {
        // If the dates are equal, compare the timeIndex
        if (a.timeIndex < b.timeIndex && a.timeIndex !== -1) {
          return -1;
        } else if (a.timeIndex > b.timeIndex && b.timeIndex !== -1) {
          return 1;
        } else {
          return 0;
        }
      }
    });
    console.log("tag", sortedArtifacts);
  }, [planningArtifacts]);

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
              ref={setMap as any}
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
                  <TileLayer
                    key={extansion.url}
                    url={extansion.url}
                    maxZoom={extansion.maxZoom}
                  />
                ))}
              <Markers />
            </MapContainer>
          )}
          {map && (
            <Layers
              mapDetailIndex={mapDetailIndex}
              mapTypeIndex={mapTypeIndex}
              setMapDetailIndex={(id) => setMapDetailIndex(id)}
              setMapTypeIndex={(id) => setMapTypeIndex(id)}
              map={map}
            />
          )}
        </div>
      </div>
    </div>
  );
}
