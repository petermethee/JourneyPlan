import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ITrip from "../../Models/ITrip";
import {
  deleteTripAPI,
  getAllTripsAPI,
  insertTripAPI,
  updateTripAPI,
} from "../ipc/ipcTripFunctions";
import { RootState } from "../../app/store";
import { AlertColor } from "@mui/material";
import {
  getAllActivities,
  insertActivity,
  updateActivity,
  deleteActivity,
} from "./activitiesSlice";
import {
  deletePlanning,
  exportAttachments,
  getAllPlannings,
  insertPlanning,
  updatePlanning,
} from "./planningSlice";
import {
  deleteTransport,
  getAllTransports,
  insertTransport,
  updateTransport,
} from "./transportsSlice";
import {
  deleteAccommodation,
  getAllAccommodations,
  insertAccommodation,
  updateAccommodation,
} from "./accommodationsSlice";

interface TripState {
  trips: ITrip[];
  snackbarStatus: {
    snackBarSeverity?: AlertColor;
    message: string;
  };
  currentTrip?: ITrip;
  loading: boolean;
}

const initialState: TripState = {
  trips: [],
  snackbarStatus: { message: "" },
  loading: false,
};

export const getAllTrips = createAsyncThunk("getAllTrips", async () => {
  return await getAllTripsAPI();
});

export const insertTrip = createAsyncThunk(
  "insertTrip",
  async (trip: ITrip) => {
    return await insertTripAPI(trip);
  }
);

export const updateTrip = createAsyncThunk(
  "updateTrip",
  async (trip: ITrip) => {
    await updateTripAPI(trip);
    return trip;
  }
);

export const deleteTrip = createAsyncThunk(
  "deleteTrip",
  async (tripId: number) => {
    await deleteTripAPI(tripId);
    return tripId;
  }
);

