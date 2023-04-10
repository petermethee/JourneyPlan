import React from "react";
import DraggableCardView from "./DraggableCardView";
import { Droppable } from "react-beautiful-dnd";
import styles from "./SideData.module.css";

export default function SideData({
  unusedActivities,
}: {
  unusedActivities: string[];
}) {
  return (
    <Droppable droppableId="SideData">
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={styles.sideDataContainer}
        >
          {unusedActivities.map((m, i) => (
            <DraggableCardView key={i} id={m} index={i}>
              <div>{m}</div>
            </DraggableCardView>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}
