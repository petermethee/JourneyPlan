import { Grid } from "@mui/material";
import styles from "./Home.module.css";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  deleteTrip,
  getAllTrips,
  selectTrips,
  setCurrentTrip,
} from "../../features/Redux/tripSlice";
import { useNavigate } from "react-router-dom";
import { ERouterPathes } from "../../Helper/ERouterPathes";
import { useEffect } from "react";
import AddTripTile from "./AddTripTile";
import TripTile from "./TripTile";

export default function Home() {
  const trips = useAppSelector(selectTrips);
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const onClick = (id: number) => {
    dispatch(setCurrentTrip(trips.find((trip) => trip.id === id)!));
    navigate(ERouterPathes.planning + "/" + id);
  };

  useEffect(() => {
    dispatch(getAllTrips());
  }, [dispatch]);

  return (
    <div className={styles.homeContainer}>
      <div className={styles.homeTitle}>Journey Plan</div>
      <Grid
        container
        justifyContent="space-evenly"
        alignItems="center"
        padding="20px 50px"
        rowGap={6}
        columnGap={6}
      >
        {trips.map((trip) => (
          <Grid item key={trip.id}>
            <TripTile
              title={trip.name}
              endDate={trip.end_date}
              startDate={trip.start_date}
              id={trip.id}
              imagePath={trip.image_path}
              onClick={onClick}
              onDelete={() => {
                dispatch(deleteTrip(trip.id));
              }}
            />
          </Grid>
        ))}
        <Grid item>
          <AddTripTile
            onClick={() => {
              navigate(ERouterPathes.addTrip);
            }}
          />
        </Grid>
      </Grid>
    </div>
  );
}
