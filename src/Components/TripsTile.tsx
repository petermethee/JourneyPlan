import React from "react";
import styles from "./TripsTile.module.css";
type TTileProps = {
  title: string;
  id: number;
  startDate: string;
  endDate: string;
  onClick: (id: number) => void;
};
export default function TripsTile({
  title,
  id,
  startDate,
  endDate,
  onClick,
}: TTileProps) {
  return (
    <div className={styles.card} onClick={() => onClick(id)}>
      <div className={styles.title}>{title}</div>
      <div>
        {startDate} - {endDate}
      </div>
    </div>
  );
}
