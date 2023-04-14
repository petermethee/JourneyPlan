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
import { DragNDropContext } from "../../DnDCustomLib/DnDContext";

export default function DraggableCardView({
  children,
  backgroundColor = "#ffffff6e",
  id,
  duration,
  containerStyle,
  className,
}: {
  children: JSX.Element | JSX.Element[];
  backgroundColor?: string;
  id: number;
  duration: number;
  containerStyle: CSSProperties;
  className?: string;
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
        const [x, y] = getFinalDestination(event.clientX, event.clientY);
        dndContext.onDragEnd({
          id,
          destination: { dayIndex: x, timeIndex: y },
          source: "",
        });
        setStyle(containerStyle);
      }
      setMouseDown(false);
    },
    [isDragged, containerStyle, dndContext, id]
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
        style={{ ...style, backgroundColor: backgroundColor }}
        className={`${styles.card} ${className}`}
        onMouseDown={onMouseDown}
      >
        {children}
      </div>

      <div
        className={`${styles.card} ${styles.ghost} ${className}`}
        style={{
          display: isDragged ? "" : "none",
        }}
        onMouseDown={onMouseDown}
      >
        {children}
      </div>
    </div>
  );
}
