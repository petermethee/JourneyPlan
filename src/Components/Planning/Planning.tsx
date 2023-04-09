import React from "react";
import SideData from "./SideData";
import { DragDropContext, DragStart, DropResult } from "react-beautiful-dnd";
import styles from "./Planning.module.css";
const onDragStart = (result: DragStart) => {};
const onDragEnd = (result: DropResult) => {};

export default function Planning() {
  return (
    <div className={styles.mainContainer}>
      <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
        <SideData />
      </DragDropContext>
    </div>
  );
}
