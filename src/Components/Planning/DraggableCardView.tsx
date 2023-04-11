import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./DraggableCardView.module.css";
import {
  getClampedPosition,
  getFinalDestination,
} from "../../DnDCustomLib/DnDHelper";
import { DragNDropContext } from "../../DnDCustomLib/DnDContext";
import { onDragStyle, onDropStyle } from "../../DnDCustomLib/DndStyle";

export default function DraggableCardView({
  children,
  backgroundColor = "#ffffff6e",
  className,
  id,
  index,
}: {
  children: JSX.Element | JSX.Element[];
  backgroundColor?: string;
  className?: string;
  id: number;
  index: number;
}) {
  const dndContext = useContext(DragNDropContext);
  let nsDragging = false;
  let nsDeltaMousePosition = { x: 0, y: 0 };
  const [initialCoord, setInitialCoord] = useState({ x: 0, y: 0 });
  const draggableRef = useRef<HTMLDivElement>(null);

  const [style, setStyle] = useState<React.CSSProperties | undefined>();
  const onMouseDown = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    nsDragging = true;
    const bounds = event.currentTarget.getBoundingClientRect();
    nsDeltaMousePosition = {
      x: event.clientX - bounds.x,
      y: event.clientY - bounds.y,
    };
  };
  window.addEventListener("mousemove", (event) => {
    if (nsDragging) {
      const [x, y] = getClampedPosition(
        event.clientX,
        event.clientY,
        nsDeltaMousePosition
      );
      /* setCoord({
        x: x - initialCoord.x,
        y: y - initialCoord.y,
      }); */
      setStyle(onDragStyle(x - initialCoord.x, y - initialCoord.y));
    }
  });
  window.addEventListener("mouseup", (event) => {
    if (nsDragging) {
      nsDragging = false;
      const [x, y] = getFinalDestination(event.clientX, event.clientY);
      dndContext.onDragEnd({
        id,
        destination: { dayIndex: x, timeIndex: y },
        source: "",
      });
      setStyle(onDropStyle);
    }
  });

  useEffect(() => {
    setInitialCoord({
      x: draggableRef.current!.getBoundingClientRect().x,
      y: draggableRef.current!.getBoundingClientRect().y,
    });
  }, []);

  return (
    <div
      ref={draggableRef}
      style={{ ...style, backgroundColor: backgroundColor }}
      className={`${styles.card} ${className}`}
      onMouseDown={onMouseDown}
    >
      {children}
    </div>
  );
}
