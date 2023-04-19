import React from "react";
import styles from "./HoursLabel.module.css";
import { getHours } from "./CalendarView";

export default function HoursLabel() {
  return (
    <div className={styles.container}>
      {getHours().map((hour) => (
        <div key={hour} className={styles.hourLabel}>
          {hour}
        </div>
      ))}
    </div>
  );
}
