import styles from "./TimeLineCard.module.css";
import AnimateOnScroll from "../../Shared/AnimateOnScroll";
import { EArtifact } from "../../../Models/EArtifacts";
import LocationOffRoundedIcon from "@mui/icons-material/LocationOffRounded";
import { Tooltip } from "@mui/material";
import { artifactIcons } from "@renderer/Helper/ArtifactIcons";

export default function TimeLineCard({
  text,
  hovered,
  selecetd,
  type,
  isLocated,
  index,
}: {
  text: string;
  hovered: boolean;
  selecetd: boolean;
  type: EArtifact;
  isLocated: boolean;
  index: number;
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
          <span>{artifactIcons[type]({ size: "small" })}</span>
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
              {index}
              {!isLocated && (
                <Tooltip title="Localisation non renseignée">
                  <LocationOffRoundedIcon
                    fontSize="small"
                    style={{ marginRight: "10px" }}
                    color="error"
                  />
                </Tooltip>
              )}
            </div>
          </span>
        </div>
      </AnimateOnScroll>
    </div>
  );
}
