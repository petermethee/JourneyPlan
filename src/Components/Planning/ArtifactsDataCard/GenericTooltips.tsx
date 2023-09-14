import React from "react";
import styles from "./GenericTooltips.module.css";
export default function GenericTooltips({
  startTime,
  endTime,
  description,
  pj,
  visible,
}: {
  startTime: string;
  endTime: string;
  description?: string;
  pj: string[];
  visible: boolean;
}) {
  return (
    <>
      <div
        className={`${styles.startTime} ${visible && styles.appearStartTime}`}
      >
        {startTime}
      </div>
      <div className={`${styles.endTime} ${visible && styles.appearEndTime}`}>
        {endTime}
      </div>
      {description !== "" && (
        <div
          className={`${styles.description} ${
            visible && styles.appearDescription
          }`}
        >
          {description}
        </div>
      )}
    </>
  );
}
