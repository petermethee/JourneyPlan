import IActivity from "../../../Models/IActivity";
import styles from "./ActivityDataCard.module.css";
import LandscapeRoundedIcon from "@mui/icons-material/LandscapeRounded";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import PlaceIcon from "@mui/icons-material/Place";
import { Grid } from "@mui/material";
import { activityColor, defaultWhite } from "../../../style/cssGlobalStyle";
import { cellHeight } from "../../../DnDCustomLib/CalendarDimensionsHelper";
import { useMemo } from "react";

export default function ActivityDataCard({
  activity,
  insideCalendar,
  isDragged,
}: {
  activity: IActivity;
  insideCalendar?: boolean;
  isDragged?: boolean;
}) {
  const minimalView = useMemo(
    () => (insideCalendar || isDragged) && activity.duration < 1,
    [insideCalendar, isDragged, activity.duration]
  );

  return (
    <div className={styles.container}>
      <div className={styles.iconContainer}>
        <LandscapeRoundedIcon sx={{ color: defaultWhite }} />
      </div>
      <Grid
        container
        padding="5px"
        direction="column"
        flexWrap="nowrap"
        overflow="hidden"
        justifyContent={activity.duration < 1 ? "center" : "top"}
        sx={{ transition: "300ms" }}
      >
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

        <Grid
          container
          item
          flexDirection="column"
          flexWrap={"nowrap"}
          flex={1}
          maxHeight={minimalView ? 0 : cellHeight}
          sx={{
            opacity: minimalView ? 0 : 1,
          }}
          className={styles.infoContainer}
        >
          <Grid
            display="flex"
            item
            alignItems="center"
            flexWrap="nowrap"
            marginTop="auto"
          >
            <PlaceIcon fontSize="small" />
            <span className={styles.textContainer}>
              {activity.location}
              tttttttttttttttttttttttttttttttttttttttttttttt
            </span>
          </Grid>
          <Grid
            display="flex"
            item
            alignItems="center"
            flexWrap="nowrap"
            marginTop="auto"
            marginBottom="auto"
          >
            <AttachFileIcon fontSize="small" />
            <span className={styles.textContainer}>
              tttttttttttttttttttttttttttttttttttttttttttttt
              {activity.attachment}
            </span>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
