import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import IPlanningArtifact, { IPlanning } from "../../Models/IPlanningArtifact";

import { RootState } from "../../app/store";
import { EArtifact } from "../../Models/EArtifacts";
import {
  deletePlanningAPI,
  getAllPlanningsAPI,
  insertPlanningAPI,
  updatePlanningAPI,
} from "../ipc/ipcPlanningFunctions";

interface PlanningState {
  selectedPlanningId?: number;
  plannings: IPlanning[];
  planningArtifacts: IPlanningArtifact[];
  artifactIsDragged: EArtifact | null;
}

const initialState: PlanningState = {
  plannings: [],
  planningArtifacts: [],
  artifactIsDragged: null,
};

export const getAllPlanning = createAsyncThunk(
  "getAllPlannings",
  async (tripId: number) => {
    return await getAllPlanningsAPI(tripId);
  }
);

export const insertPlanning = createAsyncThunk(
  "insertPlanning",
  async (planning: IPlanning) => {
    const planningId = await insertPlanningAPI(planning);
    return { ...planning, id: planningId };
  }
);

export const updatePlanning = createAsyncThunk(
  "updatePlanning",
  async (planning: IPlanning) => {
    await updatePlanningAPI(planning);
    return planning;
  }
);

export const deletePlanning = createAsyncThunk(
  "deletePlanning",
  async (planningId: number) => {
    await deletePlanningAPI(planningId);
    return planningId;
  }
);

export const planningSlice = createSlice({
  name: "planningSlice",
  initialState: initialState,
  reducers: {
    selectPlanning: (state: PlanningState, action: PayloadAction<number>) => {
      state.selectedPlanningId = action.payload;
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
    deleteArtifactFromPlanning: (
      state: PlanningState,
      action: PayloadAction<string>
    ) => {
      state.planningArtifacts = state.planningArtifacts.filter(
        (PA) => PA.id !== action.payload
      );
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getAllPlanning.fulfilled, (state, action) => {
        state.plannings = action.payload;
        state.selectedPlanningId = action.payload[0].id;
      })
      .addCase(deletePlanning.fulfilled, (state, action) => {
        state.plannings = state.plannings.filter(
          (planning) => planning.id !== action.payload
        );
        if (state.selectedPlanningId === action.payload) {
          planningSlice.caseReducers.selectPlanning(state, {
            payload: state.plannings[0].id,
            type: action.type,
          });
        }
      })
      .addCase(insertPlanning.fulfilled, (state, action) => {
        state.plannings.push(action.payload);
        state.selectedPlanningId = action.payload.id;
      })
      .addCase(updatePlanning.fulfilled, (state, action) => {
        const updatedPlanning = action.payload;
        state.plannings = state.plannings.map((planning) =>
          planning.id === updatedPlanning.id ? updatedPlanning : planning
        );
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
      
      .addCase(deletePlanning.rejected, (state, action) => {
        state.snackbarStatus = {
          message:
            "Erreur lors de la supression du voyage: " + action.error.message!,
          snackBarSeverity: "error",
        };
      }); */
  },
});

export const {
  addArtifact,
  moveArtifact,
  setArtifactIsDragged,
  deleteArtifactFromPlanning,
  selectPlanning,
} = planningSlice.actions;

export const selectAllPlannings = (state: RootState) =>
  state.planningReducer.plannings;
export const selectPlanningId = (state: RootState) =>
  state.planningReducer.selectedPlanningId;
export const selectPlanningArtifacts = (state: RootState) =>
  state.planningReducer.planningArtifacts;
export const selectArtifactIsDragged = (state: RootState) =>
  state.planningReducer.artifactIsDragged;

export default planningSlice.reducer;
