import React, { useEffect, useRef, useState } from "react";
import styles from "./DraggableCardView.module.css";
import { getCollisionPosition } from "../../Helper/planningHelper";

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
  let nsDragging = false;
  let nsDeltaMousePosition = { x: 0, y: 0 };
  const [initialCoord, setInitialCoord] = useState({ x: 0, y: 0 });
  const draggableRef = useRef<HTMLDivElement>(null);
  const [coord, setCoord] = useState({ x: 0, y: 0 });

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
      const [x, y] = getCollisionPosition(
        event.clientX,
        event.clientY,
        nsDeltaMousePosition
      );
      setCoord({
        x: x - initialCoord.x,
        y: y - initialCoord.y,
      });
    }
  });
  window.addEventListener("mouseup", (event) => {
    if (nsDragging) {
      nsDragging = false;
      onDragEnd(id);
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
