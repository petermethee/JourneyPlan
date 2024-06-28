import { Marker, Popup } from "react-leaflet";
import { EArtifact } from "../../../../Models/EArtifacts";
import { useMemo } from "react";
import { DivIcon } from "leaflet";
import ReactDOMServer from "react-dom/server";
import accommodationMark from "../../../../assets/MapMarkers/AccommodationMark.png";
import activityMark from "../../../../assets/MapMarkers/ActivityMark.png";
import transportMark from "../../../../assets/MapMarkers/TransportMark.png";

import styles from "./Marker.module.css";
import "./LeafletOverideStyle.css";

const standardMarkSize = { w: 45, h: 45 };
const transportMarkSize = { w: 50, h: 50 };

export default function CustomMarker({
  position,
  artifactType,
  value,
  onClick,
  onHover,
  description,
  selected,
}: {
  position: [number, number];
  value: number;
  artifactType: EArtifact;
  onClick: () => void;
  onHover: (isHovered: boolean) => void;
  description?: string;
  selected?: boolean;
}) {
  const icon = useMemo(() => {
    let mark: string;
    switch (artifactType) {
      case EArtifact.Activity:
        mark = activityMark;
        break;
      case EArtifact.Transport:
        mark = transportMark;

        break;
      default:
        mark = accommodationMark;
        break;
    }
    const { h, w } =
      artifactType === EArtifact.Transport
        ? transportMarkSize
        : standardMarkSize;
    const stdrdAnchor: [number, number] =
      artifactType === EArtifact.Transport ? [15, 36] : [w / 2, h];
    return new DivIcon({
      html: ReactDOMServer.renderToString(
        <div
          className={`${styles.markerContainer} ${
            selected ? styles.growAnimation : styles.reduceAnimation
          }`}
          style={{
            width: w + "px",
          }}
        >
          <img src={mark} alt="marker" style={{ width: "100%" }} />
          <span
            style={{
              marginTop: artifactType === EArtifact.Transport ? "-6px" : "-6px",
            }}
          >
            {value}
          </span>
        </div>,
      ),
      iconSize: [0, 0],
      popupAnchor: [0, -stdrdAnchor[1]],
      iconAnchor: stdrdAnchor,
    });
  }, [value, selected, artifactType]);

  return (
    <Marker
      riseOnHover
      riseOffset={10}
      position={position}
      icon={icon}
      eventHandlers={{
        click: onClick,
        mouseover: () => onHover(true),
        mouseout: () => onHover(false),
      }}
      zIndexOffset={selected ? 10000 : 0}
    >
      {description && <Popup>{description}</Popup>}
    </Marker>
  );
}
