import React, { createContext, useEffect, useMemo, useState } from "react";
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
import IActivity from "../../Models/IActivity";
import { DragNDropContext, TDnDEvent } from "../../DnDCustomLib/DnDContext";
import IPlanningAvtivity from "../../Models/IPlanningActivity";

type TDayActivity = { id: string; timeIndex: number; activity: IActivity };
export type TDayCol = {
  id: string;
  name: string;
  planningActivities: TDayActivity[];
};

export default function Planning() {
  const tripId = useParams().tripId!;
  const activities = useAppSelector(selectActivities);
  const selectedTrip = useAppSelector(selectCurrentTrip);
  // const planningActivities = useAppSelector(selectPlanningActivities);

  const [planningActivities, setPlanningActivities] = useState<
    IPlanningAvtivity[]
  >([]);
  const [unusedActivities, setUnusedActivities] = useState(activities);

  const [usedActivities, setUsedActivities] = useState<string[]>([]);

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
        const dateId = currentDay
          .locale("fr")
          .format("DD MMM YYYY")
          .toUpperCase();
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
          id: dateId,
          name: dateId,
          planningActivities: dayActivities,
        });
        currentDay = currentDay.add(1, "day");
      }
      return columns;
    }
    return [];
  }, [selectedTrip, planningActivities, activities]);

  const onDragEnd = (event: TDnDEvent) => {
    if (event.destination.dayIndex !== -1) {
      setUnusedActivities((prevState) =>
        prevState.filter((act) => act.id !== event.id)
      );
      const activityId = event.id;
      const date = dayCols[event.destination.dayIndex].id;
      const timeIndex = event.destination.timeIndex;
      const planningId = `${activityId}_${date}_${timeIndex}`;
      setPlanningActivities((prevState) => [
        ...prevState,
        {
          activityId: activityId,
          date,
          timeIndex,
          id: planningId,
        },
      ]);
    }
  };

  useEffect(() => {
    //dispatch(getAllActivities(parseInt(tripId)));
    //setPlanningActivities()
  }, [dispatch, tripId]);

  useEffect(() => {
    setUnusedActivities(activities);
  }, [activities]);

  return (
    <div className={styles.mainContainer}>
      <DragNDropContext.Provider value={{ onDragEnd: onDragEnd }}>
        <SideData unusedActivities={unusedActivities} />
        <CalendarView dayCols={dayCols} />
      </DragNDropContext.Provider>
    </div>
  );
}
