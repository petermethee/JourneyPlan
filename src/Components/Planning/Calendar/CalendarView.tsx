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
import { useAppDispatch } from "../../../app/hooks";
import { insertActivity } from "../../../features/Redux/activitiesSlice";
import { insertTransport } from "../../../features/Redux/transportsSlice";
import { insertAccomodation } from "../../../features/Redux/accomodationsSlice";

export const getHours = (): string[] => {
  const hours: string[] = [];
  for (let i = 0; i < 24; i++) {
    hours.push(i + ":00");
  }
  return hours;
};

export const RELATIVE_CALENDAR = "RELATIVE_CALENDAR";
export const GRID_CONTAINER = "GRID_CONTAINER";

function CalendarView({
  dayCols,
  openArtifactEditor,
}: {
  dayCols: TDayCol[];
  openArtifactEditor: (artifactEditor: TArtifactEditor) => void;
}) {
  const dispatch = useAppDispatch();
  const calendarRef = useRef<HTMLDivElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const [colWidth, setColWidth] = useState(0);
  const [calculTimeOut, setCalculTimeOut] = useState<NodeJS.Timeout>();

  const [daysIndex, setDaysIndex] = useState([0, 1]);

  const calculColWidth = useCallback(() => {
    const totalWidth = calendarRef.current!.clientWidth;
    const nColMax = Math.floor(totalWidth / minColWidth);
    const nCol = Math.max(Math.min(dayCols.length, nColMax), 1);
    setDaysIndex((prevState) => {
      return [prevState[0], prevState[0] + nCol];
    });

    const initColWidth = totalWidth / nCol;
    initPlanningDimensions(
      initColWidth,
      calendarRef.current!.getBoundingClientRect()
    );
    setDropZoneBoundary(dropZoneRef.current!.getBoundingClientRect());

    setColWidth(initColWidth);
  }, [dayCols.length]);

  const onResize = useCallback(() => {
    calculTimeOut && clearTimeout(calculTimeOut);
    setCalculTimeOut(setTimeout(calculColWidth, 500));
  }, [calculColWidth, calculTimeOut]);

  useEffect(() => {
    calculColWidth();
  }, [calculColWidth]);

  useEffect(() => {
    setColIds(dayCols.map((day) => day.dateId));
  }, [dayCols]);

  useEffect(() => {
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [onResize]);

  useEffect(() => {
    document.getElementById("7")?.scrollIntoView();
  }, []);

  return (
    <div className={styles.calendarContainer}>
      <PlanningSheets />

      <CalendarHeader
        dayCols={dayCols
          .filter(
            (_dayCol, index) => index >= daysIndex[0] && index < daysIndex[1]
          )
          .map((dayCol) => dayCol.dateId)}
        daysIndex={daysIndex}
        setDaysIndex={setDaysIndex}
        nbDays={dayCols.length}
      />
      <div
        id={GRID_CONTAINER}
        className={styles.gridContainer}
        onScroll={(_event) =>
          setCalendarBoundary(calendarRef.current!.getBoundingClientRect())
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
              id={index.toString()}
              style={{ top: cellHeight * index }}
              key={hour}
              className={styles.hGridLine}
            />
          ))}
          {dayCols
            .filter(
              (_dayCol, index) => index >= daysIndex[0] && index < daysIndex[1]
            )
            .map((dayCol, index) => (
              <div
                key={dayCol.dateId}
                className={styles.dayContainer}
                style={{ width: colWidth }}
              >
                {dayCol.planningActivities.map((PA) => (
                  <DraggableCardView
                    key={`${PA.activity.id}_${dayCol.dateId}_${PA.timeIndex}`}
                    PAId={PA.id}
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
                    duplicateArtifact={() =>
                      dispatch(insertActivity({ ...PA.activity, used: 0 }))
                    }
                  >
                    {(onDeleteFromPlanning, onDelete, isHovered, isDragged) => (
                      <ArtifactTemplate
                        artifact={PA.activity}
                        isDragged={isDragged}
                        onDeleteFromPlanning={onDeleteFromPlanning}
                        onDelete={onDelete}
                        duration={PA.activity.duration}
                        artifactColor={activityColor}
                        artifactSecColor={activitySecColor}
                        artifactIcon={<ActivityIcon color={defaultWhite} />}
                        isHovered={isHovered}
                        insideCalendar
                        timeIndex={PA.timeIndex}
                        isInFirstCol={index === 0}
                      >
                        <ActivityDataCard activity={PA.activity} />
                      </ArtifactTemplate>
                    )}
                  </DraggableCardView>
                ))}
                {dayCol.planningTransports.map((PT) => (
                  <DraggableCardView
                    key={`${PT.transport.id}_${dayCol.dateId}_${PT.timeIndex}`}
                    PAId={PT.id}
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
                    duplicateArtifact={() =>
                      dispatch(insertTransport({ ...PT.transport, used: 0 }))
                    }
                  >
                    {(onDeleteFromPlanning, onDelete, isHovered, isDragged) => (
                      <ArtifactTemplate
                        artifact={PT.transport}
                        isDragged={isDragged}
                        onDeleteFromPlanning={onDeleteFromPlanning}
                        onDelete={onDelete}
                        duration={PT.transport.duration}
                        artifactColor={transportColor}
                        artifactSecColor={transportSecColor}
                        artifactIcon={<TransportIcon color={defaultWhite} />}
                        isHovered={isHovered}
                        insideCalendar
                        timeIndex={PT.timeIndex}
                        isInFirstCol={index === 0}
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
          .map((dayCol, index) => (
            <div
              key={dayCol.dateId}
              className={styles.dayAccomodationDZ}
              style={{ width: colWidth }}
            >
              {dayCol.planningAccomodations.map((PA) => (
                <DraggableCardView
                  key={`${PA.accomodation.id}_${dayCol.dateId}_${PA.timeIndex}`}
                  PAId={PA.id}
                  artifactId={PA.accomodation.id}
                  duration={1}
                  containerStyle={accomodationDropZoneDragContainerStyle(
                    colWidth - 1
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
                  duplicateArtifact={() =>
                    dispatch(
                      insertAccomodation({ ...PA.accomodation, used: 0 })
                    )
                  }
                >
                  {(onDeleteFromPlanning, onDelete, isHovered, isDragged) => (
                    <ArtifactTemplate
                      artifact={PA.accomodation}
                      isDragged={isDragged}
                      onDeleteFromPlanning={onDeleteFromPlanning}
                      onDelete={onDelete}
                      artifactColor={accomodationColor}
                      artifactSecColor={accomodationSecColor}
                      artifactIcon={<AccomodationIcon color={defaultWhite} />}
                      isHovered={isHovered}
                      insideCalendar
                      timeIndex={PA.timeIndex}
                      isInFirstCol={index === 0}
                      isAccomodation={true}
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
