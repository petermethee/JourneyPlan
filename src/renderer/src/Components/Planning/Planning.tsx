import { useEffect, useMemo, useState } from "react";
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
  getAllArtifactsPlanning,
  getAllPlannings,
  selectPlanningArtifacts,
} from "../../features/Redux/planningSlice";
import SideData from "./SideData/SideData";
import IAccommodation from "../../Models/IAccommodation";
import ITransport from "../../Models/ITransport";
import { EArtifact } from "../../Models/EArtifacts";
import {
  getAllTransports,
  selectTransports,
} from "../../features/Redux/transportsSlice";
import {
  getAllAccommodations,
  selectAccommodations,
} from "../../features/Redux/accommodationsSlice";
import AddArtifacts from "../AddArtifacts/AddArtifacts";

type TDayActivity = { id: number; timeIndex: number; activity: IActivity };
type TDayAccommodation = {
  id: number;
  timeIndex: number;
  accommodation: IAccommodation;
};
type TDayTransport = { id: number; timeIndex: number; transport: ITransport };

export type TDayCol = {
  dateId: string;
  name: string;
  planningActivities: TDayActivity[];
  planningTransports: TDayTransport[];
  planningAccommodations: TDayAccommodation[];
};
export type TArtifactEditor = {
  type: EArtifact;
  artifact?: IActivity | IAccommodation | ITransport;
};

export default function Planning() {
  const tripId = useParams().tripId!;
  const activities = useAppSelector(selectActivities);
  const transports = useAppSelector(selectTransports);
  const accommodations = useAppSelector(selectAccommodations);
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

      while (currentDay <= dateRange[1]) {
        const dateId = currentDay.format("YYYY-MM-DD");
        const currentDayPlanningActivity = planningArtifacts.filter(
          (p) => p.date === dateId,
        );

        const dayActivities: TDayActivity[] = currentDayPlanningActivity
          .filter((PA) => PA.artifactType === EArtifact.Activity)
          .map((PA) => {
            return {
              id: PA.id,
              timeIndex: PA.timeIndex,
              activity: activities.find(
                (activity) => activity.id === PA.artifactId,
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
                (activity) => activity.id === PA.artifactId,
              )!,
            };
          });
        const dayAccommodations: TDayAccommodation[] =
          currentDayPlanningActivity
            .filter((PA) => PA.artifactType === EArtifact.Accommodation)
            .map((PA) => {
              return {
                id: PA.id,
                timeIndex: PA.timeIndex,
                accommodation: accommodations.find(
                  (activity) => activity.id === PA.artifactId,
                )!,
              };
            });
        columns.push({
          dateId: dateId,
          name: dateId,
          planningActivities: dayActivities,
          planningAccommodations: dayAccommodations,
          planningTransports: dayTransports,
        });
        currentDay = currentDay.add(1, "day");
      }

      return columns;
    }
    return [];
  }, [selectedTrip, planningArtifacts, activities, accommodations, transports]);

  useEffect(() => {
    dispatch(getAllPlannings(parseInt(tripId)))
      .unwrap()
      .then((plannings) => {
        dispatch(getAllArtifactsPlanning(plannings[0].id));
      });
    dispatch(getAllActivities(parseInt(tripId)));
    dispatch(getAllTransports(parseInt(tripId)));
    dispatch(getAllAccommodations(parseInt(tripId)));
  }, [dispatch, tripId]);

  return (
    <div className={styles.mainContainer}>
      <SideData
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

      {openModal && (
        <AddArtifacts
          setOpen={setOpenModal}
          artifactToEdit={artifactToEdit}
          openModal={openModal}
          setArtifactToEdit={setArtifactToEdit}
        />
      )}
    </div>
  );
}
