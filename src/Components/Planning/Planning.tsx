import React, { useEffect, useMemo, useState } from "react";
import styles from "./Planning.module.css";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  getAllActivities,
  selectActivities,
  updateUsedActivities,
} from "../../features/Redux/activitiesSlice";
import { useParams } from "react-router-dom";
import CalendarView from "./Calendar/CalendarView";
import { selectCurrentTrip } from "../../features/Redux/tripSlice";
import dayjs from "dayjs";
import IActivity from "../../Models/IActivity";
import {
  getAllArtifactsPlanning,
  getAllPlannings,
  selectPlanningArtifacts,
  selectPlanningId,
} from "../../features/Redux/planningSlice";
import SideData from "./SideData/SideData";
import IAccomodation from "../../Models/IAccomodation";
import ITransport from "../../Models/ITransport";
import { EArtifact } from "../../Models/EArtifacts";
import {
  getAllTransports,
  selectTransports,
  updateUsedTransports,
} from "../../features/Redux/transportsSlice";
import {
  getAllAccomodations,
  selectAccomodations,
  updateUsedAccomodations,
} from "../../features/Redux/accomodationsSlice";
import AddArtifacts from "../AddArtifacts/AddArtifacts";

type TDayActivity = { id: number; timeIndex: number; activity: IActivity };
type TDayAccomodation = {
  id: number;
  timeIndex: number;
  accomodation: IAccomodation;
};
type TDayTransport = { id: number; timeIndex: number; transport: ITransport };

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
  const planningId = useAppSelector(selectPlanningId);
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

      while (currentDay <= dateRange[1]) {
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
    dispatch(getAllPlannings(parseInt(tripId)));
    dispatch(getAllActivities(parseInt(tripId)));
    dispatch(getAllTransports(parseInt(tripId)));
    dispatch(getAllAccomodations(parseInt(tripId)));
  }, [dispatch, tripId]);

  useEffect(() => {
    if (planningId) {
      dispatch(getAllArtifactsPlanning(planningId))
        .unwrap()
        .then((PA) => {
          dispatch(
            updateUsedActivities(
              PA.filter((item) => item.artifactType === EArtifact.Activity)
            )
          );
          dispatch(
            updateUsedAccomodations(
              PA.filter((item) => item.artifactType === EArtifact.Accomodation)
            )
          );
          dispatch(
            updateUsedTransports(
              PA.filter((item) => item.artifactType === EArtifact.Transport)
            )
          );
        });
    }
  }, [planningId, dispatch]);

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

      <AddArtifacts
        setOpen={setOpenModal}
        artifactToEdit={artifactToEdit}
        openModal={openModal}
        setArtifactToEdit={setArtifactToEdit}
      />
    </div>
  );
}
