import React from "react";
import DraggableCardView from "./DraggableCardView";
import { Droppable } from "react-beautiful-dnd";
import styles from "./SideData.module.css";
export default function SideData() {
  const map = [0, 0, 0, 0, 0, 0, 0, 0];
  return (
    <Droppable droppableId="SideData">
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={styles.sideDataContainer}
        >
          {map.map((m, i) => (
            <DraggableCardView key={i} id={i} index={i}>
              <div>Test {i}</div>
            </DraggableCardView>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}
