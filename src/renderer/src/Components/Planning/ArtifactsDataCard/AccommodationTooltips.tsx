import React from "react";
import styles from "./GenericTooltips.module.css";

export default function AccommodationTooltips({
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
      <div
        className={`${styles.checkinOut} ${visible && styles.appearCheckinOut}`}
      >
        <span>Checkin: {checkin}</span>
        <span>Checkout: {checkout}</span>
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
          style={{ bottom: "1px" }}
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
