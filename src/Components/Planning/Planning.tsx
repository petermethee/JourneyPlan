import React, { useEffect, useState } from "react";
import SideData from "./SideData";
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

  const onDragEnd = () => {};

  useEffect(() => {
    dispatch(getAllActivities(parseInt(tripId)));
  }, [dispatch, tripId]);

  useEffect(() => {
    console.log("activities", activities);
  }, [activities]);
  return (
    <div className={styles.mainContainer}>
      <SideData unusedActivities={unusedActivities} />
      <CalendarView />
    </div>
  );
}
