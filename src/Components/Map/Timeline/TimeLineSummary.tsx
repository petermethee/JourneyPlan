import { Button, Pagination } from "@mui/material";
import React, { useMemo, useState } from "react";
import { ERouterPathes } from "../../../Helper/ERouterPathes";
import styles from "./TimeLineSummary.module.css";

import { useNavigate } from "react-router-dom";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import MapIcon from "@mui/icons-material/Map";
import { useAppSelector } from "../../../app/hooks";
import { selectCurrentTrip } from "../../../features/Redux/tripSlice";
import IPlanningArtifact from "../../../Models/IPlanningArtifact";
import { selectActivities } from "../../../features/Redux/activitiesSlice";
import { selectTransports } from "../../../features/Redux/transportsSlice";
import { selectAccomodations } from "../../../features/Redux/accomodationsSlice";
import dayjs from "dayjs";
import { EArtifact } from "../../../Models/EArtifacts";
import TimeLineCard from "./TimeLineCard";
import { IArtifact } from "../../../Models/IArtifact";

export default function TimeLineSummary({
  sortedPlanningArtifacts,
}: {
  sortedPlanningArtifacts: IPlanningArtifact[];
}) {
  const navigate = useNavigate();
  const trip = useAppSelector(selectCurrentTrip);
  const activities = useAppSelector(selectActivities);
  const transports = useAppSelector(selectTransports);
  const accomodations = useAppSelector(selectAccomodations);
  const dayCount = useMemo(() => {
    const end_date = dayjs(trip?.end_date);
    const start_date = dayjs(trip?.start_date);
    return end_date.diff(start_date, "day");
  }, [trip]);

  const [dayIndex, setDayIndex] = useState(0);

  const timeLineCards: { artifact: IArtifact; type: EArtifact }[] =
    useMemo(() => {
      return sortedPlanningArtifacts
        .filter((PA) => {
          return dayjs(PA.date).isSame(
            dayjs(trip?.start_date).add(dayIndex, "day")
          );
        })
        .map((PA) => {
          let artifact: IArtifact | undefined;
          switch (PA.artifactType) {
            case EArtifact.Activity:
              artifact = activities.find(
                (activity) => activity.id === PA.artifactId
              )!;

              break;
            case EArtifact.Transport:
              artifact = transports.find(
                (transport) => transport.id === PA.artifactId
              )!;
              break;

            default:
              artifact = accomodations.find(
                (accomodation) => accomodation.id === PA.artifactId
              )!;
              break;
          }
          return { artifact, type: PA.artifactType };
        });
    }, [
      activities,
      transports,
      accomodations,
      trip?.start_date,
      sortedPlanningArtifacts,
      dayIndex,
    ]);

  return (
    <div className={styles.timeLineContainer}>
      <div className={styles.topToolContainer}>
        <Button
          onClick={() => navigate(ERouterPathes.home)}
          startIcon={<HomeRoundedIcon />}
          variant="contained"
        >
          Home
        </Button>
        <Button
          variant="contained"
          startIcon={<MapIcon />}
          onClick={() => navigate(ERouterPathes.planning + "/" + trip?.id)}
        >
          Planning
        </Button>
      </div>
      <div className={styles.dayLabel}>
        {dayjs(trip?.start_date).add(dayIndex).toString()}
      </div>

      <div className={styles.timeLineCardsContainer}>
        {/* {timeLineCards.map((item) => (
          <TimeLineCard key={item.artifact.id} text={item.artifact.name} />
        ))} */}
        {["test", "test"].map((text, index) => (
          <TimeLineCard key={index} text={text} />
        ))}
      </div>

      <Pagination
        count={dayCount}
        size="small"
        onChange={(e, page) => setDayIndex(page - 1)}
      />
    </div>
  );
}
