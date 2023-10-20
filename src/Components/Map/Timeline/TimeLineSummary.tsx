import { Button, Pagination, ThemeProvider, createTheme } from "@mui/material";
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
import AnimateOnScroll from "../../Shared/AnimateOnScroll";
import {
  darkColorc,
  defaultWhite,
  primaryColor,
} from "../../../style/cssGlobalStyle";

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

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  const currentDateLabel = useMemo(() => {
    console.log("dayIndex", dayIndex);

    return dayjs(trip?.start_date).add(dayIndex, "day").format("dddd D MMMM");
  }, [dayIndex, trip]);

  const timeLineCards: { artifact: IArtifact; type: EArtifact; id: number }[] =
    useMemo(() => {
      const tempTimeLineCards: {
        artifact: IArtifact;
        type: EArtifact;
        id: number;
      }[] = [];
      sortedPlanningArtifacts.forEach((PA, id) => {
        if (
          dayjs(PA.date).isSame(dayjs(trip?.start_date).add(dayIndex, "day"))
        ) {
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
          tempTimeLineCards.push({ artifact, type: PA.artifactType, id });
        }
      });
      return tempTimeLineCards;
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
          sx={{
            backgroundColor: defaultWhite,
            color: primaryColor,
            "&:hover": { backgroundColor: darkColorc },
          }}
        >
          Home
        </Button>
        <Button
          variant="contained"
          startIcon={<MapIcon />}
          onClick={() => navigate(ERouterPathes.planning + "/" + trip?.id)}
          sx={{
            backgroundColor: defaultWhite,
            color: primaryColor,
            "&:hover": { backgroundColor: darkColorc },
          }}
        >
          Planning
        </Button>
      </div>
      <div className={styles.dayLabel}>{currentDateLabel}</div>

      <div className={styles.scrollContainer}>
        <div className={styles.timeLineCardsContainer}>
          {timeLineCards.map((item) => (
            <div key={item.id} style={{ display: "contents" }}>
              <div className={styles.linkContainer}>
                <AnimateOnScroll
                  reappear
                  visibleClass={styles.finalLine}
                  hiddenClass={styles.initialLine}
                  duration="500ms"
                >
                  <div className={styles.link} />
                </AnimateOnScroll>
              </div>
              <TimeLineCard
                key={item.artifact.id}
                text={item.artifact.name}
                id={item.id}
              />
            </div>
          ))}
        </div>
      </div>
      <ThemeProvider theme={darkTheme}>
        <Pagination
          count={dayCount}
          size="small"
          onChange={(e, page) => setDayIndex(page - 1)}
          sx={{
            color: "white",
            display: "flex",
            justifyContent: "center",
          }}
        />
      </ThemeProvider>
    </div>
  );
}
