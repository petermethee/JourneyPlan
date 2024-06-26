import { memo, useCallback, useEffect, useRef, useState } from "react";
import styles from "./CalendarView.module.css";
import draggableStyle from "../DraggableCardView.module.css";
import { TArtifactEditor, TDayCol } from "../Planning";
import {
  cellHeight,
  getDraggableAccommodationCalendarStyle,
  getDraggableCalendarStyle,
  getFinalDestination,
  getFinalDestinationInAccommodationDZ,
  initPlanningDimensions,
  minColWidth,
  setCalendarBoundary,
  setColIds,
  setColOffsetIndex,
  setDropZoneBoundary,
} from "../../../DnDCustomLib/CalendarDimensionsHelper";
import DraggableCardView from "../DraggableCardView";
import {
  accommodationDropZoneDragContainerStyle,
  calendarDragContainerStyle,
} from "../../../DnDCustomLib/DraggableCSS";
import HoursLabel from "./HoursLabel";
import AccommodationDropZone from "../Accommodation/AccommodationDropZone";
import CalendarHeader from "./CalendarHeader";
import ActivityDataCard from "../ArtifactsDataCard/ActivityDataCard";
import { EArtifact } from "../../../Models/EArtifacts";
import TransportDataCard from "../ArtifactsDataCard/TransportDataCard";
import AccommodationDataCard from "../ArtifactsDataCard/AccommodationDataCard";
import ArtifactTemplate from "../ArtifactsDataCard/ArtifactTemplate";
import {
  accommodationColor,
  accommodationSecColor,
  activityColor,
  activitySecColor,
  defaultWhite,
  transportColor,
  transportSecColor,
} from "../../../style/cssGlobalStyle";
import AccommodationIcon from "../../Shared/AccommodationIcon";
import ActivityIcon from "../../Shared/ActivityIcon";
import TransportIcon from "../../Shared/TransportIcon";
import PlanningSheets from "./PlanningSheets/PlanningSheets";
import { useAppDispatch } from "../../../app/hooks";
import { insertActivity } from "../../../features/Redux/activitiesSlice";
import { insertTransport } from "../../../features/Redux/transportsSlice";
import { insertAccommodation } from "../../../features/Redux/accommodationsSlice";
import { IArtifact } from "@renderer/Models/IArtifact";
import IActivity from "@renderer/Models/IActivity";
import ITransport from "@renderer/Models/ITransport";
import IAccommodation from "@renderer/Models/IAccommodation";

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
      calendarRef.current!.getBoundingClientRect(),
    );
    setDropZoneBoundary(dropZoneRef.current!.getBoundingClientRect());

    setColWidth(initColWidth);
  }, [dayCols.length]);

  const onResize = useCallback(() => {
    calculTimeOut && clearTimeout(calculTimeOut);
    setCalculTimeOut(setTimeout(calculColWidth, 500));
  }, [calculColWidth, calculTimeOut]);

  const duplicateArtifact = (PA: IArtifact, type: EArtifact) => {
    const newArtifact = {
      ...PA,
      used: false,
      name: `${PA.name} copy`,
    };
    if (type === EArtifact.Activity) {
      dispatch(insertActivity(newArtifact as IActivity));
    } else if (type === EArtifact.Transport) {
      dispatch(insertTransport(newArtifact as ITransport));
    } else {
      dispatch(insertAccommodation(newArtifact as IAccommodation));
    }
  };

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

  useEffect(() => {
    setColOffsetIndex(daysIndex[0]);
  }, [daysIndex]);

  return (
    <div className={styles.calendarContainer}>
      <PlanningSheets />

      <CalendarHeader
        dayCols={dayCols
          .filter(
            (_dayCol, index) => index >= daysIndex[0] && index < daysIndex[1],
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
              (_dayCol, index) => index >= daysIndex[0] && index < daysIndex[1],
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
                    artifact={PA.activity}
                    duration={PA.activity.duration}
                    containerStyle={calendarDragContainerStyle(
                      colWidth,
                      PA.activity.duration * cellHeight,
                      PA.timeIndex * cellHeight,
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
                      duplicateArtifact(PA.activity, EArtifact.Activity)
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
                        artifactIcon={
                          <ActivityIcon size="small" color={defaultWhite} />
                        }
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
                    artifact={PT.transport}
                    duration={PT.transport.duration}
                    containerStyle={calendarDragContainerStyle(
                      colWidth,
                      PT.transport.duration * cellHeight,
                      PT.timeIndex * cellHeight,
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
                      duplicateArtifact(PT.transport, EArtifact.Transport)
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
                        artifactIcon={
                          <TransportIcon size="small" color={defaultWhite} />
                        }
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
      <AccommodationDropZone dropZoneRef={dropZoneRef}>
        {dayCols
          .filter(
            (_dayCol, index) => index >= daysIndex[0] && index < daysIndex[1],
          )
          .map((dayCol, index) => (
            <div
              key={dayCol.dateId}
              className={styles.dayAccommodationDZ}
              style={{ width: colWidth }}
            >
              {dayCol.planningAccommodations.map((PA) => (
                <DraggableCardView
                  key={`${PA.accommodation.id}_${dayCol.dateId}_${PA.timeIndex}`}
                  PAId={PA.id}
                  artifact={PA.accommodation}
                  duration={1}
                  containerStyle={accommodationDropZoneDragContainerStyle(
                    colWidth - 1,
                  )}
                  source={{ colId: dayCol.dateId, timeIndex: PA.timeIndex }}
                  getDraggableStyle={getDraggableAccommodationCalendarStyle}
                  disappearAnim={draggableStyle.calendarDisappear}
                  shwoCaseClass={draggableStyle.calendarShowcase}
                  artifactType={EArtifact.Accommodation}
                  getFinalDestination={getFinalDestinationInAccommodationDZ}
                  editArtifact={() =>
                    openArtifactEditor({
                      type: EArtifact.Accommodation,
                      artifact: PA.accommodation,
                    })
                  }
                  duplicateArtifact={() =>
                    duplicateArtifact(PA.accommodation, EArtifact.Accommodation)
                  }
                >
                  {(onDeleteFromPlanning, onDelete, isHovered, isDragged) => (
                    <ArtifactTemplate
                      artifact={PA.accommodation}
                      isDragged={isDragged}
                      onDeleteFromPlanning={onDeleteFromPlanning}
                      onDelete={onDelete}
                      artifactColor={accommodationColor}
                      artifactSecColor={accommodationSecColor}
                      artifactIcon={
                        <AccommodationIcon size="small" color={defaultWhite} />
                      }
                      isHovered={isHovered}
                      insideCalendar
                      timeIndex={PA.timeIndex}
                      isInFirstCol={index === 0}
                      isAccommodation={true}
                    >
                      <AccommodationDataCard accommodation={PA.accommodation} />
                    </ArtifactTemplate>
                  )}
                </DraggableCardView>
              ))}
            </div>
          ))}
      </AccommodationDropZone>
    </div>
  );
}

export default memo(CalendarView);
