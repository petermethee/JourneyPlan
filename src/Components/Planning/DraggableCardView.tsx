import React, {
  CSSProperties,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./DraggableCardView.module.css";
import {
  getDraggableStyle,
  getFinalDestination,
} from "../../DnDCustomLib/CalendarDimensionsHelper";
import {
  DragNDropContext,
  TDroppableInfo,
} from "../../DnDCustomLib/DnDContext";

export default function DraggableCardView({
  children,
  id,
  duration,
  containerStyle,
  source,
  className,
  sideDataUsed,
}: {
  children: JSX.Element | JSX.Element[];
  id: number;
  duration: number;
  containerStyle: CSSProperties;
  source: TDroppableInfo;
  className?: string;
  sideDataUsed?: boolean;
}) {
  const draggableRef = useRef<HTMLDivElement>(null);
  const dndContext = useContext(DragNDropContext);
  const [deltaMousePosition, setDeltaMousePosition] = useState({ x: 0, y: 0 });
  const [isDragged, setIsDragged] = useState(false);
  const [mouseDown, setMouseDown] = useState(false);
  const [style, setStyle] = useState<React.CSSProperties | undefined>();

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
          duration
        );
        setStyle(currentStyle);
      }
    },
    [mouseDown, deltaMousePosition, duration]
  );

  const mouseUpListener = useCallback(
    (event: MouseEvent) => {
      if (isDragged) {
        setIsDragged(false);
        const [colId, timeIndex] = getFinalDestination(
          event.clientX,
          event.clientY
        );
        dndContext.onDragEnd({
          darggableId: id,
          destination: { colId, timeIndex },
          source,
        });
        //setStyle({ top: 0, left: 0 });
      }
      setMouseDown(false);
    },
    [isDragged, dndContext, id, source]
  );

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
      style={containerStyle}
    >
      <div
        style={style}
        className={`${styles.card} ${className}`}
        onMouseDown={onMouseDown}
      >
        {children}
      </div>

      <div
        className={`${styles.card} ${styles.ghost} ${className}`}
        style={{
          position: "initial",
          display: isDragged ? "" : "none",
        }}
        onMouseDown={onMouseDown}
      >
        {children}
      </div>
    </div>
  );
}
