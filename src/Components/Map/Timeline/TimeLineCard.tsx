import React from "react";
import styles from "./TimeLineCard.module.css";
import AnimateOnScroll from "../../Shared/AnimateOnScroll";
export default function TimeLineCard({
  text,
  id,
  hovered,
  selecetd,
}: {
  text: string;
  id: number;
  hovered: boolean;
  selecetd: boolean;
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
          <span>{text}</span>
        </div>
      </AnimateOnScroll>
    </div>
  );
}
