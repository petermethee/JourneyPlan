import { memo, useCallback, useEffect, useRef, useState } from "react";
import styles from "./CalendarView.module.css";
import draggableStyle from "../DraggableCardView.module.css";
import { TDayCol } from "../Planning";
import {
  cellHeight,
  getDraggableAccomodationCalendarStyle,
  getDraggableCalendarStyle,
  getFinalDestination,
  getFinalDestinationInAccomodationDZ,
  initPlanningDimensions,
  minColWidth,
  setCalendarBoundary,
  setColIds,
  setDropZoneBoundary,
} from "../../../DnDCustomLib/CalendarDimensionsHelper";
import DraggableCardView from "../DraggableCardView";
import {
  accomodationDropZoneDragContainerStyle,
  calendarDragContainerStyle,
} from "../../../DnDCustomLib/DraggableCSS";
import HoursLabel from "./HoursLabel";
import AccomodationDropZone from "../Accomodation/AccomodationDropZone";
import CalendarHeader from "./CalendarHeader";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { IconButton } from "@mui/material";
import ActivityDataCard from "../ArtifactsDataCard/ActivityDataCard";
import { EArtifact } from "../../../Models/EArtifacts";

export const getHours = (): string[] => {
  const hours: string[] = [];
  for (let i = 0; i < 24; i++) {
    hours.push(i + ":00");
  }
  return hours;
};

export const RELATIVE_CALENDAR = "RELATIVE_CALENDAR";

function CalendarView({ dayCols }: { dayCols: TDayCol[] }) {
  const calendarRef = useRef<HTMLDivElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const [colWidth, setColWidth] = useState(100);
  let calculTimeOut: NodeJS.Timeout;

  const [daysIndex, setDaysIndex] = useState([0, 1]);

  const calculColWidth = useCallback(() => {
    const totalWidth = calendarRef.current!.clientWidth;
    const nColMax = Math.floor(totalWidth / minColWidth);
    const nCol = Math.max(Math.min(dayCols.length, nColMax), 1);
    setDaysIndex((prevState) => {
      return [prevState[0], prevState[0] + nCol];
    });

    const initColWidth = totalWidth / nCol - 1; //1 pour 1px épaisseur de bordure droite
    initPlanningDimensions(
      initColWidth + 1, //1 pour 1px de bordure droite

      calendarRef.current!.getBoundingClientRect()
    );
    setDropZoneBoundary(dropZoneRef.current!.getBoundingClientRect());

    setColWidth(initColWidth);
  }, [dayCols.length]);

  window.onresize = function () {
    calculTimeOut && clearTimeout(calculTimeOut);
    calculTimeOut = setTimeout(calculColWidth, 500);
  };

  useEffect(() => {
    calculColWidth();
  }, [calculColWidth]);

  useEffect(() => {
    setColIds(dayCols.map((day) => day.dateId));
  }, [dayCols]);

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
        onScroll={(_event) =>
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
                    planningId={PA.id}
                    artifactId={PA.activity.id}
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
                    artifactType={EArtifact.Activity}
                    getFinalDestination={getFinalDestination}
                  >
                    {(isDragged) => (
                      <ActivityDataCard
                        activity={PA.activity}
                        insideCalendar
                        isDragged={isDragged}
                      />
                    )}
                  </DraggableCardView>
                ))}
                {dayCol.planningTransports.map((PT) => (
                  <DraggableCardView
                    key={PT.id}
                    planningId={PT.id}
                    artifactId={PT.transport.id}
                    duration={PT.transport.duration}
                    containerStyle={calendarDragContainerStyle(
                      colWidth,
                      PT.transport.duration * cellHeight,
                      PT.timeIndex * cellHeight
                    )}
                    source={{ colId: dayCol.dateId, timeIndex: PT.timeIndex }}
                    getDraggableStyle={getDraggableCalendarStyle}
                    disappearAnim={""}
                    shwoCaseClass={draggableStyle.calendarShowcase}
                    artifactType={EArtifact.Transport}
                    getFinalDestination={getFinalDestination}
                  >
                    {() => <div>{PT.transport.name}</div>}
                  </DraggableCardView>
                ))}
              </div>
            ))}
        </div>
      </div>
      <AccomodationDropZone dropZoneRef={dropZoneRef}>
        {dayCols
          .filter(
            (_dayCol, index) => index >= daysIndex[0] && index < daysIndex[1]
          )
          .map((dayCol) => (
            <div
              key={dayCol.dateId}
              className={styles.dayAccomodationDZ}
              style={{ width: colWidth }}
            >
              {dayCol.planningAccomodations.map((PT) => (
                <DraggableCardView
                  key={PT.id}
                  planningId={PT.id}
                  artifactId={PT.accomodation.id}
                  duration={1}
                  containerStyle={accomodationDropZoneDragContainerStyle(
                    colWidth
                  )}
                  source={{ colId: dayCol.dateId, timeIndex: PT.timeIndex }}
                  getDraggableStyle={getDraggableAccomodationCalendarStyle}
                  disappearAnim={""}
                  shwoCaseClass={draggableStyle.calendarShowcase}
                  artifactType={EArtifact.Accomodation}
                  getFinalDestination={getFinalDestinationInAccomodationDZ}
                >
                  {() => <div>{PT.accomodation.name}</div>}
                </DraggableCardView>
              ))}
            </div>
          ))}
      </AccomodationDropZone>
    </div>
  );
}

export default memo(CalendarView);
