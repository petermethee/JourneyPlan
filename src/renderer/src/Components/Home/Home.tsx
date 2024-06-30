import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
} from "@mui/material";
import styles from "./Home.module.css";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  deleteTrip,
  getAllTrips,
  selectTrips,
  setCurrentTrip,
} from "../../features/Redux/tripSlice";
import { useNavigate } from "react-router-dom";
import { ERouterPaths } from "../../Helper/ERouterPaths";
import { useEffect, useState } from "react";
import AddTripTile from "./AddTripTile";
import TripTile from "./TripTile";
import { resetPlanningSlice } from "../../features/Redux/planningSlice";
import { resetActivitiesSlice } from "../../features/Redux/activitiesSlice";
import { resetTransportsSlice } from "../../features/Redux/transportsSlice";
import { resetAccommodationsSlice } from "../../features/Redux/accommodationsSlice";
import Logo from "./Logo";
import { primErrorColor } from "@renderer/style/cssGlobalStyle";

export default function Home() {
  const trips = useAppSelector(selectTrips);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [openDeleteDialog, setOpenDeleteDialog] = useState<number | false>(
    false,
  );

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
      {openDeleteDialog && (
        <Dialog
          open={!!openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
        >
          <DialogTitle color={primErrorColor}>
            Supression de votre voyage
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Etes vous sur de vouloir supprimer votre voyage ?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              onClick={() => setOpenDeleteDialog(false)}
            >
              Annuler
            </Button>
            <Button
              onClick={() => {
                setOpenDeleteDialog(false);
                dispatch(deleteTrip(openDeleteDialog));
              }}
              autoFocus
              color="error"
              variant="contained"
            >
              Confirmer
            </Button>
          </DialogActions>
        </Dialog>
      )}
      <div className={styles.homeHeader}>
        <Logo />
        <div className={styles.title}>Journey Plan</div>
      </div>

      <Grid
        container
        justifyContent="space-evenly"
        alignItems="center"
        padding="20px 50px"
        rowGap={8}
        columnGap={6}
      >
        {trips.map((trip) => (
          <Grid item key={trip.id}>
            <TripTile
              trip={trip}
              onDelete={() => setOpenDeleteDialog(trip.id)}
            />
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
