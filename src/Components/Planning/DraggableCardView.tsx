import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./DraggableCardView.module.css";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectActivities,
  setUsedActivities,
} from "../../features/Redux/activitiesSlice";
import {
  addArtifact,
  deleteArtifact,
  moveArtifact,
  selectPlanningArtifacts,
  setArtifactIsDragged,
} from "../../features/Redux/planningSlice";
import { SIDE_DATA_COL_ID } from "./SideData/SideData";
import { EArtifact } from "../../Models/EArtifacts";
import {
  selectTransports,
  setUsedTransports,
} from "../../features/Redux/transportsSlice";
import { setUsedAccomodations } from "../../features/Redux/accomodationsSlice";
import { defaultWhite } from "../../style/cssGlobalStyle";

export type TDroppableInfo = { colId: string; timeIndex: number };
export type TDnDEvent = {
  artifactId: number;
  source: TDroppableInfo;
  destination: TDroppableInfo;
};

type TDraggableProps = {
  children: (
    onDelete: () => void,
    isDragged?: boolean
  ) => JSX.Element | JSX.Element[];
  planningId: string;
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
  const [willBeDeleted, setWillBeDeleted] = useState(false);

  const [usedWillDisappear, setUsedWillDisappear] = useState(false);

  const [destination, setDestination] = useState<TDroppableInfo>(source);

  const onDragEnd = useCallback(
    (event: TDnDEvent) => {
      const { artifactId, source, destination } = event;

      if (
        source.colId !== destination.colId ||
        source.timeIndex !== destination.timeIndex
      ) {
        if (source.colId !== SIDE_DATA_COL_ID) {
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
      return planningArtifacts.some((planningArtifact) => {
        if (planningArtifact.artifactId === artifactId) {
          return false;
        }
        let duration = 1;
        if (planningArtifact.artifactType === EArtifact.Activity) {
          duration = activities.find(
            (activity) => activity.id === planningArtifact.artifactId
          )!.duration;
        } else if (planningArtifact.artifactType === EArtifact.Transport) {
          duration = transports.find(
            (transport) => transport.id === planningArtifact.artifactId
          )!.duration;
        }
        return (
          planningArtifact.date === colId &&
          planningArtifact.timeIndex <= timeIndex &&
          planningArtifact.timeIndex + duration > timeIndex
        );
      });
    },
    [planningArtifacts, activities, transports, artifactId]
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
    ]
  );

  const onAnimationEnd = (event: React.AnimationEvent) => {
    if (event.animationName === disappearAnim) {
      if (source.colId === SIDE_DATA_COL_ID) {
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
    if (event.animationName === styles.ghostDisappearAnim) {
      dispatch(deleteArtifact(artifactId));
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
        animation: willDisappear
          ? `${disappearAnim} 300ms ease-out forwards`
          : disappearAnim === styles.calendarDisappear
          ? "none"
          : `${styles.sideDataAppearAnim} 300ms ease-out both `,
      }}
      onAnimationEnd={onAnimationEnd} //is also triggered when child animation ends
    >
      <div
        className={`${styles.ghost} ${shwoCaseClass}`}
        style={{
          position: "initial",
          display:
            isDragged || willDisappear || usedWillDisappear ? "" : "none",
          animation: usedWillDisappear
            ? `${styles.usedDisappearAnim} 300ms ease-out forwards`
            : willDisappear
            ? `${styles.ghostDisappearAnim} 300ms ease-out forwards`
            : "none",
        }}
        onMouseDown={onMouseDown}
      >
        {children(() => {}, usedWillDisappear)}
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
          willBeDeleted && styles.deleteAnim
        }`}
        onMouseDown={onMouseDown}
        onAnimationEnd={(event) => onDeleteAnimationEnd(event)}
      >
        {children(
          () => setWillBeDeleted(true),
          isDragged || willDisappear || usedWillDisappear
        )}
      </div>
    </div>
  );
}
