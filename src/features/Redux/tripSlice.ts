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

interface TripState {
  trips: ITrip[];
  snackbarStatus: {
    snackBarSeverity?: AlertColor;
    message: string;
  };
}

const initialState: TripState = {
  trips: [],
  snackbarStatus: { message: "" },
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
    return await updateTripAPI(trip);
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
      });
  },
});

// export const {} = tripSlice.actions;

export const selectTrips = (state: RootState) => state.tripsReducer.trips;
export const selectSnackbarStatus = (state: RootState) =>
  state.tripsReducer.snackbarStatus;

export default tripSlice.reducer;
