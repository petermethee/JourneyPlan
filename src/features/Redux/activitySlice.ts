import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import IActivity from "../../Models/IActivity";
import {
  deleteItemAPI,
  getAllItemsAPI,
  insertItemAPI,
  updateItemAPI,
} from "../ipc/ipcGenericFunctions";
import { RootState } from "../../app/store";
import { AlertColor } from "@mui/material";
import { mockedActivities } from "../../MockData/MockedActivities";
import { TablesName } from "../../Models/DataBaseModel";

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
    return (await getAllItemsAPI(TablesName.activities, tripId)) as IActivity[];
  }
);

export const insertActivity = createAsyncThunk(
  "insertActivity",
  async (activity: IActivity) => {
    return await insertItemAPI(TablesName.activities, activity);
  }
);

export const updateActivity = createAsyncThunk(
  "updateActivity",
  async (activity: IActivity) => {
    return await updateItemAPI(TablesName.activities, activity);
  }
);

export const deleteActivity = createAsyncThunk(
  "deleteActivity",
  async (activityId: number) => {
    await deleteItemAPI(TablesName.activities, activityId);
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
      // state.activities = action.payload;
      state.activities = mockedActivities;
    },
    deleteActivity: (state: ActivityState, action: PayloadAction<number>) => {
      state.activities = state.activities.filter(
        (activity) => activity.id !== action.payload
      );
    },
    setUsedActivities: (
      state: ActivityState,
      action: PayloadAction<number>
    ) => {
      state.activities = state.activities.map((activity) =>
        activity.id === action.payload ? { ...activity, used: true } : activity
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

export const { setUsedActivities } = activitySlice.actions;

export const selectActivities = (state: RootState) =>
  state.activitiesReducer.activities;

export default activitySlice.reducer;
