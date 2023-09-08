import { Grid, IconButton } from "@mui/material";
import { secErrorColor } from "../../../style/cssGlobalStyle";
import { cellHeight } from "../../../DnDCustomLib/CalendarDimensionsHelper";
import { useMemo } from "react";
import CustomCloseIcon from "../../Shared/CustomCloseIcon";
import styles from "./CommonArtifactStyle.module.css";
import cstmCloseIconStyle from "../../Shared/CustomCloseIcon.module.css";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { IItem } from "../../../Models/IItem";

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
}: {
  artifact: IItem;
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
}) {
  const minimalView = useMemo(
    () => (insideCalendar || isDragged) && duration && duration < 1,
    [insideCalendar, isDragged, duration]
  );

  return (
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
            <DeleteRoundedIcon fontSize="small" sx={{ color: secErrorColor }} />
          </IconButton>
        )}
        {artifactIcon}
      </div>
      <Grid
        container
        padding="5px"
        direction="column"
        flexWrap="nowrap"
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
        >
          <span className={styles.title} style={{ color: artifactSecColor }}>
            {artifact.name}
          </span>
          <span>{artifact.price} €</span>
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
  );
}
