import React, { useEffect, useMemo, useState } from "react";
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
  getAllPlanning,
  selectPlanningArtifacts,
} from "../../features/Redux/planningSlice";
import SideData from "./SideData/SideData";
import IAccomodation from "../../Models/IAccomodation";
import ITransport from "../../Models/ITransport";
import { EArtifact } from "../../Models/EArtifacts";
import {
  getAllTransports,
  selectTransports,
} from "../../features/Redux/transportsSlice";
import {
  getAllAccomodations,
  selectAccomodations,
} from "../../features/Redux/accomodationsSlice";
import { Backdrop } from "@mui/material";
import AddArtifacts from "../AddArtifacts/AddArtifacts";

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
  planningAccomodations: TDayAccomodation[];
};
export type TArtifactEditor = {
  type: EArtifact;
  artifact?: IActivity | IAccomodation | ITransport;
};

export default function Planning() {
  const tripId = useParams().tripId!;
  const activities = useAppSelector(selectActivities);
  const transports = useAppSelector(selectTransports);
  const accomodations = useAppSelector(selectAccomodations);
  const selectedTrip = useAppSelector(selectCurrentTrip);
  const planningArtifacts = useAppSelector(selectPlanningArtifacts);
  const dispatch = useAppDispatch();

  const [openModal, setOpenModal] = useState(false);
  const [artifactToEdit, setArtifactToEdit] = useState<TArtifactEditor>({
    type: EArtifact.Activity,
  });

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
        const currentDayPlanningActivity = planningArtifacts.filter(
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
          planningAccomodations: dayAccomodations,
          planningTransports: dayTransports,
        });
        currentDay = currentDay.add(1, "day");
      }

      return columns;
    }
    return [];
  }, [selectedTrip, planningArtifacts, activities, accomodations, transports]);

  useEffect(() => {
    dispatch(getAllActivities(parseInt(tripId)));
    dispatch(getAllTransports(parseInt(tripId)));
    dispatch(getAllAccomodations(parseInt(tripId)));
    dispatch(getAllPlanning(parseInt(tripId)));
  }, [dispatch, tripId]);

  return (
    <div className={styles.mainContainer}>
      <SideData
        isEditorOpen={openModal}
        openArtifactEditor={(artifactEditor: TArtifactEditor) => {
          setArtifactToEdit(artifactEditor);
          setOpenModal(true);
        }}
      />
      <CalendarView
        dayCols={dayCols}
        openArtifactEditor={(artifactEditor: TArtifactEditor) => {
          setArtifactToEdit(artifactEditor);
          setOpenModal(true);
        }}
      />
      <Backdrop open={openModal} sx={{ zIndex: 10 }} />
      <AddArtifacts
        open={openModal}
        setOpen={setOpenModal}
        artifactToEdit={artifactToEdit}
      />
    </div>
  );
}
