import React from "react";
import styles from "./DraggableCardView.module.css";
import { Draggable } from "react-beautiful-dnd";

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
  id: string;
  index: number;
}) {
  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => {
        return (
          <div
            ref={provided.innerRef}
            style={{ backgroundColor: backgroundColor }}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`${styles.card} ${className}`}
          >
            {children}
          </div>
        );
      }}
    </Draggable>
  );
}
