import React, {
  CSSProperties,
  useCallback,
  useContext,
  useEffect,
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
  index,
  initialStyle,
}: {
  children: JSX.Element | JSX.Element[];
  backgroundColor?: string;
  id: number;
  index: number;
  initialStyle: CSSProperties;
}) {
  const dndContext = useContext(DragNDropContext);
  // let nsDragging = false;
  const [deltaMousePosition, setDeltaMousePosition] = useState({ x: 0, y: 0 });
  const [isDragged, setIsDragged] = useState(false);
  const [mouseDown, setMouseDown] = useState(false);
  const [style, setStyle] = useState<React.CSSProperties | undefined>(
    initialStyle
  );

  const onMouseDown = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setMouseDown(true);
    const bounds = event.currentTarget.getBoundingClientRect();
    setDeltaMousePosition({
      x: event.clientX - bounds.x,
      y: event.clientY - bounds.y,
    });
  };

  const mouseMoveListener = useCallback(
    (event: MouseEvent) => {
      if (mouseDown) {
        setIsDragged(true);
        const currentStyle = getDraggableStyle(
          event.clientX,
          event.clientY,
          deltaMousePosition
        );
        setStyle(currentStyle);
      }
    },
    [mouseDown, deltaMousePosition]
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
        setStyle(initialStyle);
      }
      setMouseDown(false);
    },
    [isDragged, initialStyle, dndContext, id]
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
    <>
      <div
        style={{ ...style, backgroundColor: backgroundColor }}
        className={styles.card}
        onMouseDown={onMouseDown}
      >
        {children}
      </div>
      <div
        className={styles.card}
        style={{
          ...initialStyle,
          display: isDragged ? "" : "none",
          opacity: 0.5,
        }}
        onMouseDown={onMouseDown}
      >
        {children}
      </div>
    </>
  );
}
