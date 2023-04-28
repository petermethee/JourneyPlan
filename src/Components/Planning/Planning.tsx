import React, { useEffect, useMemo } from "react";
import styles from "./Planning.module.css";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  getAllActivities,
  selectActivities,
} from "../../features/Redux/activitiesSlice";
import { useParams } from "react-router-dom";
import CalendarView from "./Calendar/CalendarView";
import { selectCurrentTrip } from "../../features/Redux/tripSlice";
import dayjs from "dayjs";
import IActivity from "../../Models/IActivity";
import {
  getPlanning,
  selectPlanningActivities,
} from "../../features/Redux/planningSlice";
import SideData from "./SideData/SideData";

type TDayActivity = { id: string; timeIndex: number; activity: IActivity };
export type TDayCol = {
  dateId: string;
  name: string;
  planningActivities: TDayActivity[];
};

export default function Planning() {
  const tripId = useParams().tripId!;
  const activities = useAppSelector(selectActivities);
  const selectedTrip = useAppSelector(selectCurrentTrip);
  const planningActivities = useAppSelector(selectPlanningActivities);
  const dispatch = useAppDispatch();

  const dayCols: TDayCol[] = useMemo(() => {
    if (selectedTrip) {
      const dateRange = [
        dayjs(selectedTrip!.start_date),
        dayjs(selectedTrip!.end_date),
      ];

      let currentDay = dateRange[0];
      const columns: TDayCol[] = [];

      while (currentDay < dateRange[1] && columns.length < 5) {
        const dateId = currentDay.format("YYYY-MM-DD");
        const currentDayPlanningActivity = planningActivities.filter(
          (p) => p.date === dateId
        );

        const dayActivities: TDayActivity[] = currentDayPlanningActivity.map(
          (PA) => {
            return {
              id: PA.id,
              timeIndex: PA.timeIndex,
              activity: activities.find(
                (activity) => activity.id === PA.activityId
              )!,
            };
          }
        );
        columns.push({
          dateId: dateId,
          name: dateId,
          planningActivities: dayActivities,
        });
        currentDay = currentDay.add(1, "day");
      }

      return columns;
    }
    return [];
  }, [selectedTrip, planningActivities, activities]);

  useEffect(() => {
    dispatch(getAllActivities(parseInt(tripId)));
    dispatch(getPlanning(parseInt(tripId)));
  }, [dispatch, tripId]);

  return (
    <div className={styles.mainContainer}>
      <SideData />
      <CalendarView dayCols={dayCols} />
    </div>
  );
}
