import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "./DraggableCardView.module.css";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  deleteActivity,
  selectActivities,
  setUsedActivities,
} from "../../features/Redux/activitiesSlice";
import {
  addArtifact,
  deleteArtifactFromPlanning,
  moveArtifact,
  selectPlanningArtifacts,
  setArtifactIsDragged,
} from "../../features/Redux/planningSlice";
import { SIDE_DATA_COL_ID } from "./SideData/SideData";
import { EArtifact } from "../../Models/EArtifacts";
import {
  deleteTransport,
  selectTransports,
  setUsedTransports,
} from "../../features/Redux/transportsSlice";
import {
  deleteAccomodation,
  setUsedAccomodations,
} from "../../features/Redux/accomodationsSlice";
import { defaultWhite } from "../../style/cssGlobalStyle";

export type TDroppableInfo = { colId: string; timeIndex: number };
export type TDnDEvent = {
  artifactId: number;
  source: TDroppableInfo;
  destination: TDroppableInfo;
};

type TDraggableProps = {
  children: (
    onDeleteFromPlanning: () => void,
    onDelete: () => void,
    isDragged?: boolean
  ) => JSX.Element | JSX.Element[];
  planningId?: string;
  artifactId: number;
  duration: number;
  containerStyle: CSSProperties;
  source: TDroppableInfo;
  getDraggableStyle: (
    x: number,
    y: number,
    deltaMousePosition: { x: number; y: number },
    dragContainerCoord: { x: number; y: number },
    duration: number
  ) => CSSProperties;
  shwoCaseClass?: string;
  disappearAnim: string;
  artifactType: EArtifact;
  getFinalDestination(
    x: number,
    y: number,
    allowSideData: boolean
  ): [string, number];
  editArtifact: () => void;
};
export default function DraggableCardView({
  planningId,
  children,
  artifactId,
  duration,
  containerStyle,
  source,
  getDraggableStyle,
  shwoCaseClass,
  disappearAnim,
  artifactType,
  getFinalDestination,
  editArtifact,
}: TDraggableProps) {
  const dispatch = useAppDispatch();
  const planningArtifacts = useAppSelector(selectPlanningArtifacts);
  const activities = useAppSelector(selectActivities);
  const transports = useAppSelector(selectTransports);

  const draggableRef = useRef<HTMLDivElement>(null);
  const [deltaMousePosition, setDeltaMousePosition] = useState({ x: 0, y: 0 });
  const [isDragged, setIsDragged] = useState(false);
  const [mouseDown, setMouseDown] = useState(false);
  const [style, setStyle] = useState<React.CSSProperties | undefined>();
  const [willDisappear, setWillDisappear] = useState(false);
  const [willBeDeletedFromPlanning, setWillBeDeletedFromPlanning] =
    useState(false);
  const [usedWillDisappear, setUsedWillDisappear] = useState(false);
  const [willBeDeleted, setWillBeDeleted] = useState(false);

  const [destination, setDestination] = useState<TDroppableInfo>(source);

  const containerAnimation = useMemo(() => {
    if (willDisappear || willBeDeleted) {
      return `${disappearAnim} 300ms ease-out forwards`;
    } else if (disappearAnim === styles.calendarDisappear) {
      return "none";
    } else {
      return `300ms ease-out ${styles.sideDataAppearAnim}`;
    }
  }, [willDisappear, willBeDeleted, disappearAnim]);

  const ghostAnimation = useMemo(() => {
    if (usedWillDisappear) {
      return `${styles.usedDisappearAnim} 300ms ease-out forwards`;
    } else if (willDisappear) {
      return `${styles.ghostDisappearAnim} 300ms ease-out forwards`;
    } else {
      return "none";
    }
  }, [usedWillDisappear, willDisappear]);

  const onDragEnd = useCallback(
    (event: TDnDEvent) => {
      const { artifactId, source, destination } = event;
      if (
        source.colId !== destination.colId ||
        source.timeIndex !== destination.timeIndex
      ) {
        if (planningId) {
          const date = destination.colId;
          const timeIndex = destination.timeIndex;
          const newPlanningId = `${artifactId}_${date}_${timeIndex}`;

          dispatch(
            moveArtifact({
              PA: {
                id: newPlanningId,
                artifactId: artifactId,
                date,
                timeIndex,
                artifactType,
              },
              prevPAId: planningId,
            })
          );
        } else {
          const date = destination.colId;
          const timeIndex = destination.timeIndex;
          const newPlanningId = `${artifactId}_${date}_${timeIndex}`;

          dispatch(
            addArtifact({
              artifactId: artifactId,
              date,
              timeIndex,
              id: newPlanningId,
              artifactType,
            })
          );
        }
        setUsedWillDisappear(false);
        setStyle({ top: 0, left: 0, transition: "0s" });
      }
    },
    [artifactType, planningId, dispatch]
  );

  const checkCollision = useCallback(
    (colId: string, timeIndex: number) => {
      return planningArtifacts.some((PA) => {
        if (PA.id === planningId) {
          return false;
        }
        if (artifactType === EArtifact.Accomodation) {
          return (
            PA.date === colId && PA.artifactType === EArtifact.Accomodation
          );
        } else {
          let currentDuration = 1;

          if (PA.artifactType === EArtifact.Activity) {
            currentDuration = activities.find(
              (activity) => activity.id === PA.artifactId
            )!.duration;
          } else {
            currentDuration = transports.find(
              (transport) => transport.id === PA.artifactId
            )!.duration;
          }
          if (PA.date === colId) {
            //SAME DAY
            if (
              PA.timeIndex <= timeIndex &&
              PA.timeIndex + currentDuration > timeIndex
            ) {
              return true;
            } else if (
              timeIndex <= PA.timeIndex &&
              timeIndex + duration > PA.timeIndex
            ) {
              return true;
            }
          }
          return false;
        }
      });
    },
    [
      planningArtifacts,
      activities,
      transports,
      artifactType,
      duration,
      planningId,
    ]
  );

  const onMouseDown = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setMouseDown(true);
    setDeltaMousePosition({
      x: event.clientX - draggableRef.current!.getBoundingClientRect().left,
      y: event.clientY - draggableRef.current!.getBoundingClientRect().top,
    });
  };

  const mouseMoveListener = useCallback(
    (event: MouseEvent) => {
      if (mouseDown) {
        draggableRef.current!.style.cursor = "grabbing ";
        setIsDragged(true);

        dispatch(setArtifactIsDragged(artifactType));
        const currentStyle = getDraggableStyle(
          event.clientX,
          event.clientY,
          deltaMousePosition,
          {
            x: draggableRef.current!.offsetLeft,
            y: draggableRef.current!.offsetTop,
          },
          duration
        );
        setStyle(currentStyle);
      }
    },
    [
      mouseDown,
      deltaMousePosition,
      duration,
      getDraggableStyle,
      artifactType,
      dispatch,
    ]
  );

  const mouseUpListener = useCallback(
    (event: MouseEvent) => {
      if (isDragged) {
        dispatch(setArtifactIsDragged(null));
        draggableRef.current!.style.cursor = "pointer";
        setIsDragged(false);
        const [colId, timeIndex] = getFinalDestination(
          event.clientX,
          event.clientY,
          source.colId === SIDE_DATA_COL_ID
        );

        if (
          colId !== SIDE_DATA_COL_ID &&
          (colId !== source.colId || timeIndex !== source.timeIndex) &&
          !checkCollision(colId, timeIndex)
        ) {
          setStyle((prevState) => {
            return {
              ...prevState,
              boxShadow: "none",
              transform: "scale(1)",
              borderRadius: "5px",
              backgroundColor: defaultWhite,
            };
          });
          if (disappearAnim === "" && source.colId === SIDE_DATA_COL_ID) {
            setUsedWillDisappear(true);
          } else {
            setWillDisappear(true);
          }
          setDestination({ colId, timeIndex });
        } else {
          setStyle({ top: 0, left: 0 });
        }
      }
      if (mouseDown) {
        setMouseDown(false);
        if (!isDragged) {
          editArtifact();
        }
      }
    },
    [
      isDragged,
      mouseDown,
      source,
      disappearAnim,
      getFinalDestination,
      dispatch,
      checkCollision,
      editArtifact,
    ]
  );

  const onAnimationEnd = (event: React.AnimationEvent) => {
    if (
      event.animationName === disappearAnim ||
      event.animationName === styles.usedDisappearAnim
    ) {
      if (
        source.colId === SIDE_DATA_COL_ID &&
        destination.colId !== SIDE_DATA_COL_ID &&
        event.animationName !== styles.usedDisappearAnim
      ) {
        switch (artifactType) {
          case EArtifact.Activity:
            dispatch(setUsedActivities(artifactId));
            break;
          case EArtifact.Transport:
            dispatch(setUsedTransports(artifactId));
            break;
          default:
            dispatch(setUsedAccomodations(artifactId));
            break;
        }
      }
      onDragEnd({
        artifactId: artifactId,
        destination: destination,
        source,
      });
    }
  };

  const onDeleteAnimationEnd = (event: React.AnimationEvent) => {
    if (event.animationName === styles.ghostDisappearAnim && planningId) {
      dispatch(deleteArtifactFromPlanning(planningId!));
      if (
        planningArtifacts.filter((PA) => PA.artifactId === artifactId)
          .length === 1
      ) {
        switch (artifactType) {
          case EArtifact.Activity:
            dispatch(setUsedActivities(artifactId));

            break;
          case EArtifact.Transport:
            dispatch(setUsedTransports(artifactId));
            break;

          default:
            dispatch(setUsedAccomodations(artifactId));
            break;
        }
      }
    } else {
      switch (artifactType) {
        case EArtifact.Activity:
          dispatch(deleteActivity(artifactId));

          break;
        case EArtifact.Transport:
          dispatch(deleteTransport(artifactId));
          break;

        default:
          dispatch(deleteAccomodation(artifactId));
          break;
      }
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", mouseMoveListener);

    return () => {
      window.removeEventListener("mousemove", mouseMoveListener);
    };
  }, [mouseMoveListener]);

  useEffect(() => {
    window.addEventListener("mouseup", mouseUpListener);
    return () => {
      window.removeEventListener("mouseup", mouseUpListener);
    };
  }, [mouseUpListener]);

  return (
    <div
      ref={draggableRef}
      className={styles.draggableContainer}
      style={{
        ...containerStyle,
        animation: containerAnimation,
      }}
      onAnimationEnd={onAnimationEnd} //is also triggered when child animation ends
    >
      <div
        className={`${styles.ghost} ${shwoCaseClass}`}
        style={{
          position: "initial",
          display:
            isDragged || willDisappear || usedWillDisappear ? "" : "none",
          animation: ghostAnimation,
        }}
        onMouseDown={onMouseDown}
      >
        {children(
          () => {},
          () => {},
          usedWillDisappear
        )}
      </div>
      <div
        style={{
          height: style?.height,
          width: style?.width,
          top: style?.top,
          left: style?.left,
          borderRadius: style?.borderRadius,
        }}
        className={styles.shadowPosition}
      />
      <div
        style={style}
        className={`${styles.showcase} ${shwoCaseClass} ${
          (willBeDeletedFromPlanning || willBeDeleted) && styles.deleteAnim
        }`}
        onMouseDown={onMouseDown}
        onAnimationEnd={onDeleteAnimationEnd}
      >
        {children(
          () => setWillBeDeletedFromPlanning(true),
          () => setWillBeDeleted(true),
          isDragged || willDisappear || usedWillDisappear
        )}
      </div>
    </div>
  );
}
