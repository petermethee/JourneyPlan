import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import IPlanningArtifact from "../../Models/IPlanningArtifact";

import { RootState } from "../../app/store";
import { EArtifact } from "../../Models/EArtifacts";

interface PlanningState {
  planningArtifacts: IPlanningArtifact[];
  artifactIsDragged: EArtifact | null;
}

const initialState: PlanningState = {
  planningArtifacts: [],
  artifactIsDragged: null,
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
      action: PayloadAction<IPlanningArtifact[]>
    ) => {
      state.planningArtifacts = action.payload;
    },
    deletePlanning: (state: PlanningState, action: PayloadAction<string>) => {
      state.planningArtifacts = state.planningArtifacts.filter(
        (planning) => planning.id !== action.payload
      );
    },
    addArtifact: (
      state: PlanningState,
      action: PayloadAction<IPlanningArtifact>
    ) => {
      state.planningArtifacts = [...state.planningArtifacts, action.payload];
    },
    moveArtifact: (
      state: PlanningState,
      action: PayloadAction<{ PA: IPlanningArtifact; prevPAId: string }>
    ) => {
      const prevId = action.payload.prevPAId;
      state.planningArtifacts = state.planningArtifacts.map((PA) =>
        PA.id === prevId ? action.payload.PA : PA
      );
    },
    setArtifactIsDragged: (
      state: PlanningState,
      action: PayloadAction<EArtifact | null>
    ) => {
      state.artifactIsDragged = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(getPlanning.fulfilled, (state, action) => {
      planningSlice.caseReducers.setAllPlannings(state, action);
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

export const { addArtifact, moveArtifact, setArtifactIsDragged } =
  planningSlice.actions;

export const selectPlanningArtifacts = (state: RootState) =>
  state.planningReducer.planningArtifacts;
export const selectArtifactIsDragged = (state: RootState) =>
  state.planningReducer.artifactIsDragged;

export default planningSlice.reducer;
