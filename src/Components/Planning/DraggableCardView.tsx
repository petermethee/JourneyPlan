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
  id: number;
  index: number;
}) {
  return (
    <Draggable draggableId={id.toString()} index={index}>
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
