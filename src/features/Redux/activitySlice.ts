import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import IActivity from "../../Models/IActivity";
import {
  deleteActivityAPI,
  getAllActivitiesAPI,
  insertActivityAPI,
  updateActivityAPI,
} from "../ipc/ipcActivityFunctions";
import { RootState } from "../../app/store";
import { AlertColor } from "@mui/material";
import { mockedActivities } from "../../MockData/MockedActivities";

interface ActivityState {
  activities: IActivity[];
  snackbarStatus: {
    snackBarSeverity?: AlertColor;
    message: string;
  };
}

const initialState: ActivityState = {
  activities: mockedActivities,
  snackbarStatus: { message: "" },
};

export const getAllActivities = createAsyncThunk(
  "getAllActivities",
  async (tripId: number) => {
    return await getAllActivitiesAPI(tripId);
  }
);

export const insertActivity = createAsyncThunk(
  "insertActivity",
  async (activity: IActivity) => {
    return await insertActivityAPI(activity);
  }
);

export const updateActivity = createAsyncThunk(
  "updateActivity",
  async (activity: IActivity) => {
    return await updateActivityAPI(activity);
  }
);

export const deleteActivity = createAsyncThunk(
  "deleteActivity",
  async (activityId: number) => {
    await deleteActivityAPI(activityId);
    return activityId;
  }
);

export const activitySlice = createSlice({
  name: "activitySlice",
  initialState: initialState,
  reducers: {
    setAllActivities: (
      state: ActivityState,
      action: PayloadAction<IActivity[]>
    ) => {
      state.activities = action.payload;
    },
    deleteActivity: (state: ActivityState, action: PayloadAction<number>) => {
      state.activities = state.activities.filter(
        (activity) => activity.id !== action.payload
      );
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getAllActivities.fulfilled, (state, action) => {
        activitySlice.caseReducers.setAllActivities(state, action);
      })
      .addCase(deleteActivity.fulfilled, (state, action) => {
        activitySlice.caseReducers.deleteActivity(state, action);
      });
  },
});

// export const {} = activitySlice.actions;

export const selectActivities = (state: RootState) =>
  state.activitiesReducer.activities;

export default activitySlice.reducer;
