import React, { useEffect, useRef, useState } from "react";
import styles from "./DraggableCardView.module.css";

export default function DraggableCardView({
  children,
  backgroundColor = "#ffffff6e",
  className,
  id,
  index,
  onDragEnd,
}: {
  children: JSX.Element | JSX.Element[];
  backgroundColor?: string;
  className?: string;
  id: number;
  index: number;
  onDragEnd: (id: number) => void;
}) {
  let dragging = false;
  let initialMouseCoord = { x: 0, y: 0 };
  const draggableRef = useRef<HTMLDivElement>(null);
  const [coord, setCoord] = useState({ x: 0, y: 0 });

  const onMouseDown = (event: React.MouseEvent<HTMLElement>) => {
    dragging = true;
    initialMouseCoord = { x: event.clientX, y: event.clientY };
  };

  window.addEventListener("mousemove", (event) => {
    if (dragging) {
      console.log("tag", event);

      setCoord({
        x: event.clientX - initialMouseCoord.x,
        y: event.clientY - initialMouseCoord.y,
      });
    }
  });
  window.addEventListener("mouseup", (event) => {
    if (dragging) {
      dragging = false;
      onDragEnd(id);
    }
  });

  useEffect(() => {
    setCoord({
      x: draggableRef.current!.clientLeft,
      y: draggableRef.current!.clientTop,
    });
  }, []);

  return (
    <div
      ref={draggableRef}
      style={{
        backgroundColor: backgroundColor,
        left: coord.x,
        top: coord.y,
      }}
      className={`${styles.card} ${className}`}
      onMouseDown={onMouseDown}
    >
      {children}
    </div>
  );
}
