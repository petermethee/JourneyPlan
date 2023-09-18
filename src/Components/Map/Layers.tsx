import { useState } from "react";
import { MapDetails, MapTypes } from "./TileProviders";
import { MapContainer, TileLayer } from "react-leaflet";
import styles from "./Layers.module.css";
import LayersRoundedIcon from "@mui/icons-material/LayersRounded";
import DynamicFeedRoundedIcon from "@mui/icons-material/DynamicFeedRounded";
import { ButtonBase, IconButton } from "@mui/material";
import { ParisCoord } from "./MapSummary";

export default function Layers({
  setMapTypeIndex,
  setMapDetailIndex,
  mapTypeIndex,
  mapDetailIndex,
}: {
  setMapTypeIndex: (id: number) => void;
  setMapDetailIndex: (id: number) => void;
  mapTypeIndex: number;
  mapDetailIndex: number;
}) {
  const [showMapTypesSuggestions, setShowMapTypesSuggestions] = useState(false);
  const [showMapDetailsSuggestions, setShowMapDetailsSuggestions] =
    useState(false);

  return (
    <>
      <div
        className={styles.mapTypeWrapper}
        onMouseLeave={() => setShowMapTypesSuggestions(false)}
        style={{
          width: showMapTypesSuggestions ? MapTypes.length * 110 + 50 : "auto",
        }}
      >
        {MapTypes.map((mapType, index) => (
          <div
            className={`${styles.mapButton} ${
              mapTypeIndex === index && styles.selectedMap
            } `}
            style={{
              right: showMapTypesSuggestions ? 50 + index * 110 : -125,
              opacity: showMapTypesSuggestions ? 1 : 0,
              transition: `all 100ms ease 0ms, right 200ms ease ${
                index * 40
              }ms, opacity 200ms ease ${index * 40}ms `,
            }}
          >
            <ButtonBase
              sx={{
                position: "absolute",
                height: "100%",
                width: "100%",
                zIndex: "1000 ",
              }}
              onClick={() => setMapTypeIndex(index)}
            />

            <MapContainer
              center={ParisCoord}
              zoom={5}
              scrollWheelZoom={false}
              className={styles.mapContainer}
              zoomControl={false}
              attributionControl={false}
            >
              <TileLayer url={mapType.url} maxZoom={mapType.maxZoom} />
            </MapContainer>
            <span className={styles.mapName}>{MapTypes[index].name}</span>
          </div>
        ))}

        <IconButton
          sx={{
            boxShadow: "0 0 16px 0 #00000094",
            backgroundColor: "white",
          }}
          onMouseEnter={() => setShowMapTypesSuggestions(true)}
        >
          <LayersRoundedIcon />
        </IconButton>
      </div>

      <div
        className={styles.mapDetailWrapper}
        onMouseLeave={() => setShowMapDetailsSuggestions(false)}
        style={{
          width: showMapDetailsSuggestions
            ? MapDetails.length * 110 + 50
            : "auto",
        }}
      >
        {MapDetails.map((mapDetails, index) => (
          <div
            className={`${styles.mapButton} ${
              mapDetailIndex === index && styles.selectedMap
            } `}
            style={{
              right: showMapDetailsSuggestions ? 50 + index * 110 : -125,
              opacity: showMapDetailsSuggestions ? 1 : 0,
              transition: `all 100ms ease 0ms, right 200ms ease ${
                index * 40
              }ms, opacity 200ms ease ${index * 40}ms `,
            }}
          >
            <ButtonBase
              sx={{
                position: "absolute",
                height: "100%",
                width: "100%",
                zIndex: "1000 ",
              }}
              onClick={() => setMapDetailIndex(index)}
            />
            <MapContainer
              center={ParisCoord}
              zoom={5}
              scrollWheelZoom={false}
              className={styles.mapContainer}
              zoomControl={false}
              attributionControl={false}
            >
              <TileLayer url={mapDetails.url} maxZoom={mapDetails.maxZoom} />
            </MapContainer>
            <span className={styles.mapName}>{MapDetails[index].name}</span>
          </div>
        ))}

        <IconButton
          sx={{
            boxShadow: "0 0 16px 0 #00000094",
            backgroundColor: "white",
          }}
          onMouseEnter={() => setShowMapDetailsSuggestions(true)}
        >
          <DynamicFeedRoundedIcon />
        </IconButton>
      </div>
    </>
  );
}
