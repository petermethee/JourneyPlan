import IActivity from "../../../Models/IActivity";
import styles from "./CommonArtifactStyle.module.css";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import PlaceIcon from "@mui/icons-material/Place";
import { Grid, IconButton } from "@mui/material";
import {
  activityColor,
  activitySecColor,
  defaultWhite,
} from "../../../style/cssGlobalStyle";
import { cellHeight } from "../../../DnDCustomLib/CalendarDimensionsHelper";
import { useMemo } from "react";
import CloseIcon from "@mui/icons-material/Close";
import ActivityIcon from "../../Shared/ActivityIcon";

export default function ActivityDataCard({
  activity,
  insideCalendar,
  isDragged,
  onDelete,
}: {
  activity: IActivity;
  insideCalendar?: boolean;
  isDragged?: boolean;
  onDelete: () => void;
}) {
  const minimalView = useMemo(
    () => (insideCalendar || isDragged) && activity.duration < 1,
    [insideCalendar, isDragged, activity.duration]
  );

  return (
    <div className={styles.container}>
      <div
        className={styles.iconContainer}
        style={{
          backgroundColor: activityColor,
        }}
      >
        {insideCalendar && !isDragged && (
          <IconButton
            onClick={onDelete}
            size="small"
            sx={{
              transition: "300ms",
              position: "absolute",
              padding: "2px",
              backgroundColor: " #3030309f",
              "&:hover": { backgroundColor: "#303030dd" },
            }}
            className={styles.deleteIcon}
          >
            <CloseIcon
              sx={{
                fontSize: activity.duration === 0.25 ? "13px" : "20px",
                color: "white",
              }}
            />
          </IconButton>
        )}
        <ActivityIcon color={defaultWhite} />
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
          <span className={styles.title} style={{ color: activitySecColor }}>
            {activity.name}
          </span>
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
