import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Trip from "../../Models/Trips";
import { getAllTripsAPI } from "../ipc/ipcFunctions";
import { RootState } from "../../app/store";

interface JourneyPlanState {
  trips: Trip[];
}

const initialState: JourneyPlanState = {
  trips: [],
};

export const getAllTrips = createAsyncThunk("getAllTrips", async () => {
  return await getAllTripsAPI();
});

export const journeyPlanSlice = createSlice({
  name: "journeyPlan",
  initialState: initialState,
  reducers: {
    setAllTrips: (state: JourneyPlanState, action: PayloadAction<Trip[]>) => {
      state.trips = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(getAllTrips.fulfilled, (state, payload) => {
      journeyPlanSlice.caseReducers.setAllTrips(state, payload);
    });
  },
});

export const selectTrips = (state: RootState) => state.journeyPlan.trips;

export default journeyPlanSlice.reducer;
