import React, { useEffect } from "react";
import SideData from "./SideData";
import { DragDropContext, DragStart, DropResult } from "react-beautiful-dnd";
import styles from "./Planning.module.css";

export default function Planning() {
  const onDragStart = (result: DragStart) => {};
  const onDragEnd = (result: DropResult) => {};

  useEffect(() => {}, []);
  return (
    <div className={styles.mainContainer}>
      <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
        <SideData />
      </DragDropContext>
    </div>
  );
}
