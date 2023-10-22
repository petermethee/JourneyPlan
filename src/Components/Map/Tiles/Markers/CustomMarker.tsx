import { Marker, Popup } from "react-leaflet";
import { EArtifact } from "../../../../Models/EArtifacts";
import { useMemo } from "react";
import { DivIcon } from "leaflet";
import ReactDOMServer from "react-dom/server";
import accomodationMark from "../../../../assets/AccomodationMarkNoIcon.png";
import activityMark from "../../../../assets/ActivityMarkNoIcon.png";
import transportMark from "../../../../assets/TransportMarkNoIcon.png";

import styles from "./Marker.module.css";
import "./LeafletOverideStyle.css";

const w = 60;
const h = 51;
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
    let mark;
    switch (artifactType) {
      case EArtifact.Activity:
        mark = activityMark;
        break;
      case EArtifact.Transport:
        mark = transportMark;

        break;
      default:
        mark = accomodationMark;
        break;
    }
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
          <span>{value}</span>
        </div>
      ),
      iconSize: [0, 0],
      popupAnchor: [0, -h],
      iconAnchor: [w / 2, h],
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
