import { useEffect, useRef, useState } from "react";
import styles from "./CalendarView.module.css";
import { TDayCol } from "../Planning";
import {
  cellHeight,
  getDraggableCalendarStyle,
  initPlanningDimensions,
  minColWidth,
  setCalendarBoundary,
} from "../../../DnDCustomLib/CalendarDimensionsHelper";
import DraggableCardView from "../DraggableCardView";
import { calendarDragContainerStyle } from "../../../DnDCustomLib/DraggableCSS";
import HoursLabel from "./HoursLabel";
import DayHeader from "./DayHeader";
import dayjs from "dayjs";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import { IconButton } from "@mui/material";
import AccomodationDropZone from "../Accomodation/AccomodationDropZone";

export const getHours = (): string[] => {
  const hours: string[] = [];
  for (let i = 0; i < 24; i++) {
    hours.push(i + ":00");
  }
  return hours;
};

export const RELATIVE_CALENDAR = "RELATIVE_CALENDAR";

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
      dayCols.map((day) => day.dateId),
      calendarRef.current!.getBoundingClientRect()
    );
    setColWidth(initColWidth);
  }, [dayCols]);

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.daysHeader}>
        <div className={styles.arrowButton}>
          <IconButton>
            <ArrowBackIosRoundedIcon />
          </IconButton>
        </div>

        {dayCols.map((dayCol) => (
          <DayHeader key={dayCol.dateId} date={dayjs(dayCol.dateId)} />
        ))}
      </div>
      <div
        className={styles.gridContainer}
        onScroll={(event) =>
          setCalendarBoundary(
            document.getElementById(RELATIVE_CALENDAR)!.getBoundingClientRect()
          )
        }
      >
        <HoursLabel />
        <div
          className={styles.relativeContainer}
          id={RELATIVE_CALENDAR}
          ref={calendarRef}
        >
          {getHours().map((hour, index) => (
            <div
              style={{ top: cellHeight * index }}
              key={hour}
              className={styles.hGridLine}
            />
          ))}
          {dayCols.map((dayCol) => (
            <div
              key={dayCol.dateId}
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
                  source={{ colId: dayCol.dateId, timeIndex: PA.timeIndex }}
                  getDraggableStyle={getDraggableCalendarStyle}
                  disappearAnim={""}
                >
                  <div>{PA.activity.name}</div>
                </DraggableCardView>
              ))}
            </div>
          ))}
        </div>
      </div>
      <AccomodationDropZone />
    </div>
  );
}
