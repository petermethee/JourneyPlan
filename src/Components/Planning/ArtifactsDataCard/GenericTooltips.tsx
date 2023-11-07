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
          <div
            style={{
              fontSize: "0.85rem",
            }}
          >
            {description}
          </div>
          <div
            style={{
              width: "100%",
              borderTop: "1px dashed #fff",
              paddingTop: "5px",
              marginTop: "5px",
              fontSize: "0.85rem",
            }}
          >
            <span style={{ fontWeight: "bold" }}>Pièces jointes:{"\n"}</span>

            {pj.join("\n")}
          </div>
        </div>
      )}
    </>
  );
}
