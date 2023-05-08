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
  selectPlanningArtifacts,
} from "../../features/Redux/planningSlice";
import SideData from "./SideData/SideData";
import IAccomodation from "../../Models/IAccomodation";
import ITransport from "../../Models/ITransport";
import { EArtifact } from "../../Models/EArtifacts";
import { selectTransports } from "../../features/Redux/transportsSlice";
import { selectAccomodations } from "../../features/Redux/accomodationsSlice";

type TDayActivity = { id: string; timeIndex: number; activity: IActivity };
type TDayAccomodation = {
  id: string;
  timeIndex: number;
  accomodation: IAccomodation;
};
type TDayTransport = { id: string; timeIndex: number; transport: ITransport };

export type TDayCol = {
  dateId: string;
  name: string;
  planningActivities: TDayActivity[];
  planningTransports: TDayTransport[];
  planningActivitiesAccomodations: TDayAccomodation[];
};

export default function Planning() {
  const tripId = useParams().tripId!;
  const activities = useAppSelector(selectActivities);
  const transports = useAppSelector(selectTransports);
  const accomodations = useAppSelector(selectAccomodations);

  const selectedTrip = useAppSelector(selectCurrentTrip);
  const planningActivities = useAppSelector(selectPlanningArtifacts);
  const dispatch = useAppDispatch();

  const dayCols: TDayCol[] = useMemo(() => {
    if (selectedTrip) {
      const dateRange = [
        dayjs(selectedTrip!.start_date),
        dayjs(selectedTrip!.end_date),
      ];

      let currentDay = dateRange[0];
      const columns: TDayCol[] = [];

      while (currentDay < dateRange[1]) {
        const dateId = currentDay.format("YYYY-MM-DD");
        const currentDayPlanningActivity = planningActivities.filter(
          (p) => p.date === dateId
        );

        const dayActivities: TDayActivity[] = currentDayPlanningActivity
          .filter((PA) => PA.artifactType === EArtifact.Activity)
          .map((PA) => {
            return {
              id: PA.id,
              timeIndex: PA.timeIndex,
              activity: activities.find(
                (activity) => activity.id === PA.artifactId
              )!,
            };
          });
        const dayTransports: TDayTransport[] = currentDayPlanningActivity
          .filter((PA) => PA.artifactType === EArtifact.Transport)
          .map((PA) => {
            return {
              id: PA.id,
              timeIndex: PA.timeIndex,
              transport: transports.find(
                (activity) => activity.id === PA.artifactId
              )!,
            };
          });
        const dayAccomodations: TDayAccomodation[] = currentDayPlanningActivity
          .filter((PA) => PA.artifactType === EArtifact.Accomodation)
          .map((PA) => {
            return {
              id: PA.id,
              timeIndex: PA.timeIndex,
              accomodation: accomodations.find(
                (activity) => activity.id === PA.artifactId
              )!,
            };
          });
        columns.push({
          dateId: dateId,
          name: dateId,
          planningActivities: dayActivities,
          planningActivitiesAccomodations: dayAccomodations,
          planningTransports: dayTransports,
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
