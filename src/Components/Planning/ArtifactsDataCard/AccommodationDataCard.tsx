import IAccommodation from "../../../Models/IAccommodation";
import styles from "./CommonArtifactStyle.module.css";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import PlaceIcon from "@mui/icons-material/Place";
import { Grid } from "@mui/material";
export default function AccommodationDataCard({
  accommodation,
}: {
  accommodation: IAccommodation;
}) {
  return (
    <>
      <Grid
        display="flex"
        item
        alignItems="center"
        flexWrap="nowrap"
        marginTop="auto"
      >
        <PlaceIcon fontSize="small" />
        <div className={styles.titleContainer}>
          <span className={styles.textContainer}>
            {accommodation.city ?? accommodation.location}
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
        <span className={styles.textContainer}>
          {accommodation.attachment.length}
        </span>
      </Grid>
    </>
  );
}
