import { Pagination, ThemeProvider, createTheme } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import styles from "./TimeLineSummary.module.css";
import { useAppSelector } from "../../../app/hooks";
import { selectCurrentTrip } from "../../../features/Redux/tripSlice";
import dayjs from "dayjs";
import TimeLineCard from "./TimeLineCard";
import AnimateOnScroll from "../../Shared/AnimateOnScroll";
import { TTimeLineArtifact } from "../MapSummary";
import { EArtifact } from "../../../Models/EArtifacts";
import MenuBar from "../../Shared/MenuBar";
import { primaryColor, goldenColor } from "../../../style/cssGlobalStyle";
import IAccommodation from "@renderer/Models/IAccommodation";
import IActivity from "@renderer/Models/IActivity";
import ITransport from "@renderer/Models/ITransport";
import { TArtifactEditor } from "@renderer/Components/Planning/Planning";

export default function TimeLineSummary({
  sortedPlanningArtifacts,
  onSelectArtifact,
  onHoverArtifact,
  selectedArtifactId,
  hoveredArtifact,
  openArtifactEditor,
}: {
  sortedPlanningArtifacts: TTimeLineArtifact[];
  selectedArtifactId: number | null;
  hoveredArtifact: number | null;
  onSelectArtifact: (id: number) => void;
  onHoverArtifact: (id: number | null) => void;
  openArtifactEditor: (artifact: TArtifactEditor) => void;
}) {
  const trip = useAppSelector(selectCurrentTrip);
  const dayCount = useMemo(() => {
    const end_date = dayjs(trip?.end_date);
    const start_date = dayjs(trip?.start_date);
    return end_date.diff(start_date, "day");
  }, [trip]);

  const [dayIndex, setDayIndex] = useState(0);

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: primaryColor,
      },
      secondary: {
        main: goldenColor,
      },
      mode: "dark",
    },
  });

  const currentDateLabel = useMemo(() => {
    return dayjs(trip?.start_date).add(dayIndex, "day").format("dddd D MMMM");
  }, [dayIndex, trip]);

  const filteredArray = useMemo(
    () =>
      sortedPlanningArtifacts.filter((PA) =>
        dayjs(PA.date).isSame(dayjs(trip?.start_date).add(dayIndex, "day")),
      ),
    [trip?.start_date, sortedPlanningArtifacts, dayIndex],
  );

  const timeLineCards = useMemo(() => {
    const newTimeLineCards: JSX.Element[] = [];
    filteredArray.forEach((item, index) => {
      const previousType = filteredArray[index - 1]?.type;
      let isLocated = false;
      if (
        item.type === EArtifact.Accommodation ||
        item.type === EArtifact.Activity
      ) {
        isLocated = !!(
          (item.artifact as IAccommodation | IActivity).lat &&
          (item.artifact as IAccommodation | IActivity).lng
        );
      } else {
        const transport = item.artifact as ITransport;
        isLocated = !!(
          transport.lat_from &&
          transport.lng_from &&
          transport.lat_to &&
          transport.lng_to
        );
      }
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
            hovered={hoveredArtifact === item.id}
            selecetd={selectedArtifactId === item.id}
            type={item.type}
            isLocated={isLocated}
            index={item.id}
            onEdit={() =>
              openArtifactEditor({
                artifact: item.artifact,
                type: item.type,
              })
            }
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
        sortedPlanningArtifacts.find((pa) => pa.id === selectedArtifactId)
          ?.date,
      );
      const newDayIndex = Math.abs(
        dayjs(trip?.start_date).diff(selectedArtifactDate, "day"),
      );
      setDayIndex(newDayIndex);
    }
  }, [selectedArtifactId, sortedPlanningArtifacts, trip?.start_date]);

  return (
    <div className={`${styles.timeLineContainer} sidebar`}>
      <MenuBar mapMode />
      <div className={styles.dayLabel}>{currentDateLabel}</div>

      <div className={styles.scrollContainer}>
        <div className={styles.timeLineCardsContainer}>{timeLineCards}</div>
      </div>
      <ThemeProvider theme={darkTheme}>
        <Pagination
          count={dayCount + 1}
          size="small"
          onChange={(_e, page) => setDayIndex(page - 1)}
          sx={{
            color: "white",
            display: "flex",
            justifyContent: "center",
            "& .MuiPagination-ul": {
              gap: "3px",
            },
          }}
          page={dayIndex + 1}
          variant="outlined"
        />
      </ThemeProvider>
    </div>
  );
}
