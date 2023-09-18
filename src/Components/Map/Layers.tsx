import { useState } from "react";
import { MapDetails, MapTypes } from "./TileProviders";
import { MapContainer, TileLayer } from "react-leaflet";
import styles from "./Layers.module.css";
import LayersRoundedIcon from "@mui/icons-material/LayersRounded";
import DynamicFeedRoundedIcon from "@mui/icons-material/DynamicFeedRounded";
import { ButtonBase, Collapse, IconButton } from "@mui/material";

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
      >
        <Collapse
          orientation="horizontal"
          in={showMapTypesSuggestions}
          sx={{
            "& .MuiCollapse-wrapperInner": {
              display: "flex",
              gap: "10px",
              opacity: showMapTypesSuggestions ? 1 : 0,
              transition: "1000ms",
            },
          }}
        >
          {MapTypes.map((mapType) => (
            <div
              className={styles.mapButton}
              style={{
                opacity: showMapTypesSuggestions ? 1 : 0,
              }}
            >
              <ButtonBase
                sx={{
                  position: "absolute",
                  height: "100%",
                  width: "100%",
                  zIndex: "1000 ",
                }}
              />

              <MapContainer
                center={[51.505, -0.09]}
                zoom={5}
                scrollWheelZoom={false}
                className={styles.mapContainer}
                zoomControl={false}
                attributionControl={false}
              >
                <TileLayer url={mapType.url} maxZoom={mapType.maxZoom} />
              </MapContainer>
            </div>
          ))}
        </Collapse>

        <IconButton
          sx={{ backgroundColor: "white" }}
          onMouseEnter={() => setShowMapTypesSuggestions(true)}
        >
          <LayersRoundedIcon />
        </IconButton>
      </div>

      <div
        className={styles.mapDetailWrapper}
        onMouseEnter={() => setShowMapDetailsSuggestions(true)}
        onMouseLeave={() => setShowMapDetailsSuggestions(false)}
      >
        <Collapse in={showMapDetailsSuggestions}>
          {MapDetails.map((mapDetails) => (
            <div className={styles.mapContainer}>
              <ButtonBase />
              <MapContainer
                center={[51.505, -0.09]}
                zoom={13}
                scrollWheelZoom={false}
                className={styles.mapContainer}
                attributionControl={false}
              >
                <TileLayer url={mapDetails.url} maxZoom={mapDetails.maxZoom} />
              </MapContainer>
            </div>
          ))}
        </Collapse>
        {/* <IconButton>
          <DynamicFeedRoundedIcon />
        </IconButton> */}
      </div>
    </>
  );
}
