import { useEffect, useRef, useState } from "react";
import styles from "./CalendarView.module.css";
import { TDayCol } from "./Planning";
import { initPlanningDimensions } from "../../DnDCustomLib/DnDHelper";
import DraggableCardView from "./DraggableCardView";

export default function CalendarView({ dayCols }: { dayCols: TDayCol[] }) {
  const calendarRef = useRef<HTMLDivElement>(null);
  const [colWidth, setColWidth] = useState(10);
  useEffect(() => {
    //TODO calc width with calendarRef
    initPlanningDimensions(200, dayCols.length);
    setColWidth(200);
  }, []);

  return (
    <div className={styles.calendarContainer} ref={calendarRef}>
      {dayCols.map((dayCol) => (
        <div
          key={dayCol.id}
          className={styles.dayContainer}
          style={{ minWidth: colWidth }}
        >
          {dayCol.planningActivities.map((PA) => (
            <DraggableCardView id={PA.activity.id} index={0}>
              <div>{PA.activity.name}</div>
            </DraggableCardView>
          ))}
        </div>
      ))}
    </div>
  );
}
