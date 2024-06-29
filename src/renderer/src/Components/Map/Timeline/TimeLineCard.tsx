import styles from "./TimeLineCard.module.css";
import AnimateOnScroll from "../../Shared/AnimateOnScroll";
import { EArtifact } from "../../../Models/EArtifacts";
import LocationOffRoundedIcon from "@mui/icons-material/LocationOffRounded";
import { IconButton, Tooltip } from "@mui/material";
import { artifactIcons } from "@renderer/Helper/ArtifactIcons";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
export default function TimeLineCard({
  text,
  hovered,
  selecetd,
  type,
  isLocated,
  index,
  onEdit,
}: {
  text: string;
  hovered: boolean;
  selecetd: boolean;
  type: EArtifact;
  isLocated: boolean;
  index: number;
  onEdit: () => void;
}) {
  return (
    <div
      className={`${styles.timeLineCard} ${
        selecetd
          ? styles.selectedTimeLineCard
          : hovered && styles.hoveredTimeLineCard
      }`}
    >
      <AnimateOnScroll
        reappear
        visibleClass={styles.finalBubbleStyle}
        duration="300ms"
        hiddenClass={styles.initialBubbleStyle}
      >
        <div className={styles.idBubble}>
          <div className={styles.lightBubble} />
          <div className={styles.lightBubble2} />
          <span>
            {hovered ? (
              <IconButton onClick={onEdit}>
                <EditRoundedIcon sx={{ color: "white" }} fontSize="small" />
              </IconButton>
            ) : (
              artifactIcons[type]({ size: "small" })
            )}
          </span>
        </div>
      </AnimateOnScroll>

      <AnimateOnScroll
        reappear
        visibleClass={styles.finalStyle}
        duration="500ms"
        hiddenClass={styles.initialStyle}
      >
        <div className={styles.cardContainer}>
          <div className={styles.light} />
          <div className={styles.light2} />
          <span>
            {text}
            <div>
              {!isLocated && (
                <Tooltip title="Localisation non renseignée">
                  <LocationOffRoundedIcon fontSize="small" color="error" />
                </Tooltip>
              )}
              {index}
            </div>
          </span>
        </div>
      </AnimateOnScroll>
    </div>
  );
}
