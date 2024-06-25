import styles from "./HoursLabel.module.css";
import { getHours } from "./CalendarView";
import { cellHeight } from "../../../DnDCustomLib/CalendarDimensionsHelper";

export default function HoursLabel() {
  return (
    <div className={styles.container}>
      {getHours().map((hour, index) => (
        <div
          style={{ top: index * cellHeight }}
          key={hour}
          className={styles.hourLabel}
        >
          {hour}
        </div>
      ))}
    </div>
  );
}
