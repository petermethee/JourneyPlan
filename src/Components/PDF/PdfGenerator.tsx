import { PDFViewer } from "@react-pdf/renderer";
import TripDocument from "./TripDocument";
import { useAppSelector } from "../../app/hooks";
import { selectCurrentTrip } from "../../features/Redux/tripSlice";
import { selectPlanningArtifacts } from "../../features/Redux/planningSlice";
import { useEffect, useMemo, useState } from "react";
import { EArtifact } from "../../Models/EArtifacts";
import { IArtifact } from "../../Models/IArtifact";
import { selectAccomodations } from "../../features/Redux/accomodationsSlice";
import { selectActivities } from "../../features/Redux/activitiesSlice";
import { selectTransports } from "../../features/Redux/transportsSlice";
import dayjs from "dayjs";

export type TPdfArtifact<T> = T & { timeIndex: number };
export type TDataPdf = {
  pdfArtifact: TPdfArtifact<IArtifact>;
  type: EArtifact;
};
export type TDaysArtifacts = {
  date: string;
  artifacts: TDataPdf[];
};

export default function PdfGenerator() {
  const trip = useAppSelector(selectCurrentTrip);
  const planningArtifacts = useAppSelector(selectPlanningArtifacts);
  const activities = useAppSelector(selectActivities);
  const transports = useAppSelector(selectTransports);
  const accomodations = useAppSelector(selectAccomodations);

  const [daysArtifacts, setDaysArtifacts] = useState<TDaysArtifacts[]>([]);

  const sortedPlanningArtifacts = useMemo(() => {
    return planningArtifacts.slice().sort((a, b) => {
      let dateA = new Date(a.date);
      let dateB = new Date(b.date);

      if (dateA < dateB) {
        return -1;
      } else if (dateA > dateB) {
        return 1;
      } else {
        if (b.timeIndex === -1) {
          return -1;
        }
        if (a.timeIndex === -1) {
          return 1;
        }
        // If the dates are equal, compare the timeIndex
        return a.timeIndex - b.timeIndex;
      }
    });
  }, [planningArtifacts]);

  useEffect(() => {
    const dateRange = [dayjs(trip?.start_date), dayjs(trip?.end_date)];

    let currentDay = dateRange[0];
    const tempDaysArtifacts: TDaysArtifacts[] = [];

    while (currentDay <= dateRange[1]) {
      const dateId = currentDay.format("YYYY-MM-DD");
      const currentDayPlanningActivity = sortedPlanningArtifacts.filter(
        (p) => p.date === dateId
      );

      const artifacts: TDataPdf[] = [];
      currentDayPlanningActivity.forEach((PA) => {
        let artifact: IArtifact;
        let type: EArtifact;
        let position: [number, number];
        switch (PA.artifactType) {
          case EArtifact.Activity:
            artifact = activities.find(
              (activity) => activity.id === PA.artifactId
            )!;
            if (artifact.lat && artifact.lng) {
              position = [artifact.lat, artifact.lng];
            }
            type = EArtifact.Activity;

            break;
          case EArtifact.Transport:
            artifact = transports.find(
              (transport) => transport.id === PA.artifactId
            )!;
            if (artifact.lat_from && artifact.lng_from) {
              position = [artifact.lat_from, artifact.lng_from];
            }
            if (artifact.lat_to && artifact.lng_to) {
              position = [artifact.lat_to, artifact.lng_to];
            }
            type = EArtifact.Transport;

            break;

          default:
            artifact = accomodations.find(
              (accomodation) => accomodation.id === PA.artifactId
            )!;
            if (artifact.lat && artifact.lng) {
              position = [artifact.lat, artifact.lng];
            }
            type = EArtifact.Accomodation;

            break;
        }
        artifacts.push({
          pdfArtifact: { ...artifact, timeIndex: PA.timeIndex },
          type,
        });
      });
      tempDaysArtifacts.push({
        artifacts,
        date: currentDay.format("dddd DD MMMM"),
      });
      currentDay = currentDay.add(1, "day");
    }

    setDaysArtifacts(tempDaysArtifacts);
  }, [activities, transports, accomodations, sortedPlanningArtifacts, trip]);

  return (
    <PDFViewer height="100%" width="100%">
      <TripDocument trip={trip} daysArtifacts={daysArtifacts} />
    </PDFViewer>
  );
}
