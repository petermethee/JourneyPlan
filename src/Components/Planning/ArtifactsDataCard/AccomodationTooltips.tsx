import React from "react";
import styles from "./AccomodationTooltips.module.css";
export default function AccomodationTooltips({
  description,
  pj,
  visible,
  isInFirstCol,
  checkin,
  checkout,
}: {
  checkin: string;
  checkout: string;
  description?: string;
  pj: string[];
  visible: boolean;
  isInFirstCol: boolean;
}) {
  return (
    <>
      <div className={`${styles.times} ${visible && styles.appear}`}>
        {checkin}

        {checkout}
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
