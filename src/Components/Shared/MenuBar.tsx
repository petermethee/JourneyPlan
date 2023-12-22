import React from "react";
import { Button, IconButton } from "@mui/material";
import { ERouterPathes } from "../../Helper/ERouterPathes";
import styles from "./MenuBar.module.css";
import MapIcon from "@mui/icons-material/Map";
import { useNavigate } from "react-router-dom";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import { useAppSelector } from "../../app/hooks";
import { selectCurrentTrip } from "../../features/Redux/tripSlice";
import CalendarViewWeekRoundedIcon from "@mui/icons-material/CalendarViewWeekRounded";

export default function MenuBar({ mapMode }: { mapMode?: boolean }) {
  const navigate = useNavigate();
  const trip = useAppSelector(selectCurrentTrip);
  return (
    <div className={styles.topToolContainer}>
      <IconButton size="small" onClick={() => navigate(ERouterPathes.home)}>
        <HomeRoundedIcon />
      </IconButton>
      <Button
        variant={mapMode ? "outlined" : "contained"}
        startIcon={<CalendarViewWeekRoundedIcon />}
        onClick={() => navigate(ERouterPathes.planning + "/" + trip?.id)}
        sx={{
          width: "40%",
          maxWidth: "40%",
        }}
      >
        Planning
      </Button>
      <Button
        variant={mapMode ? "contained" : "outlined"}
        startIcon={<MapIcon />}
        onClick={() => navigate(ERouterPathes.map)}
        sx={{
          width: "40%",
          maxWidth: "40%",
        }}
      >
        Map
      </Button>
    </div>
  );
}
