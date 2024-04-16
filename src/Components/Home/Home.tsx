import { Grid } from "@mui/material";
import styles from "./Home.module.css";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  getAllTrips,
  selectTrips,
  setCurrentTrip,
} from "../../features/Redux/tripSlice";
import { useNavigate } from "react-router-dom";
import { ERouterPaths } from "../../Helper/ERouterPaths";
import { useEffect } from "react";
import AddTripTile from "./AddTripTile";
import TripTile from "./TripTile";
import { resetPlanningSlice } from "../../features/Redux/planningSlice";
import { resetActivitiesSlice } from "../../features/Redux/activitiesSlice";
import { resetTransportsSlice } from "../../features/Redux/transportsSlice";
import { resetAccommodationsSlice } from "../../features/Redux/accommodationsSlice";

export default function Home() {
  const trips = useAppSelector(selectTrips);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setCurrentTrip(undefined));
    dispatch(resetPlanningSlice());
    dispatch(resetActivitiesSlice());
    dispatch(resetTransportsSlice());
    dispatch(resetAccommodationsSlice());
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
            <TripTile trip={trip} />
          </Grid>
        ))}
        <Grid item>
          <AddTripTile
            onClick={() => {
              navigate(ERouterPaths.addTrip);
            }}
          />
        </Grid>
      </Grid>
    </div>
  );
}
