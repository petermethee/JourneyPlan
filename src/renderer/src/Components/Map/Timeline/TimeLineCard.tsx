import styles from "./TimeLineCard.module.css";
import AnimateOnScroll from "../../Shared/AnimateOnScroll";
import { EArtifact } from "../../../Models/EArtifacts";
import LocationOffRoundedIcon from "@mui/icons-material/LocationOffRounded";
import { Tooltip } from "@mui/material";
export default function TimeLineCard({
  text,
  id,
  hovered,
  selecetd,
  type,
  isLocated,
}: {
  text: string;
  id: number;
  hovered: boolean;
  selecetd: boolean;
  type: EArtifact;
  isLocated: boolean;
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
        <div
          className={
            type === EArtifact.Transport
              ? styles.idTriangle
              : type === EArtifact.Accommodation
                ? styles.idSquare
                : styles.idBubble
          }
        >
          <div className={styles.lightBubble} />
          <div className={styles.lightBubble2} />
          <span>{id}</span>
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
            {!isLocated && (
              <Tooltip title="Localisation non renseignée">
                <LocationOffRoundedIcon
                  fontSize="small"
                  style={{ marginRight: "10px" }}
                  color="error"
                />
              </Tooltip>
            )}
          </span>
        </div>
      </AnimateOnScroll>
    </div>
  );
}
