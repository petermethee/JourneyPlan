import IAccomodation from "../../../Models/IAccomodation";
import styles from "./CommonArtifactStyle.module.css";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import PlaceIcon from "@mui/icons-material/Place";
import { Grid } from "@mui/material";
export default function AccomodationDataCard({
  accomodation,
}: {
  accomodation: IAccomodation;
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
        <span className={styles.textContainer}>
          {accomodation.city ?? accomodation.location}
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
          {accomodation.attachment.length}
        </span>
      </Grid>
    </>
  );
}
