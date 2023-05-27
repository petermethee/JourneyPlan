import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import IActivity from "../../Models/IActivity";
import {
  deleteItemAPI,
  getAllItemsAPI,
  insertItemAPI,
  updateItemAPI,
} from "../ipc/ipcGenericFunctions";
import { RootState } from "../../app/store";
import { mockedActivities } from "../../MockData/MockedActivities";
import { TablesName } from "../../Models/DataBaseModel";

interface ActivitiesState {
  activities: IActivity[];
}

const initialState: ActivitiesState = {
  activities: mockedActivities,
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

export const activitiesSlice = createSlice({
  name: "activitiesSlice",
  initialState: initialState,
  reducers: {
    setAllActivities: (
      state: ActivitiesState,
      action: PayloadAction<IActivity[]>
    ) => {
      // state.activities = action.payload;
      state.activities = mockedActivities;
    },
    deleteActivity: (state: ActivitiesState, action: PayloadAction<number>) => {
      state.activities = state.activities.filter(
        (activity) => activity.id !== action.payload
      );
    },
    setUsedActivities: (
      state: ActivitiesState,
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
        activitiesSlice.caseReducers.setAllActivities(state, action);
      })
      .addCase(deleteActivity.fulfilled, (state, action) => {
        activitiesSlice.caseReducers.deleteActivity(state, action);
      });
  },
});

export const { setUsedActivities } = activitiesSlice.actions;

export const selectActivities = (state: RootState) =>
  state.activitiesReducer.activities;

export default activitiesSlice.reducer;
