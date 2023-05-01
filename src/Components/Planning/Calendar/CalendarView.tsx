import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./CalendarView.module.css";
import draggableStyle from "../DraggableCardView.module.css";
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
import AccomodationDropZone from "../Accomodation/AccomodationDropZone";
import CalendarHeader from "./CalendarHeader";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { IconButton } from "@mui/material";

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
  let calculTimeOut: NodeJS.Timeout;

  const [daysIndex, setDaysIndex] = useState([0, 1]);

  const calculColWidth = useCallback(() => {
    console.log("tag", dayCols);

    const totalWidth = calendarRef.current!.clientWidth;
    const nColMax = Math.floor(totalWidth / minColWidth);
    const nCol = Math.max(Math.min(dayCols.length, nColMax), 1);

    const initColWidth = totalWidth / nCol - 1; //1 pour 1px de bordure droite
    initPlanningDimensions(
      initColWidth + 1, //1 pour 1px de bordure droite
      dayCols.map((day) => day.dateId),
      calendarRef.current!.getBoundingClientRect()
    );
    setDaysIndex((prevState) => {
      return [prevState[0], prevState[0] + nCol];
    });
    setColWidth(initColWidth);
  }, [dayCols]);

  window.onresize = function () {
    calculTimeOut && clearTimeout(calculTimeOut);
    calculTimeOut = setTimeout(calculColWidth, 500);
  };

  useEffect(() => {
    calculColWidth();
  }, [calculColWidth]);

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.arrowButtonL}>
        <IconButton
          onClick={() =>
            setDaysIndex((prevState) => [prevState[0] - 1, prevState[1] - 1])
          }
          disabled={daysIndex[0] === 0}
        >
          <ArrowBackIosRoundedIcon />
        </IconButton>
      </div>
      <div className={styles.arrowButtonR}>
        <IconButton
          onClick={() =>
            setDaysIndex((prevState) => [prevState[0] + 1, prevState[1] + 1])
          }
          disabled={dayCols.length === daysIndex[1]}
        >
          <ArrowForwardIosRoundedIcon />
        </IconButton>
      </div>
      <CalendarHeader
        dayCols={dayCols
          .filter(
            (dayCol, index) => index >= daysIndex[0] && index < daysIndex[1]
          )
          .map((dayCol) => dayCol.dateId)}
      />
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
          {dayCols
            .filter(
              (_dayCol, index) => index >= daysIndex[0] && index < daysIndex[1]
            )
            .map((dayCol) => (
              <div
                key={dayCol.dateId}
                className={styles.dayContainer}
                style={{ width: colWidth }}
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
                    shwoCaseClass={draggableStyle.calendarShowcase}
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
