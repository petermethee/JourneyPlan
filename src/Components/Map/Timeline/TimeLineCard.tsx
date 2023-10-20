import React from "react";
import styles from "./TimeLineCard.module.css";
import AnimateOnScroll from "../../Shared/AnimateOnScroll";
export default function TimeLineCard({
  text,
  id,
}: {
  text: string;
  id: number;
}) {
  return (
    <AnimateOnScroll
      reappear
      visibleClass={styles.finalStyle}
      duration="500ms"
      hiddenClass={styles.initialStyle}
    >
      <div className={styles.timeLineCard}>
        <div className={styles.idBubble}>
          <div className={styles.lightBubble} />
          <div className={styles.lightBubble2} />
          <span>{id}</span>
        </div>

        <div className={styles.cardContainer}>
          <div className={styles.light} />
          <div className={styles.light2} />
          <span>{text}</span>
        </div>
      </div>
    </AnimateOnScroll>
  );
}
