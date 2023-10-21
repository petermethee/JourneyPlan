import { useEffect, useMemo, useState } from "react";
import styles from "./MapSummary.module.css";
import PlanningSheets from "../Planning/Calendar/PlanningSheets/PlanningSheets";
import TimeLineSummary from "./Timeline/TimeLineSummary";
import { MapContainer, TileLayer } from "react-leaflet";
import { useResizeDetector } from "react-resize-detector";
import {
  MapDetails,
  MapTypes,
  SatelliteExtansions,
} from "./Tiles/TileProviders";
import Layers from "./Tiles/Layers";
import CustomMarker from "./Tiles/CustomMarker";
import { Map } from "leaflet";
import { useAppSelector } from "../../app/hooks";
import { selectPlanningArtifacts } from "../../features/Redux/planningSlice";
import { EArtifact } from "../../Models/EArtifacts";
import { IArtifact } from "../../Models/IArtifact";
import { selectAccomodations } from "../../features/Redux/accomodationsSlice";
import { selectActivities } from "../../features/Redux/activitiesSlice";
import { selectTransports } from "../../features/Redux/transportsSlice";
export const ParisCoord: [number, number] = [48.8566, 2.3522];

let timeout: NodeJS.Timeout;
export type TTimeLineArtifact = {
  artifact: IArtifact;
  type: EArtifact;
  id: number;
  date: string;
};
export type TMarker = {
  id: number;
  type: EArtifact;
  position: [number, number];
  description?: string;
};

export default function MapSummary() {
  const {
    width: mapWidth,
    height: mapHeight,
    ref: mapWrapperRef,
  } = useResizeDetector();

  const planningArtifacts = useAppSelector(selectPlanningArtifacts);
  const activities = useAppSelector(selectActivities);
  const transports = useAppSelector(selectTransports);
  const accomodations = useAppSelector(selectAccomodations);

  const [mapTypeIndex, setMapTypeIndex] = useState(0);
  const [mapDetailIndex, setMapDetailIndex] = useState(0);
  const [drawMap, setDrawMap] = useState(false);
  const [map, setMap] = useState<Map | null>(null);
  const [timeLineArtifacts, setTimeLineArtifacts] = useState<
    TTimeLineArtifact[]
  >([]);
  const [markers, setMarkers] = useState<TMarker[]>([]);
  const [selectedArtifact, setSelectedArtifact] = useState<number | null>(null);
  const [hoveredArtifact, setHoveredArtifact] = useState<number | null>(null);

  const sortedPlanningArtifacts = useMemo(() => {
    return planningArtifacts.slice().sort((a, b) => {
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
  }, [planningArtifacts]);

  useEffect(() => {
    const tempTimeLineArtifacts: TTimeLineArtifact[] = [];
    const tempMarkers: TMarker[] = [];

    sortedPlanningArtifacts.forEach((PA, index) => {
      let artifact: IArtifact;
      let position: [number, number];
      switch (PA.artifactType) {
        case EArtifact.Activity:
          artifact = activities.find(
            (activity) => activity.id === PA.artifactId
          )!;
          if (artifact.lat && artifact.lng) {
            position = [artifact.lat, artifact.lng];
            tempMarkers.push({
              id: index + 1,
              description: artifact.description,
              position,
              type: PA.artifactType,
            });
          }

          break;
        case EArtifact.Transport:
          artifact = transports.find(
            (transport) => transport.id === PA.artifactId
          )!;
          if (artifact.lat_from && artifact.lng_from) {
            position = [artifact.lat_from, artifact.lng_from];
            tempMarkers.push({
              id: index + 1,
              description: artifact.description,
              position,
              type: PA.artifactType,
            });
          }
          if (artifact.lat_to && artifact.lng_to) {
            position = [artifact.lat_to, artifact.lng_to];
            tempMarkers.push({
              id: index + 1,
              description: artifact.description,
              position,
              type: PA.artifactType,
            });
          }

          break;

        default:
          artifact = accomodations.find(
            (accomodation) => accomodation.id === PA.artifactId
          )!;
          if (artifact.lat && artifact.lng) {
            position = [artifact.lat, artifact.lng];
            tempMarkers.push({
              id: index + 1,
              description: artifact.description,
              position,
              type: PA.artifactType,
            });
          }

          break;
      }
      tempTimeLineArtifacts.push({
        artifact,
        type: PA.artifactType,
        id: index + 1,
        date: PA.date,
      });
    });
    setTimeLineArtifacts(tempTimeLineArtifacts);
    setMarkers(tempMarkers);
  }, [activities, transports, accomodations, sortedPlanningArtifacts]);

  useEffect(() => {
    setDrawMap(false);
    timeout = setTimeout(() => setDrawMap(true), 500);
    return () => {
      timeout && clearTimeout(timeout);
    };
  }, [mapWidth, mapHeight]);

  useEffect(() => {
    console.log(
      "selected artigfact",
      markers.find((marker) => marker.id === selectedArtifact)?.position
    );

    selectedArtifact &&
      map?.setView(
        markers.find((marker) => marker.id === selectedArtifact)!.position
      );
  }, [map, markers, selectedArtifact]);

  useEffect(() => {
    markers.length && map?.setView(markers[0].position);
  }, [markers, map]);

  return (
    <div className={styles.container}>
      <TimeLineSummary
        sortedPlanningArtifacts={timeLineArtifacts}
        onSelectArtifact={setSelectedArtifact}
        onHoverArtifact={setHoveredArtifact}
        hoveredArtifact={hoveredArtifact}
        selectedArtifact={selectedArtifact}
      />
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
              {markers.map((marker, index) => (
                <CustomMarker
                  key={index}
                  artifactType={marker.type}
                  position={marker.position}
                  value={marker.id}
                  description={marker.description}
                  selected={
                    selectedArtifact === marker.id ||
                    hoveredArtifact === marker.id
                  }
                  onClick={() => setSelectedArtifact(marker.id)}
                  onHover={(isHovered) =>
                    setHoveredArtifact(isHovered ? marker.id : null)
                  }
                />
              ))}
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
