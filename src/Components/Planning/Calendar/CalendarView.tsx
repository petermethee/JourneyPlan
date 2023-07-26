import { memo, useCallback, useEffect, useRef, useState } from "react";
import styles from "./CalendarView.module.css";
import draggableStyle from "../DraggableCardView.module.css";
import { TArtifactEditor, TDayCol } from "../Planning";
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
import TransportDataCard from "../ArtifactsDataCard/TransportDataCard";
import AccomodationDataCard from "../ArtifactsDataCard/AccomodationDataCard";
import ArtifactTemplate from "../ArtifactsDataCard/ArtifactTemplate";
import {
  accomodationColor,
  accomodationSecColor,
  activityColor,
  activitySecColor,
  defaultWhite,
  transportColor,
  transportSecColor,
} from "../../../style/cssGlobalStyle";
import AccomodationIcon from "../../Shared/AccomodationIcon";
import ActivityIcon from "../../Shared/ActivityIcon";
import TransportIcon from "../../Shared/TransportIcon";
import PlanningSheets from "./PlanningSheets/PlanningSheets";

export const getHours = (): string[] => {
  const hours: string[] = [];
  for (let i = 0; i < 24; i++) {
    hours.push(i + ":00");
  }
  return hours;
};

export const RELATIVE_CALENDAR = "RELATIVE_CALENDAR";

function CalendarView({
  dayCols,
  openArtifactEditor,
}: {
  dayCols: TDayCol[];
  openArtifactEditor: (artifactEditor: TArtifactEditor) => void;
}) {
  const calendarRef = useRef<HTMLDivElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const [colWidth, setColWidth] = useState(100);
  const [calculTimeOut, setCalculTimeOut] = useState<NodeJS.Timeout>();

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

  const onResize = useCallback(() => {
    calculTimeOut && clearTimeout(calculTimeOut);
    setCalculTimeOut(setTimeout(calculColWidth, 500));
  }, [calculColWidth, calculTimeOut]);
  window.onresize = onResize;

  useEffect(() => {
    calculColWidth();
  }, [calculColWidth]);

  useEffect(() => {
    setColIds(dayCols.map((day) => day.dateId));
  }, [dayCols]);

  useEffect(() => {
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [onResize]);

  return (
    <div className={styles.calendarContainer}>
      <PlanningSheets />
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
                    disappearAnim={draggableStyle.calendarDisappear}
                    shwoCaseClass={draggableStyle.calendarShowcase}
                    artifactType={EArtifact.Activity}
                    getFinalDestination={getFinalDestination}
                    editArtifact={() =>
                      openArtifactEditor({
                        type: EArtifact.Activity,
                        artifact: PA.activity,
                      })
                    }
                  >
                    {(onDeleteFromPlanning, onDelete, isDragged) => (
                      <ArtifactTemplate
                        artifact={PA.activity}
                        isDragged={isDragged}
                        onDeleteFromPlanning={onDeleteFromPlanning}
                        onDelete={onDelete}
                        duration={PA.activity.duration}
                        artifactColor={activityColor}
                        artifactSecColor={activitySecColor}
                        artifactIcon={<ActivityIcon color={defaultWhite} />}
                        insideCalendar
                      >
                        <ActivityDataCard activity={PA.activity} />
                      </ArtifactTemplate>
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
                    disappearAnim={draggableStyle.calendarDisappear}
                    shwoCaseClass={draggableStyle.calendarShowcase}
                    artifactType={EArtifact.Transport}
                    getFinalDestination={getFinalDestination}
                    editArtifact={() =>
                      openArtifactEditor({
                        type: EArtifact.Transport,
                        artifact: PT.transport,
                      })
                    }
                  >
                    {(onDeleteFromPlanning, onDelete, isDragged) => (
                      <ArtifactTemplate
                        artifact={PT.transport}
                        isDragged={isDragged}
                        onDeleteFromPlanning={onDeleteFromPlanning}
                        onDelete={onDelete}
                        duration={PT.transport.duration}
                        artifactColor={transportColor}
                        artifactSecColor={transportSecColor}
                        artifactIcon={<TransportIcon color={defaultWhite} />}
                        insideCalendar
                      >
                        <TransportDataCard transport={PT.transport} />
                      </ArtifactTemplate>
                    )}
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
              {dayCol.planningAccomodations.map((PA) => (
                <DraggableCardView
                  key={PA.id}
                  planningId={PA.id}
                  artifactId={PA.accomodation.id}
                  duration={1}
                  containerStyle={accomodationDropZoneDragContainerStyle(
                    colWidth
                  )}
                  source={{ colId: dayCol.dateId, timeIndex: PA.timeIndex }}
                  getDraggableStyle={getDraggableAccomodationCalendarStyle}
                  disappearAnim={draggableStyle.calendarDisappear}
                  shwoCaseClass={draggableStyle.calendarShowcase}
                  artifactType={EArtifact.Accomodation}
                  getFinalDestination={getFinalDestinationInAccomodationDZ}
                  editArtifact={() =>
                    openArtifactEditor({
                      type: EArtifact.Accomodation,
                      artifact: PA.accomodation,
                    })
                  }
                >
                  {(onDeleteFromPlanning, onDelete, isDragged) => (
                    <ArtifactTemplate
                      artifact={PA.accomodation}
                      isDragged={isDragged}
                      onDeleteFromPlanning={onDeleteFromPlanning}
                      onDelete={onDelete}
                      artifactColor={accomodationColor}
                      artifactSecColor={accomodationSecColor}
                      artifactIcon={<AccomodationIcon color={defaultWhite} />}
                      insideCalendar
                    >
                      <AccomodationDataCard accomodation={PA.accomodation} />
                    </ArtifactTemplate>
                  )}
                </DraggableCardView>
              ))}
            </div>
          ))}
      </AccomodationDropZone>
    </div>
  );
}

export default memo(CalendarView);
