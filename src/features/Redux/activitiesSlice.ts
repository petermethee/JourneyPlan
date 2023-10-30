import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import IActivity from "../../Models/IActivity";
import {
  deleteItemAPI,
  getAllItemsAPI,
  insertItemAPI,
  updateItemAPI,
} from "../ipc/ipcArtifactsFunctions";
import { RootState } from "../../app/store";
import { EArtifactTableName } from "../../Models/EArtifacts";
import IPlanningArtifact from "../../Models/IPlanningArtifact";

interface ActivitiesState {
  activities: IActivity[];
}

const initialState: ActivitiesState = {
  activities: [],
};

export const getAllActivities = createAsyncThunk(
  "getAllActivities",
  async (tripId: number) => {
    return (await getAllItemsAPI(
      EArtifactTableName.Activity,
      tripId
    )) as IActivity[];
  }
);

export const insertActivity = createAsyncThunk(
  "insertActivity",
  async (activity: IActivity) => {
    console.log("tag", activity);

    const result = await insertItemAPI(EArtifactTableName.Activity, activity);
    return { ...activity, id: result.id, attachment: result.newAttachments };
  }
);

export const updateActivity = createAsyncThunk(
  "updateActivity",
  async (activity: IActivity) => {
    await updateItemAPI(EArtifactTableName.Activity, activity);
    return activity;
  }
);

export const deleteActivity = createAsyncThunk(
  "deleteActivity",
  async (activityId: number) => {
    await deleteItemAPI(EArtifactTableName.Activity, activityId);
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
      console.log("set activities");

      state.activities = action.payload;
    },
    insertActivity: (
      state: ActivitiesState,
      action: PayloadAction<IActivity>
    ) => {
      console.log("insert activities");

      state.activities.push(action.payload);
    },
    updateActivity: (
      state: ActivitiesState,
      action: PayloadAction<IActivity>
    ) => {
      console.log("update activities");

      const updatedActivity = action.payload;
      state.activities = state.activities.map((activity) =>
        activity.id === updatedActivity.id ? updatedActivity : activity
      );
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
      console.log("set used activities");

      state.activities = state.activities.map((activity) =>
        activity.id === action.payload
          ? { ...activity, used: !activity.used }
          : activity
      );
    },
    initUsedActivities: (
      state: ActivitiesState,
      action: PayloadAction<IPlanningArtifact[]>
    ) => {
      console.log("init used activities");

      state.activities.forEach((activity) => {
        activity.used = action.payload.some(
          (PA) => PA.artifactId === activity.id
        );
      });
    },
    resetActivitiesSlice: () => initialState,
  },
  extraReducers(builder) {
    builder
      .addCase(getAllActivities.fulfilled, (state, action) => {
        activitiesSlice.caseReducers.setAllActivities(state, action);
      })
      .addCase(deleteActivity.fulfilled, (state, action) => {
        activitiesSlice.caseReducers.deleteActivity(state, action);
      })
      .addCase(insertActivity.fulfilled, (state, action) => {
        activitiesSlice.caseReducers.insertActivity(state, action);
      })
      .addCase(updateActivity.fulfilled, (state, action) => {
        activitiesSlice.caseReducers.updateActivity(state, action);
      });
  },
});

export const { setUsedActivities, initUsedActivities, resetActivitiesSlice } =
  activitiesSlice.actions;

export const selectActivities = (state: RootState) =>
  state.activitiesReducer.activities;

export default activitiesSlice.reducer;