export const tripSlice = createSlice({
  name: "journeyPlan",
  initialState: initialState,
  reducers: {
    setAllTrips: (state: TripState, action: PayloadAction<ITrip[]>) => {
      state.trips = action.payload;
    },
    deleteTrip: (state: TripState, action: PayloadAction<number>) => {
      state.trips = state.trips.filter((trip) => trip.id !== action.payload);
    },
    setCurrentTrip: (
      state: TripState,
      action: PayloadAction<ITrip | undefined>
    ) => {
      state.currentTrip = action.payload;
    },
    setSnackbarStatus: (
      state: TripState,
      action: PayloadAction<{
        snackBarSeverity?: AlertColor | undefined;
        message: string;
      }>
    ) => {
      state.snackbarStatus = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getAllTrips.fulfilled, (state, action) => {
        tripSlice.caseReducers.setAllTrips(state, action);
      })
      .addCase(getAllTrips.rejected, (state, action) => {
        state.snackbarStatus = {
          message:
            "Erreur lors de la lecture des voyages: " + action.error.message!,
          snackBarSeverity: "error",
        };
      })
      .addCase(insertTrip.rejected, (state, action) => {
        state.snackbarStatus = {
          message:
            "Erreur lors de la création du voyage: " + action.error.message!,
          snackBarSeverity: "error",
        };
      })
      .addCase(updateTrip.fulfilled, (state, action) => {
        state.currentTrip = action.payload;
      })
      .addCase(updateTrip.rejected, (state, action) => {
        state.snackbarStatus = {
          message: "Erreur lors de la MAJ du voyage: " + action.error.message!,
          snackBarSeverity: "error",
        };
      })
      .addCase(deleteTrip.fulfilled, (state, action) => {
        tripSlice.caseReducers.deleteTrip(state, action);
      })
      .addCase(deleteTrip.rejected, (state, action) => {
        state.snackbarStatus = {
          message:
            "Erreur lors de la supression du voyage: " + action.error.message!,
          snackBarSeverity: "error",
        };
      })

      //Reducers from other slice
      //Activities
      .addCase(getAllActivities.rejected, (state, action) => {
        state.snackbarStatus = {
          message:
            "Erreur lors de la lecture des activités: " + action.error.message!,
          snackBarSeverity: "error",
        };
      })
      .addCase(insertActivity.rejected, (state, action) => {
        state.snackbarStatus = {
          message:
            "Erreur lors de la création de l'activité: " +
            action.error.message!,
          snackBarSeverity: "error",
        };
      })
      .addCase(updateActivity.rejected, (state, action) => {
        state.snackbarStatus = {
          message:
            "Erreur lors de la MAJ de l'activité: " + action.error.message!,
          snackBarSeverity: "error",
        };
      })
      .addCase(deleteActivity.rejected, (state, action) => {
        state.snackbarStatus = {
          message:
            "Erreur lors de la supression de l'activité: " +
            action.error.message!,
          snackBarSeverity: "error",
        };
      })

      //Transports
      .addCase(getAllTransports.rejected, (state, action) => {
        state.snackbarStatus = {
          message:
            "Erreur lors de la lecture des transports: " +
            action.error.message!,
          snackBarSeverity: "error",
        };
      })
      .addCase(insertTransport.rejected, (state, action) => {
        state.snackbarStatus = {
          message:
            "Erreur lors de la création du transport: " + action.error.message!,
          snackBarSeverity: "error",
        };
      })
      .addCase(updateTransport.rejected, (state, action) => {
        state.snackbarStatus = {
          message:
            "Erreur lors de la MAJ du transport: " + action.error.message!,
          snackBarSeverity: "error",
        };
      })
      .addCase(deleteTransport.rejected, (state, action) => {
        state.snackbarStatus = {
          message:
            "Erreur lors de la supression du transport: " +
            action.error.message!,
          snackBarSeverity: "error",
        };
      })
      //Accommodations
      .addCase(getAllAccommodations.rejected, (state, action) => {
        state.snackbarStatus = {
          message:
            "Erreur lors de la lecture des hébergements: " +
            action.error.message!,
          snackBarSeverity: "error",
        };
      })
      .addCase(insertAccommodation.rejected, (state, action) => {
        state.snackbarStatus = {
          message:
            "Erreur lors de la création de l'hébergement: " +
            action.error.message!,
          snackBarSeverity: "error",
        };
      })
      .addCase(updateAccommodation.rejected, (state, action) => {
        state.snackbarStatus = {
          message:
            "Erreur lors de la MAJ de l'hébergement: " + action.error.message!,
          snackBarSeverity: "error",
        };
      })
      .addCase(deleteAccommodation.rejected, (state, action) => {
        state.snackbarStatus = {
          message:
            "Erreur lors de la supression de l'hébergement: " +
            action.error.message!,
          snackBarSeverity: "error",
        };
      })

      //Planning
      .addCase(getAllPlannings.rejected, (state, action) => {
        state.snackbarStatus = {
          message:
            "Erreur lors de la lecture des plannings: " + action.error.message!,
          snackBarSeverity: "error",
        };
      })
      .addCase(insertPlanning.rejected, (state, action) => {
        state.snackbarStatus = {
          message:
            "Erreur lors de la création du voyage: " + action.error.message!,
          snackBarSeverity: "error",
        };
      })
      .addCase(updatePlanning.rejected, (state, action) => {
        state.snackbarStatus = {
          message: "Erreur lors de la MAJ du voyage: " + action.error.message!,
          snackBarSeverity: "error",
        };
      })
      .addCase(deletePlanning.rejected, (state, action) => {
        state.snackbarStatus = {
          message:
            "Erreur lors de la supression du voyage: " + action.error.message!,
          snackBarSeverity: "error",
        };
      })

      //Planning Artifact
      .addCase(exportAttachments.pending, (state, _action) => {
        state.loading = true;
      })
      .addCase(exportAttachments.fulfilled, (state, _action) => {
        state.snackbarStatus = {
          message: "Export terminé",
          snackBarSeverity: "success",
        };
        state.loading = false;
      })
      .addCase(exportAttachments.rejected, (state, _action) => {
        state.snackbarStatus = {
          message: "Erreur lors de l'export",
          snackBarSeverity: "error",
        };
        state.loading = false;
      });

    //TODO
  },
});

export const { setCurrentTrip, setSnackbarStatus } = tripSlice.actions;

export const selectTrips = (state: RootState) => state.tripsReducer.trips;
export const selectLoading = (state: RootState) => state.tripsReducer.loading;

export const selectSnackbarStatus = (state: RootState) =>
  state.tripsReducer.snackbarStatus;

export const selectCurrentTrip = (state: RootState) =>
  state.tripsReducer.currentTrip;

export const selectCurrency = (state: RootState) =>
  state.tripsReducer.currentTrip?.currency;
export default tripSlice.reducer;
