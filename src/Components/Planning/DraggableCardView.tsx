import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./DraggableCardView.module.css";
import { useAppDispatch } from "../../app/hooks";
import { setUsedActivities } from "../../features/Redux/activitiesSlice";
import { addArtifact, moveArtifact } from "../../features/Redux/planningSlice";
import { SIDE_DATA_COL_ID } from "./SideData/SideData";
import { EArtifact } from "../../Models/EArtifacts";
import { setUsedTransports } from "../../features/Redux/transportsSlice";
import {
  setAccomdationIsDragged,
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
  children: (isDragged?: boolean) => JSX.Element | JSX.Element[];
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
  const draggableRef = useRef<HTMLDivElement>(null);
  const [deltaMousePosition, setDeltaMousePosition] = useState({ x: 0, y: 0 });
  const [isDragged, setIsDragged] = useState(false);
  const [mouseDown, setMouseDown] = useState(false);
  const [style, setStyle] = useState<React.CSSProperties | undefined>();
  const [willDisappear, setWillDisappear] = useState(false);
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
        artifactType === EArtifact.Accomodation &&
          dispatch(setAccomdationIsDragged(true));
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
        artifactType === EArtifact.Accomodation &&
          dispatch(setAccomdationIsDragged(false));
        draggableRef.current!.style.cursor = "pointer ";
        setIsDragged(false);
        const [colId, timeIndex] = getFinalDestination(
          event.clientX,
          event.clientY,
          source.colId === SIDE_DATA_COL_ID
        );

        if (
          colId !== SIDE_DATA_COL_ID &&
          (colId !== source.colId || timeIndex !== source.timeIndex)
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
      artifactType,
      dispatch,
    ]
  );

  const onAnimationEnd = () => {
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
          : "none",
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
        {children(usedWillDisappear)}
      </div>
      <div
        style={style}
        className={`${styles.showcase} ${shwoCaseClass}`}
        onMouseDown={onMouseDown}
      >
        {children(isDragged || willDisappear || usedWillDisappear)}
      </div>
    </div>
  );
}
