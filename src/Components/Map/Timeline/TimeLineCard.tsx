import React from "react";
import styles from "./TimeLineCard.module.css";
export default function TimeLineCard({ text }: { text: string }) {
  return (
    <div className={styles.cardContainer}>
      <span>{text}</span>
    </div>
  );
}
