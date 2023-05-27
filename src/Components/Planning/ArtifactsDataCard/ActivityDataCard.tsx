import React from "react";
import IActivity from "../../../Models/IActivity";
import styles from "./ActivityDataCard.module.css";
import { MdTravelExplore } from "react-icons/md";
import LandscapeRoundedIcon from "@mui/icons-material/LandscapeRounded";

import AttachFileIcon from "@mui/icons-material/AttachFile";
import PlaceIcon from "@mui/icons-material/Place";
import { Grid } from "@mui/material";
import {
  activityColor,
  activitySecColor,
  goldenColor,
} from "../../../style/cssGlobalStyle";
export default function ActivityDataCard({
  activity,
}: {
  activity: IActivity;
}) {
  return (
    <div className={styles.container}>
      <div className={styles.iconContainer}>
        <LandscapeRoundedIcon sx={{ color: activitySecColor }} />
      </div>
      <Grid container padding="5px" direction="column" rowGap={1}>
        <Grid
          item
          container
          width="100%"
          justifyContent="space-between"
          borderBottom={"1px solid " + activityColor}
        >
          <span className={styles.title}>{activity.name}</span>
          <span>{activity.price} €</span>
        </Grid>
        <Grid item display="flex" alignItems="center">
          <PlaceIcon fontSize="small" /> {activity.location}
        </Grid>
        <Grid item display="flex" alignItems="center">
          <AttachFileIcon fontSize="small" /> {activity.attachment}
        </Grid>
      </Grid>
    </div>
  );
}
