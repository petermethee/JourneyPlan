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
    initPlanningDimensions(
      initColWidth + 1, //1 pour 1px de bordure droite
      dayCols.map((day) => day.id)
    );
    setColWidth(initColWidth);
  }, [dayCols]);

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
              key={PA.id}
              id={PA.activity.id}
              duration={PA.activity.duration}
              containerStyle={calendarDragContainerStyle(
                colWidth,
                PA.activity.duration * cellHeight,
                PA.timeIndex * cellHeight
              )}
              source={{ colId: dayCol.id, timeIndex: PA.timeIndex }}
            >
              <div>{PA.activity.name}</div>
            </DraggableCardView>
          ))}
        </div>
      ))}
    </div>
  );
}
