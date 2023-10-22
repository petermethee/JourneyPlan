import { Button, Pagination, ThemeProvider, createTheme } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { ERouterPathes } from "../../../Helper/ERouterPathes";
import styles from "./TimeLineSummary.module.css";
import { useNavigate } from "react-router-dom";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import MapIcon from "@mui/icons-material/Map";
import { useAppSelector } from "../../../app/hooks";
import { selectCurrentTrip } from "../../../features/Redux/tripSlice";
import dayjs from "dayjs";
import TimeLineCard from "./TimeLineCard";
import AnimateOnScroll from "../../Shared/AnimateOnScroll";
import {
  darkColorc,
  defaultWhite,
  primaryColor,
} from "../../../style/cssGlobalStyle";
import { TTimeLineArtifact } from "../MapSummary";
import { EArtifact } from "../../../Models/EArtifacts";

export default function TimeLineSummary({
  sortedPlanningArtifacts,
  onSelectArtifact,
  onHoverArtifact,
  selectedArtifactId,
  hoveredArtifact,
}: {
  sortedPlanningArtifacts: TTimeLineArtifact[];
  selectedArtifactId: number | null;
  hoveredArtifact: number | null;
  onSelectArtifact: (id: number) => void;
  onHoverArtifact: (id: number | null) => void;
}) {
  const navigate = useNavigate();
  const trip = useAppSelector(selectCurrentTrip);
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
    return dayjs(trip?.start_date).add(dayIndex, "day").format("dddd D MMMM");
  }, [dayIndex, trip]);

  const filteredArray = useMemo(
    () =>
      sortedPlanningArtifacts.filter((PA) =>
        dayjs(PA.date).isSame(dayjs(trip?.start_date).add(dayIndex, "day"))
      ),
    [trip?.start_date, sortedPlanningArtifacts, dayIndex]
  );

  const timeLineCards = useMemo(() => {
    const newTimeLineCards: JSX.Element[] = [];
    filteredArray.forEach((item, index) => {
      const previousType = filteredArray[index - 1]?.type;
      const card = (
        <div
          onClick={() => onSelectArtifact(item.id)}
          onMouseEnter={() => onHoverArtifact(item.id)}
          onMouseLeave={() => onHoverArtifact(null)}
          key={item.id}
          style={{ display: "contents" }}
        >
          <div className={styles.linkContainer}>
            <AnimateOnScroll
              reappear
              visibleClass={styles.finalLine}
              hiddenClass={styles.initialLine}
              duration="300ms"
            >
              {previousType === EArtifact.Transport ||
              item.type === EArtifact.Transport ? (
                <div className={styles.transportLink}>
                  <div className={styles.dot} />
                  <div className={styles.dot} />
                  <div className={styles.dot} />
                </div>
              ) : (
                <div className={styles.link} />
              )}
            </AnimateOnScroll>
          </div>
          <TimeLineCard
            key={item.artifact.id}
            text={item.artifact.name}
            id={item.id}
            hovered={hoveredArtifact === item.id}
            selecetd={selectedArtifactId === item.id}
            type={item.type}
          />
        </div>
      );
      newTimeLineCards.push(card);
    });
    return newTimeLineCards;
  }, [
    filteredArray,
    hoveredArtifact,
    onHoverArtifact,
    onSelectArtifact,
    selectedArtifactId,
  ]);

  useEffect(() => {
    if (selectedArtifactId) {
      const selectedArtifactDate = dayjs(
        sortedPlanningArtifacts.find((pa) => pa.id === selectedArtifactId)!.date
      );
      const newDayIndex = Math.abs(
        dayjs(trip?.start_date).diff(selectedArtifactDate, "day")
      );
      setDayIndex(newDayIndex);
    }
  }, [selectedArtifactId, sortedPlanningArtifacts, trip?.start_date]);

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
        <div className={styles.timeLineCardsContainer}>{timeLineCards}</div>
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
          page={dayIndex + 1}
        />
      </ThemeProvider>
    </div>
  );
}
