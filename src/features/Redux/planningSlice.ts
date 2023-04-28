import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import IPlanningAvtivity from "../../Models/IPlanningActivity";

import { RootState } from "../../app/store";
import { AlertColor } from "@mui/material";

interface PlanningState {
  planningActivities: IPlanningAvtivity[];
  snackbarStatus: {
    snackBarSeverity?: AlertColor;
    message: string;
  };
}

const initialState: PlanningState = {
  planningActivities: [],
  snackbarStatus: { message: "" },
};

export const getPlanning = createAsyncThunk(
  "getAllPlannings",
  async (tripId: number) => {
    // return await getAllPlanningsAPI(tripId);
    return [];
  }
);
/*
export const insertPlanning = createAsyncThunk(
  "insertPlanning",
  async (planning: IPlanningAvtivity) => {
    return await insertPlanningAPI(planning);
  }
);

export const updatePlanning = createAsyncThunk(
  "updatePlanning",
  async (planning: IPlanningAvtivity) => {
    return await updatePlanningAPI(planning);
  }
);

export const deletePlanning = createAsyncThunk(
  "deletePlanning",
  async (planningId: number) => {
    await deletePlanningAPI(planningId);
    return planningId;
  }
); */

export const planningSlice = createSlice({
  name: "planningSlice",
  initialState: initialState,
  reducers: {
    setAllPlannings: (
      state: PlanningState,
      action: PayloadAction<IPlanningAvtivity[]>
    ) => {
      state.planningActivities = action.payload;
    },
    deletePlanning: (state: PlanningState, action: PayloadAction<string>) => {
      state.planningActivities = state.planningActivities.filter(
        (planning) => planning.id !== action.payload
      );
    },
    addArtefact: (
      state: PlanningState,
      action: PayloadAction<IPlanningAvtivity>
    ) => {
      state.planningActivities = [...state.planningActivities, action.payload];
    },
    moveArtefact: (
      state: PlanningState,
      action: PayloadAction<IPlanningAvtivity>
    ) => {
      const { activityId } = action.payload;
      state.planningActivities = state.planningActivities.map((PA) =>
        PA.activityId === activityId ? action.payload : PA
      );
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getPlanning.fulfilled, (state, action) => {
        planningSlice.caseReducers.setAllPlannings(state, action);
      })
      .addCase(getPlanning.rejected, (state, action) => {
        state.snackbarStatus = {
          message:
            "Erreur lors de la lecture des voyages: " + action.error.message!,
          snackBarSeverity: "error",
        };
      });
    /*
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
      .addCase(deletePlanning.fulfilled, (state, action) => {
        planningSlice.caseReducers.deletePlanning(state, action);
      })
      .addCase(deletePlanning.rejected, (state, action) => {
        state.snackbarStatus = {
          message:
            "Erreur lors de la supression du voyage: " + action.error.message!,
          snackBarSeverity: "error",
        };
      }); */
  },
});

export const { addArtefact, moveArtefact } = planningSlice.actions;

export const selectPlanningActivities = (state: RootState) =>
  state.planningReducer.planningActivities;

export default planningSlice.reducer;
