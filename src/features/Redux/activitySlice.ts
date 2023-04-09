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

interface ActivityState {
  activities: IActivity[];
  snackbarStatus: {
    snackBarSeverity?: AlertColor;
    message: string;
  };
}

const initialState: ActivityState = {
  activities: [],
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
      .addCase(getAllActivities.rejected, (state, action) => {
        state.snackbarStatus = {
          message:
            "Erreur lors de la lecture des voyages: " + action.error.message!,
          snackBarSeverity: "error",
        };
      })
      .addCase(insertActivity.rejected, (state, action) => {
        state.snackbarStatus = {
          message:
            "Erreur lors de la création du voyage: " + action.error.message!,
          snackBarSeverity: "error",
        };
      })
      .addCase(updateActivity.rejected, (state, action) => {
        state.snackbarStatus = {
          message: "Erreur lors de la MAJ du voyage: " + action.error.message!,
          snackBarSeverity: "error",
        };
      })
      .addCase(deleteActivity.fulfilled, (state, action) => {
        activitySlice.caseReducers.deleteActivity(state, action);
      })
      .addCase(deleteActivity.rejected, (state, action) => {
        state.snackbarStatus = {
          message:
            "Erreur lors de la supression du voyage: " + action.error.message!,
          snackBarSeverity: "error",
        };
      });
  },
});

// export const {} = activitySlice.actions;

export const selectActivities = (state: RootState) =>
  state.activitiesReducer.activities;

export default activitySlice.reducer;
