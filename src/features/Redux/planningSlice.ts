import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import IPlanningArtifact, { IPlanning } from "../../Models/IPlanningArtifact";

import { RootState } from "../../app/store";
import { EArtifact } from "../../Models/EArtifacts";
import {
  deleteArtifactPlanningAPI,
  deletePlanningAPI,
  getAllArtifactsPlanningAPI,
  getAllPlanningsAPI,
  insertArtifactPlanningAPI,
  insertPlanningAPI,
  updateArtifactPlanningAPI,
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
  selectedPlanningId: undefined,
};

export const getAllPlannings = createAsyncThunk(
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

//#region Planning Artifact
export const getAllArtifactsPlanning = createAsyncThunk(
  "getAllArtifactsPlanning",
  async (planningArtifactId: number) => {
    return await getAllArtifactsPlanningAPI(planningArtifactId);
  }
);

export const insertArtifactPlanning = createAsyncThunk(
  "insertArtifactPlanning",
  async (planningArtifact: IPlanningArtifact) => {
    const planningArtifactId = await insertArtifactPlanningAPI(
      planningArtifact
    );
    return planningArtifactId;
  }
);

export const updateArtifactPlanning = createAsyncThunk(
  "updateArtifactPlanning",
  async (planningArtifact: IPlanningArtifact) => {
    await updateArtifactPlanningAPI(planningArtifact);
  }
);

export const deleteArtifactPlanning = createAsyncThunk(
  "deleteArtifactPlanning",
  async (planningArtifactId: number) => {
    await deleteArtifactPlanningAPI(planningArtifactId);
    return planningArtifactId;
  }
);

//#endregion

export const planningSlice = createSlice({
  name: "planningSlice",
  initialState: initialState,
  reducers: {
    selectPlanning: (state: PlanningState, action: PayloadAction<number>) => {
      state.selectedPlanningId = action.payload;
    },
    setArtifactIsDragged: (
      state: PlanningState,
      action: PayloadAction<EArtifact | null>
    ) => {
      state.artifactIsDragged = action.payload;
    },
    addArtifactPlanning: (
      state: PlanningState,
      action: PayloadAction<IPlanningArtifact>
    ) => {
      state.planningArtifacts.push(action.payload);
    },
    moveArtifactPlanning: (
      state: PlanningState,
      action: PayloadAction<IPlanningArtifact>
    ) => {
      const updatedPlanningArtifact = action.payload;

      state.planningArtifacts = state.planningArtifacts.map((PA) =>
        PA.id === updatedPlanningArtifact.id ? updatedPlanningArtifact : PA
      );
    },
    resetPlanningSlice: () => initialState,
  },
  extraReducers(builder) {
    builder
      .addCase(getAllPlannings.fulfilled, (state, action) => {
        state.plannings = action.payload;
        planningSlice.caseReducers.selectPlanning(state, {
          payload: action.payload[0].id,
          type: action.type,
        });
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
      })
      //Planning Artifact
      .addCase(getAllArtifactsPlanning.fulfilled, (state, action) => {
        state.planningArtifacts = action.payload;
      })
      .addCase(deleteArtifactPlanning.fulfilled, (state, action) => {
        state.planningArtifacts = state.planningArtifacts.filter(
          (PA) => PA.id !== action.payload
        );
      })
      .addCase(insertArtifactPlanning.fulfilled, (state, action) => {
        const newlyAddedPA = state.planningArtifacts.find((PA) => PA.id === 0)!;
        newlyAddedPA.id = action.payload;
      });
  },
});

export const {
  setArtifactIsDragged,
  selectPlanning,
  addArtifactPlanning,
  moveArtifactPlanning,
  resetPlanningSlice,
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
