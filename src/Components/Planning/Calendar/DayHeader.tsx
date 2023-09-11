import React from "react";
import styles from "./DayHeader.module.css";
import { Dayjs } from "dayjs";
import { getColumnWidth } from "../../../DnDCustomLib/CalendarDimensionsHelper";

export default function DayHeader({
  date,
  isEven,
}: {
  date: Dayjs;
  isEven: boolean;
}) {
  return (
    <div
      className={styles.container}
      style={{
        width: getColumnWidth(),
        backgroundColor: isEven ? "#2a2a2a" : "#1e2b38db",
      }}
    >
      <span className={styles.dayLabel}>
        {date.locale("fr").format("ddd").toUpperCase()}
      </span>
      <span className={styles.dayNumber}>{date.date()}</span>
      <span className={styles.monthYear}>
        {date.locale("fr").format("MMM YYYY").toUpperCase()}
      </span>
    </div>
  );
}
