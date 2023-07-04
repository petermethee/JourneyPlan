import ITransport from "../../../Models/ITransport";
import styles from "./CommonArtifactStyle.module.css";
import { Grid } from "@mui/material";
import EastRoundedIcon from "@mui/icons-material/EastRounded";
import AttachFileIcon from "@mui/icons-material/AttachFile";

export default function TransportDataCard({
  transport,
}: {
  transport: ITransport;
}) {
  return (
    <>
      <Grid
        display="flex"
        item
        alignItems="center"
        flexWrap="nowrap"
        marginTop="auto"
        justifyContent="space-evenly"
      >
        <span className={styles.textContainer}>{transport.from}</span>
        <EastRoundedIcon />
        <span className={styles.textContainer}>{transport.to}</span>
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
          {transport.attachment.length}
        </span>
      </Grid>
    </>
  );
}
