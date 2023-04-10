import React, { useEffect, useState } from "react";
import SideData from "./SideData";
import { DragDropContext, DragStart, DropResult } from "react-beautiful-dnd";
import styles from "./Planning.module.css";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  getAllActivities,
  selectActivities,
} from "../../features/Redux/activitySlice";
import { useParams } from "react-router-dom";
import CalendarView from "./CalendarView";

export default function Planning() {
  const tripId = useParams().tripId!;
  const activities = useAppSelector(selectActivities);

  const [unusedActivities, setUnusedActivities] = useState([
    "sport",
    "guitare",
    "lecture",
    "Maths",
    "Français",
    "Anglais",
    "Espagnole",
    "Japonais",
  ]);

  const [usedActivities, setUsedActivities] = useState<string[]>([]);

  const dispatch = useAppDispatch();
  const onDragStart = (result: DragStart) => {};
  const onDragEnd = (result: DropResult) => {};

  useEffect(() => {
    dispatch(getAllActivities(parseInt(tripId)));
  }, [dispatch, tripId]);

  useEffect(() => {
    console.log("activities", activities);
  }, [activities]);
  return (
    <div className={styles.mainContainer}>
      <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
        <SideData unusedActivities={unusedActivities} />
        <CalendarView />
      </DragDropContext>
    </div>
  );
}
