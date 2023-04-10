import React, { useEffect, useMemo, useState } from "react";
import SideData from "./SideData";
import styles from "./Planning.module.css";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  getAllActivities,
  selectActivities,
} from "../../features/Redux/activitySlice";
import { useParams } from "react-router-dom";
import CalendarView from "./CalendarView";
import { selectCurrentTrip } from "../../features/Redux/tripSlice";
import dayjs from "dayjs";
import { selectPlanningActivities } from "../../features/Redux/planningSlice";
import IActivity from "../../Models/IActivity";

type TDayActivity = { id: string; time: number; activity: IActivity };
export type TDayCol = {
  id: string;
  name: string;
  activities: TDayActivity[];
};

export default function Planning() {
  const tripId = useParams().tripId!;
  const activities = useAppSelector(selectActivities);
  const selectedTrip = useAppSelector(selectCurrentTrip);
  const planningActivities = useAppSelector(selectPlanningActivities);
  const [unusedActivities, setUnusedActivities] = useState(activities);

  const [usedActivities, setUsedActivities] = useState<string[]>([]);

  const dispatch = useAppDispatch();

  const onDragEnd = () => {};

  const dayCols: TDayCol[] = useMemo(() => {
    if (selectedTrip) {
      const planningActivitiesCopy = [...planningActivities];
      const dateRange = [
        dayjs(selectedTrip!.start_date),
        dayjs(selectedTrip!.end_date),
      ];
      let currentDay = dateRange[0];
      const columns: TDayCol[] = [];
      while (currentDay < dateRange[1] && columns.length < 5) {
        const dateId = currentDay
          .locale("fr")
          .format("DD MMM YYYY")
          .toUpperCase();
        const correctActivies = planningActivitiesCopy.filter(
          (p) => p.date === dateId
        );
        const dayActivities: TDayActivity[] = correctActivies.map((a) => {
          return {
            id: a.id,
            time: a.hour,
            activity: activities.find(
              (activity) => activity.id === a.activity
            )!,
          };
        });

        columns.push({
          id: dateId,
          name: dateId,
          activities: dayActivities,
        });
        currentDay.add(1, "day");
      }
      return columns;
    }
    return [];
  }, [selectedTrip]);

  useEffect(() => {
    //dispatch(getAllActivities(parseInt(tripId)));
  }, [dispatch, tripId]);

  useEffect(() => {
    setUnusedActivities(activities);
  }, [activities]);

  return (
    <div className={styles.mainContainer}>
      <SideData unusedActivities={unusedActivities} />
      <CalendarView dayCols={dayCols} />
    </div>
  );
}
