import React, { useEffect } from "react";
import styles from "./CalendarView.module.css";
import { useAppSelector } from "../../app/hooks";
import { selectCurrentTrip } from "../../features/Redux/tripSlice";
import { Droppable } from "react-beautiful-dnd";
export default function CalendarView() {
  const selectedTrip = useAppSelector(selectCurrentTrip);

  const hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  useEffect(() => {
    console.log("trip current", selectedTrip);
  }, []);

  return (
    <div className={styles.hoursContainer}>
      {hours.map((m, i) => (
        <Droppable droppableId={"day" + i}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={styles.hourContainer}
            >
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      ))}
    </div>
  );
}
