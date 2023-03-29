import { Grid } from "@mui/material";
import styles from "./Home.module.css";
import { useAppSelector } from "../app/hooks";
import { selectTrips } from "../features/Redux/JourneyPlanSlice";
import TripsTile from "../Components/TripsTile";
import { useNavigate } from "react-router-dom";
import { routerPathes } from "../Helper/routerPathes";
export default function Home() {
  const trips = useAppSelector(selectTrips);
  const navigate = useNavigate();
  const onClick = (id: number) => {
    navigate(routerPathes.planning + "/" + id);
  };
  return (
    <div className={styles.homeContainer}>
      <Grid
        container
        alignItems="start"
        padding="20px 50px"
        rowGap={3}
        columnGap={6}
      >
        <Grid item container justifyContent="center">
          Accueil
        </Grid>
        {trips.map((trip) => {
          return (
            <Grid item key={trip.id}>
              <TripsTile
                title={trip.name}
                endDate={trip.end_date}
                startDate={trip.start_date}
                id={trip.id}
                onClick={onClick}
              />
            </Grid>
          );
        })}
        {trips.map((trip) => {
          return (
            <Grid item key={trip.id}>
              <TripsTile
                title={trip.name}
                endDate={trip.end_date}
                startDate={trip.start_date}
                id={trip.id}
                onClick={onClick}
              />
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
}
