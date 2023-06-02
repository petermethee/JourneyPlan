import ITransport from "../../../Models/ITransport";
import styles from "./TransportDataCard.module.css";
import TrainRoundedIcon from "@mui/icons-material/TrainRounded";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import PlaceIcon from "@mui/icons-material/Place";
import { Grid, IconButton } from "@mui/material";
import { transportColor, defaultWhite } from "../../../style/cssGlobalStyle";
import { cellHeight } from "../../../DnDCustomLib/CalendarDimensionsHelper";
import { useMemo } from "react";
import CloseIcon from "@mui/icons-material/Close";

export default function TransportDataCard({
  transport,
  insideCalendar,
  isDragged,
  onDelete,
}: {
  transport: ITransport;
  insideCalendar?: boolean;
  isDragged?: boolean;
  onDelete: () => void;
}) {
  const minimalView = useMemo(
    () => (insideCalendar || isDragged) && transport.duration < 1,
    [insideCalendar, isDragged, transport.duration]
  );

  return (
    <div className={styles.container}>
      <div className={styles.iconContainer}>
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
                fontSize: transport.duration === 0.25 ? "13px" : "20px",
                color: "white",
              }}
            />
          </IconButton>
        )}
        <TrainRoundedIcon sx={{ color: defaultWhite }} />
      </div>
      <Grid
        container
        padding="5px"
        direction="column"
        flexWrap="nowrap"
        overflow="hidden"
        justifyContent={transport.duration < 1 ? "center" : "top"}
        sx={{ transition: "300ms" }}
      >
        <Grid
          item
          container
          width="100%"
          justifyContent="space-between"
          borderBottom={"1px solid " + transportColor}
        >
          <span className={styles.title}>{transport.name}</span>
          <span>{transport.price} €</span>
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
              {transport.from}
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
              {transport.attachment}
            </span>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
