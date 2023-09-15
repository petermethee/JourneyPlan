import React from "react";
import styles from "./GenericTooltips.module.css";
export default function GenericTooltips({
  startTime,
  endTime,
  description,
  pj,
  visible,
  isInFirstCol,
  isAfter8,
}: {
  startTime: string;
  endTime: string;
  description?: string;
  pj: string[];
  visible: boolean;
  isInFirstCol: boolean;
  isAfter8: boolean;
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
          className={`${
            isInFirstCol ? styles.descriptionR : styles.descriptionL
          } ${
            visible &&
            (isInFirstCol
              ? styles.appearDescriptionR
              : styles.appearDescriptionL)
          }`}
          style={isAfter8 ? { bottom: "1px" } : { top: "1px" }}
        >
          {description}
          <br />
          Pièces jointes:{"\n"}
          {pj.join("\n")}
        </div>
      )}
    </>
  );
}
