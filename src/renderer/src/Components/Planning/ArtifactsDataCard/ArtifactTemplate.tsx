import { Grid, IconButton } from "@mui/material";
import { secErrorColor } from "../../../style/cssGlobalStyle";
import { cellHeight } from "../../../DnDCustomLib/CalendarDimensionsHelper";
import { memo, useMemo } from "react";
import CustomCloseIcon from "../../Shared/CustomCloseIcon";
import styles from "./CommonArtifactStyle.module.css";
import cstmCloseIconStyle from "../../Shared/CustomCloseIcon.module.css";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { IArtifact } from "../../../Models/IArtifact";
import GenericTooltips from "./GenericTooltips";
import IAccommodation from "../../../Models/IAccommodation";
import AccommodationTooltips from "./AccommodationTooltips";
import CardsFlag from "./CardsFlag";
import { useAppSelector } from "../../../app/hooks";
import { selectCurrency } from "../../../features/Redux/tripSlice";

function ArtifactTemplate({
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
  isAccommodation,
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
  isAccommodation?: boolean;
}) {
  const currency = useAppSelector(selectCurrency);
  const minimalView = useMemo(
    () => (insideCalendar || isDragged) && duration && duration < 1,
    [insideCalendar, isDragged, duration],
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

  const InfoTooltips = useMemo(() => {
    if (insideCalendar) {
      if (isAccommodation) {
        return (
          <AccommodationTooltips
            description={artifact.description}
            pj={artifact.attachment.map((pj) => pj.name)}
            visible={isHovered && !isDragged}
            isInFirstCol={isInFirstCol ?? false}
            checkin={(artifact as IAccommodation).checkin}
            checkout={(artifact as IAccommodation).checkout}
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
    return <></>;
  }, [
    artifact,
    endTime,
    isAccommodation,
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
              size={duration === 0.25 ? "10px" : "13px"}
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
                backgroundColor: "#ffffff82",
                opacity: isHovered ? 1 : 0,
                zIndex: 1,
                "&:hover": { backgroundColor: "#a3a3a3bb" },
              }}
              onClick={onDelete}
              onMouseDown={(e) => e.stopPropagation()} //stop propagation to prevent edit mode
            >
              <DeleteRoundedIcon
                sx={{ color: secErrorColor, fontSize: "13px" }}
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

            {isAccommodation && (
              <CardsFlag
                mealStatus={{
                  breakfast: (artifact as IAccommodation).breakfast,
                  dinner: (artifact as IAccommodation).dinner,
                  lunch: (artifact as IAccommodation).lunch,
                }}
              />
            )}
            <CardsFlag eventStatus={artifact.status} />
            <span className={styles.price}>
              {artifact.price} {currency}
            </span>
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
      {insideCalendar && InfoTooltips}
    </>
  );
}

export default memo(ArtifactTemplate);
