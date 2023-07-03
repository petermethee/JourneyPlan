import IActivity from "../../../Models/IActivity";
import styles from "./CommonArtifactStyle.module.css";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import PlaceIcon from "@mui/icons-material/Place";
import { Grid, IconButton } from "@mui/material";
import {
  activityColor,
  activitySecColor,
  defaultWhite,
  secErrorColor,
} from "../../../style/cssGlobalStyle";
import { cellHeight } from "../../../DnDCustomLib/CalendarDimensionsHelper";
import { useMemo } from "react";
import ActivityIcon from "../../Shared/ActivityIcon";
import CustomCloseIcon from "../../Shared/CustomCloseIcon";
import cstmCloseIconStyle from "../../Shared/CustomCloseIcon.module.css";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

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
    <div className={`${styles.container} ${cstmCloseIconStyle.container}`}>
      <div
        className={styles.iconContainer}
        style={{
          backgroundColor: activityColor,
        }}
      >
        {insideCalendar && !isDragged && (
          <CustomCloseIcon
            center
            onDelete={onDelete}
            size={activity.duration === 0.25 ? "13px" : "20px"}
          />
        )}
        {!insideCalendar && !isDragged && (
          <IconButton
            className={styles.deleteArtifact}
            sx={{
              transition: "300ms",
              position: "absolute",
              top: "2px",
              padding: "2px",
              backgroundColor: " #5453539f",
              "&:hover": { backgroundColor: "#303030dd" },
            }}
          >
            <DeleteRoundedIcon fontSize="small" sx={{ color: secErrorColor }} />
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
            <span className={styles.textContainer}>{activity.location}</span>
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
              {activity.attachment.length}
            </span>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
