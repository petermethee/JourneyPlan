import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ITrip from "../../Models/ITrip";
import {
  getAllTripsAPI,
  insertTripAPI,
  updateTripAPI,
} from "../ipc/ipcFunctions";
import { RootState } from "../../app/store";
import { AlertColor } from "@mui/material";

interface JourneyPlanState {
  trips: ITrip[];
  snackbarStatus: {
    snackBarSeverity?: AlertColor;
    message: string;
  };
}

const initialState: JourneyPlanState = {
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

export const journeyPlanSlice = createSlice({
  name: "journeyPlan",
  initialState: initialState,
  reducers: {
    setAllTrips: (state: JourneyPlanState, action: PayloadAction<ITrip[]>) => {
      state.trips = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getAllTrips.fulfilled, (state, action) => {
        journeyPlanSlice.caseReducers.setAllTrips(state, action);
      })
      .addCase(getAllTrips.rejected, (state, action) => {
        state.snackbarStatus = {
          message:
            "Erreur lors de la lecture des voyages: " + action.error.message!,
          snackBarSeverity: "error",
        };
      })
      .addCase(insertTrip.fulfilled, (state, _action) => {
        state.snackbarStatus = {
          message: "Insert success",
          snackBarSeverity: "success",
        };
      })
      .addCase(insertTrip.rejected, (state, action) => {
        state.snackbarStatus = {
          message:
            "Erreur lors de la création du voyage: " + action.error.message!,
          snackBarSeverity: "error",
        };
      })
      .addCase(updateTrip.fulfilled, (state, _action) => {
        state.snackbarStatus = {
          message: "update success",
          snackBarSeverity: "success",
        };
      })
      .addCase(updateTrip.rejected, (state, action) => {
        state.snackbarStatus = {
          message: "Erreur lors de la MAJ du voyage: " + action.error.message!,
          snackBarSeverity: "error",
        };
      });
  },
});

export const selectTrips = (state: RootState) => state.journeyPlan.trips;
export const selectSnackbarStatus = (state: RootState) =>
  state.journeyPlan.snackbarStatus;

export default journeyPlanSlice.reducer;
