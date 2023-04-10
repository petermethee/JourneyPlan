import React, { useEffect } from "react";
import styles from "./CalendarView.module.css";
import { useAppSelector } from "../../app/hooks";
import { selectCurrentTrip } from "../../features/Redux/tripSlice";

export default function CalendarView() {
  const selectedTrip = useAppSelector(selectCurrentTrip);

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    console.log("drag", event);
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    console.log("drop", event);
  };

  useEffect(() => {
    console.log("trip current", selectedTrip);
  }, []);

  return (
    <div
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={styles.hoursContainer}
    ></div>
  );
}
