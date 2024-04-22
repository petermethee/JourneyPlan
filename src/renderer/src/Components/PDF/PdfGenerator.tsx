import { PDFViewer } from "@react-pdf/renderer";
import TripDocument from "./TripDocument";
import { useAppSelector } from "../../app/hooks";
import { selectCurrentTrip } from "../../features/Redux/tripSlice";
import { selectPlanningArtifacts } from "../../features/Redux/planningSlice";
import { useEffect, useMemo, useState } from "react";
import { EArtifact } from "../../Models/EArtifacts";
import { IArtifact } from "../../Models/IArtifact";
import { selectAccommodations } from "../../features/Redux/accommodationsSlice";
import { selectActivities } from "../../features/Redux/activitiesSlice";
import { selectTransports } from "../../features/Redux/transportsSlice";
import dayjs from "dayjs";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ERouterPaths } from "../../Helper/ERouterPaths";
import { goldenColor } from "../../style/cssGlobalStyle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

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
  const navigate = useNavigate();
  const trip = useAppSelector(selectCurrentTrip);
  const planningArtifacts = useAppSelector(selectPlanningArtifacts);
  const activities = useAppSelector(selectActivities);
  const transports = useAppSelector(selectTransports);
  const accommodations = useAppSelector(selectAccommodations);

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
        switch (PA.artifactType) {
          case EArtifact.Activity:
            artifact = activities.find(
              (activity) => activity.id === PA.artifactId
            )!;

            type = EArtifact.Activity;

            break;
          case EArtifact.Transport:
            artifact = transports.find(
              (transport) => transport.id === PA.artifactId
            )!;

            type = EArtifact.Transport;

            break;

          default:
            artifact = accommodations.find(
              (accommodation) => accommodation.id === PA.artifactId
            )!;

            type = EArtifact.Accommodation;

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
  }, [activities, transports, accommodations, sortedPlanningArtifacts, trip]);

  return (
    <div style={{ height: "100%", position: "relative", overflow: "hidden" }}>
      <PDFViewer height="100%" width="100%">
        <TripDocument trip={trip} daysArtifacts={daysArtifacts} />
      </PDFViewer>
      <Button
        sx={{
          backgroundColor: goldenColor,
          position: "absolute",
          left: "20px",
          bottom: "20px",
          "&:hover": {
            backgroundColor: "#715b26",
          },
        }}
        variant="contained"
        onClick={() => navigate(ERouterPaths.planning + "/" + trip?.id)}
        startIcon={<ArrowBackIcon />}
      >
        Retour
      </Button>
    </div>
  );
}
