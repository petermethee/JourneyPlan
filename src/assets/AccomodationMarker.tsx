import { DivIcon } from "leaflet";
import mark from "./AccomodationMarkNoIcon.png";
import ReactDOMServer from "react-dom/server";
import styles from "./Marker.module.css";

const w = 60;
const h = 51;
export default function AccomodationMarker(value: number, selected?: boolean) {
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
}
