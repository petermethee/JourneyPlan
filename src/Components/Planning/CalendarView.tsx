import { useEffect, useRef, useState } from "react";
import styles from "./CalendarView.module.css";
import { TDayCol } from "./Planning";
import {
  cellHeight,
  initPlanningDimensions,
  minColWidth,
} from "../../DnDCustomLib/CalendarDimensionsHelper";
import DraggableCardView from "./DraggableCardView";
import { calendarDragContainerStyle } from "../../DnDCustomLib/DraggableCSS";

export default function CalendarView({ dayCols }: { dayCols: TDayCol[] }) {
  const calendarRef = useRef<HTMLDivElement>(null);
  const [colWidth, setColWidth] = useState(100);
  useEffect(() => {
    const totalWidth = calendarRef.current!.clientWidth;
    const nColMax = Math.floor(totalWidth / minColWidth);
    const nCol = Math.max(Math.min(dayCols.length, nColMax), 1);
    const initColWidth = totalWidth / nCol - 1; //1 pour 1px de bordure droite
    initPlanningDimensions(initColWidth);
    setColWidth(initColWidth);
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
            <DraggableCardView
              id={PA.activity.id}
              duration={PA.activity.duration}
              containerStyle={calendarDragContainerStyle(
                colWidth,
                PA.activity.duration * cellHeight,
                PA.timeIndex * cellHeight
              )}
            >
              <div>{PA.activity.name}</div>
            </DraggableCardView>
          ))}
        </div>
      ))}
    </div>
  );
}
