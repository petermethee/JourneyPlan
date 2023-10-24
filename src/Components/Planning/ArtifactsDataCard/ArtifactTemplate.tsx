import { Grid, IconButton } from "@mui/material";
import { secErrorColor } from "../../../style/cssGlobalStyle";
import { cellHeight } from "../../../DnDCustomLib/CalendarDimensionsHelper";
import { useMemo } from "react";
import CustomCloseIcon from "../../Shared/CustomCloseIcon";
import styles from "./CommonArtifactStyle.module.css";
import cstmCloseIconStyle from "../../Shared/CustomCloseIcon.module.css";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { IArtifact } from "../../../Models/IArtifact";
import GenericTooltips from "./GenericTooltips";
import IAccomodation from "../../../Models/IAccomodation";
import AccomodationTooltips from "./AccomodationTooltips";
import CardsFlag from "./CardsFlag";

export default function ArtifactTemplate({
  artifact,
  duration,
  insideCalendar,
  isDragged,
  onDeleteFromPlanning,
  onDelete,
  children,
  artifactColor,
  artifactSecColor,
  artifactIcon,
  isHovered,
  timeIndex,
  isInFirstCol,
  isAccomodation,
}: {
  artifact: IArtifact;
  duration?: number;
  insideCalendar?: boolean;
  isDragged?: boolean;
  onDeleteFromPlanning: () => void;
  onDelete: () => void;
  children: JSX.Element;
  artifactColor: string;
  artifactSecColor: string;
  artifactIcon: JSX.Element;
  isHovered: boolean;
  timeIndex?: number;
  isInFirstCol?: boolean;
  isAccomodation?: boolean;
}) {
  const minimalView = useMemo(
    () => (insideCalendar || isDragged) && duration && duration < 1,
    [insideCalendar, isDragged, duration]
  );

  const startTime = useMemo(() => {
    if (timeIndex) {
      let integerPart = Math.floor(timeIndex);
      let decimalPart = timeIndex - integerPart;
      const hours = integerPart;
      const minutes = 60 * decimalPart;
      return `${hours}:${minutes === 0 ? "00" : minutes}`;
    }
    return "";
  }, [timeIndex]);

  const endTime = useMemo(() => {
    if (timeIndex && duration) {
      const endTimeIndex = timeIndex + duration;
      let integerPart = Math.floor(endTimeIndex);
      let decimalPart = endTimeIndex - integerPart;
      const hours = integerPart;
      const minutes = 60 * decimalPart;

      return `${hours}:${minutes === 0 ? "00" : minutes}`;
    }
    return "";
  }, [timeIndex, duration]);

  const Tooltips = useMemo(() => {
    if (insideCalendar) {
      if (isAccomodation) {
        return (
          <AccomodationTooltips
            description={artifact.description}
            pj={artifact.attachment.map((pj) => pj.name)}
            visible={isHovered && !isDragged}
            isInFirstCol={isInFirstCol ?? false}
            checkin={(artifact as IAccomodation).checkin}
            checkout={(artifact as IAccomodation).checkout}
          />
        );
      } else {
        return (
          <GenericTooltips
            startTime={startTime}
            endTime={endTime}
            description={artifact.description}
            pj={artifact.attachment.map((pj) => pj.name)}
            visible={isHovered && !isDragged}
            isInFirstCol={isInFirstCol ?? false}
            isAfter8={timeIndex! >= 20}
          />
        );
      }
    }
  }, [
    artifact,
    endTime,
    isAccomodation,
    isHovered,
    isInFirstCol,
    startTime,
    timeIndex,
    isDragged,
    insideCalendar,
  ]);
  return (
    <>
      <div className={`${styles.container} ${cstmCloseIconStyle.container}`}>
        <div
          className={styles.iconContainer}
          style={{
            backgroundColor: artifactColor,
          }}
        >
          {insideCalendar && !isDragged && (
            <CustomCloseIcon
              center
              onDelete={onDeleteFromPlanning}
              size={duration === 0.25 ? "13px" : "20px"}
              sx={{ opacity: isHovered ? 1 : 0 }}
            />
          )}
          {!insideCalendar && !isDragged && !artifact.used && (
            <IconButton
              className={styles.deleteArtifact}
              sx={{
                transition: "300ms",
                position: "absolute",
                top: "2px",
                padding: "2px",
                backgroundColor: " #5453539f",
                opacity: isHovered ? 1 : 0,
                zIndex: 1,
                "&:hover": { backgroundColor: "#303030dd" },
              }}
              onClick={onDelete}
              onMouseDown={(e) => e.stopPropagation()} //stop propagation to prevent edit mode
            >
              <DeleteRoundedIcon
                fontSize="small"
                sx={{ color: secErrorColor }}
              />
            </IconButton>
          )}
          {artifactIcon}
        </div>
        <Grid
          container
          padding="5px"
          direction="column"
          overflow="hidden"
          justifyContent={duration && duration < 1 ? "center" : "top"}
          sx={{ transition: "300ms" }}
        >
          <Grid
            item
            container
            width="100%"
            justifyContent="space-between"
            borderBottom={"1px solid " + artifactColor}
            flexWrap="nowrap"
            gap="5px"
          >
            <div className={styles.titleContainer}>
              <span
                className={styles.title}
                style={{ color: artifactSecColor }}
              >
                {artifact.name}
              </span>
            </div>

            {isAccomodation && (
              <CardsFlag
                mealStatus={{ breakfast: true, dinner: true, lunch: true }}
              />
            )}
            <CardsFlag eventStatus={artifact.status} />
            <span className={styles.price}>{artifact.price} €</span>
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
            {children}
          </Grid>
        </Grid>
      </div>
      {insideCalendar && Tooltips}
    </>
  );
}
