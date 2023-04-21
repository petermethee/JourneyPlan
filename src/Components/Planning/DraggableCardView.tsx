import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./DraggableCardView.module.css";
import { getFinalDestination } from "../../DnDCustomLib/CalendarDimensionsHelper";
import { SIDE_DATA_COL_ID } from "./SideData";
import { useAppDispatch } from "../../app/hooks";
import { setUsedActivities } from "../../features/Redux/activitySlice";
import { addArtefact, moveArtefact } from "../../features/Redux/planningSlice";

export type TDroppableInfo = { colId: string; timeIndex: number };
export type TDnDEvent = {
  darggableId: number;
  source: TDroppableInfo;
  destination: TDroppableInfo;
};

type TDraggableProps = {
  children: JSX.Element | JSX.Element[];
  id: number;
  duration: number;
  containerStyle: CSSProperties;
  source: TDroppableInfo;
  scrollYOffset: number;
  getDraggableStyle: (
    x: number,
    y: number,
    deltaMousePosition: { x: number; y: number },
    dragContainerCoord: { x: number; y: number },
    duration: number,
    scrollYOffset: number
  ) => CSSProperties;
  shwoCaseClass?: string;
  disappearAnim: string;
};
export default function DraggableCardView({
  children,
  id,
  duration,
  containerStyle,
  source,
  scrollYOffset,
  getDraggableStyle,
  shwoCaseClass,
  disappearAnim,
}: TDraggableProps) {
  const dispatch = useAppDispatch();
  const draggableRef = useRef<HTMLDivElement>(null);
  const [deltaMousePosition, setDeltaMousePosition] = useState({ x: 0, y: 0 });
  const [isDragged, setIsDragged] = useState(false);
  const [mouseDown, setMouseDown] = useState(false);
  const [style, setStyle] = useState<React.CSSProperties | undefined>();
  const [willDisappear, setWillDisappear] = useState(false);
  const [destination, setDestination] = useState<TDroppableInfo>(source);

  const onDragEnd = (event: TDnDEvent) => {
    console.log("event on drag end", event);
    const { darggableId, source, destination } = event;
    if (
      source.colId !== destination.colId ||
      source.timeIndex !== destination.timeIndex
    ) {
      if (destination.colId === SIDE_DATA_COL_ID) {
      } else if (source.colId === SIDE_DATA_COL_ID) {
        const date = destination.colId;
        const timeIndex = destination.timeIndex;
        const planningId = `${darggableId}_${date}_${timeIndex}`;
        dispatch(
          addArtefact({
            activityId: darggableId,
            date,
            timeIndex,
            id: planningId,
          })
        );
      } else {
        const date = destination.colId;
        const timeIndex = destination.timeIndex;
        const planningId = `${darggableId}_${date}_${timeIndex}`;
        dispatch(
          moveArtefact({
            id: planningId,
            activityId: darggableId,
            date,
            timeIndex,
          })
        );
      }
    }
  };

  const onMouseDown = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setMouseDown(true);
    setDeltaMousePosition({
      x: event.clientX,
      y: event.clientY,
    });
  };

  const mouseMoveListener = useCallback(
    (event: MouseEvent) => {
      if (mouseDown) {
        setIsDragged(true);
        const currentStyle = getDraggableStyle(
          event.clientX,
          event.clientY,
          deltaMousePosition,
          {
            x: draggableRef.current!.offsetLeft,
            y: draggableRef.current!.offsetTop,
          },
          duration,
          scrollYOffset
        );
        setStyle(currentStyle);
      }
    },
    [mouseDown, deltaMousePosition, duration, scrollYOffset, getDraggableStyle]
  );

  const mouseUpListener = useCallback(
    (event: MouseEvent) => {
      if (isDragged) {
        setIsDragged(false);
        const [colId, timeIndex] = getFinalDestination(
          event.clientX,
          event.clientY,
          scrollYOffset
        );

        if (
          colId !== SIDE_DATA_COL_ID &&
          (colId !== source.colId || timeIndex !== source.timeIndex)
        ) {
          setWillDisappear(true);
          setDestination({ colId, timeIndex });
          setStyle((prevState) => {
            return {
              ...prevState,
              boxShadow: "none",
              transform: "scale(1)",
              borderRadius: 3,
            };
          });
        } else {
          setStyle({ top: 0, left: 0 });
        }
      }
      setMouseDown(false);
    },
    [isDragged, scrollYOffset, source]
  );

  const onAnimationEnd = () => {
    dispatch(setUsedActivities(id));
    onDragEnd({
      darggableId: id,
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
      onAnimationEnd={onAnimationEnd}
    >
      <div
        style={style}
        className={`${styles.showcase} ${shwoCaseClass}`}
        onMouseDown={onMouseDown}
      >
        {children}
      </div>

      <div
        className={`${styles.ghost} ${shwoCaseClass}`}
        style={{
          position: "initial",
          display: isDragged || willDisappear ? "" : "none",
          animation: willDisappear
            ? `${styles.ghostDisappearAnim} 300ms ease-out forwards`
            : "none",
        }}
        onMouseDown={onMouseDown}
      >
        {children}
      </div>
    </div>
  );
}
