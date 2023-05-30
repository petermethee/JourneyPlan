import IAccomodation from "../../../Models/IAccomodation";
import styles from "./AccomodationDataCard.module.css";
import LandscapeRoundedIcon from "@mui/icons-material/LandscapeRounded";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import PlaceIcon from "@mui/icons-material/Place";
import { Grid, IconButton } from "@mui/material";
import { accomodationColor, defaultWhite } from "../../../style/cssGlobalStyle";
import { cellHeight } from "../../../DnDCustomLib/CalendarDimensionsHelper";
import CloseIcon from "@mui/icons-material/Close";
export default function AccomodationDataCard({
  accomodation,
  insideCalendar,
  isDragged,
  onDelete,
}: {
  accomodation: IAccomodation;
  insideCalendar?: boolean;
  isDragged?: boolean;
  onDelete: () => void;
}) {
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
                fontSize: "20px",
                color: "white",
              }}
            />
          </IconButton>
        )}
        <LandscapeRoundedIcon sx={{ color: defaultWhite }} />
      </div>
      <Grid
        container
        padding="5px"
        direction="column"
        flexWrap="nowrap"
        overflow="hidden"
        justifyContent={"top"}
        sx={{ transition: "300ms" }}
      >
        <Grid
          item
          container
          width="100%"
          justifyContent="space-between"
          borderBottom={"1px solid " + accomodationColor}
        >
          <span className={styles.title}>{accomodation.name}</span>
          <span>{accomodation.price} €</span>
        </Grid>

        <Grid
          container
          item
          flexDirection="column"
          flexWrap={"nowrap"}
          flex={1}
          maxHeight={cellHeight}
          sx={{
            opacity: 1,
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
              {accomodation.location}
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
              {accomodation.attachment}
            </span>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
