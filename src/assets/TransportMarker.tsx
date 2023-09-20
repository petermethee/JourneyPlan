import { DivIcon } from "leaflet";
import mark from "./TransportMark.png";
import ReactDOMServer from "react-dom/server";
import styles from "./Marker.module.css";

const w = 60;
const h = 48.81;
export const TransportMarker = new DivIcon({
  html: ReactDOMServer.renderToString(
    <img
      src={mark}
      alt="marker"
      style={{ width: "60px" }}
      className={styles.marker}
    />
  ),
  iconSize: [0, 0],
  popupAnchor: [0, -h],
  iconAnchor: [w / 2, h],
});
