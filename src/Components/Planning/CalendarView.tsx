import { useEffect, useRef, useState } from "react";
import styles from "./CalendarView.module.css";
import { TDayCol } from "./Planning";
import {
  cellHeight,
  getDraggableCalendarStyle,
  initPlanningDimensions,
  minColWidth,
} from "../../DnDCustomLib/CalendarDimensionsHelper";
import DraggableCardView from "./DraggableCardView";
import { calendarDragContainerStyle } from "../../DnDCustomLib/DraggableCSS";
import HoursLabel from "./HoursLabel";

export const getHours = (): string[] => {
  const hours: string[] = [];
  for (let i = 0; i < 24; i++) {
    hours.push(i + ":00");
  }
  return hours;
};

export default function CalendarView({
  dayCols,
  setScrollY,
  scrollYOffset,
}: {
  dayCols: TDayCol[];
  scrollYOffset: number;
  setScrollY: (scrollY: number) => void;
}) {
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
    <div
      className={styles.calendarContainer}
      onScroll={(event) => setScrollY(event.currentTarget.scrollTop)}
    >
      <HoursLabel />
      <div className={styles.relativeContainer} ref={calendarRef}>
        {dayCols.map((dayCol) => (
          <div
            key={dayCol.id}
            className={styles.dayContainer}
            style={{ minWidth: colWidth }}
          >
            {getHours().map((hour) => (
              <div key={hour} className={styles.timeGrid} />
            ))}
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
                scrollYOffset={scrollYOffset}
                getDraggableStyle={getDraggableCalendarStyle}
              >
                <div>{PA.activity.name}</div>
              </DraggableCardView>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
