import IActivity from "../../../Models/IActivity";
import styles from "./CommonArtifactStyle.module.css";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import PlaceIcon from "@mui/icons-material/Place";
import { Grid } from "@mui/material";

export default function ActivityDataCard({
  activity,
}: {
  activity: IActivity;
}) {
  return (
    <>
      <Grid display="flex" item flexWrap="nowrap" marginTop="auto">
        <PlaceIcon fontSize="small" />
        <div className={styles.titleContainer}>
          <span className={styles.textContainer}>
            {activity.city ?? activity.location}
          </span>
        </div>
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
        <div className={styles.textContainer}>
          <span>{activity.attachment.length}</span>
        </div>
      </Grid>
    </>
  );
}
