import { Grid } from "@mui/material";
import styles from "./Home.module.css";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getAllTrips, selectTrips } from "../features/Redux/JourneyPlanSlice";
import TripsTile from "../Components/TripsTile";
import { useNavigate } from "react-router-dom";
import { routerPathes } from "../Helper/routerPathes";
import AddTripTile from "../Components/AddTripTile";
import { useEffect } from "react";

export default function Home() {
  const trips = useAppSelector(selectTrips);
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const onClick = (id: number) => {
    navigate(routerPathes.planning + "/" + id);
  };

  useEffect(() => {
    dispatch(getAllTrips());
  }, [dispatch]);

  return (
    <div className={styles.homeContainer}>
      <Grid
        container
        justifyContent="space-evenly"
        alignItems="center"
        padding="20px 50px"
        rowGap={6}
        columnGap={6}
      >
        <Grid
          item
          container
          justifyContent="center"
          className={styles.homeTitle}
        >
          Journey Plan
        </Grid>
        {trips.map((trip) => {
          return (
            <Grid item key={trip.id}>
              <TripsTile
                title={trip.name}
                endDate={trip.end_date}
                startDate={trip.start_date}
                id={trip.id}
                imagePath={trip.image_path}
                onClick={onClick}
              />
            </Grid>
          );
        })}
        <Grid item>
          <AddTripTile
            onClick={() => {
              navigate(routerPathes.addTrip);
            }}
          />
        </Grid>
      </Grid>
    </div>
  );
}
