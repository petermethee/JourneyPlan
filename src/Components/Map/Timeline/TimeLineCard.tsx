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
    <div className={styles.timeLineCard}>
      <div className={styles.idBubble}>{id}</div>

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
