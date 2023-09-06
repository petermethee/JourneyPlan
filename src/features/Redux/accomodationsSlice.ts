import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import IAccomodation from "../../Models/IAccomodation";
import {
  deleteItemAPI,
  getAllItemsAPI,
  insertItemAPI,
  updateItemAPI,
} from "../ipc/ipcGenericFunctions";
import { RootState } from "../../app/store";
import { EArtifactTableName } from "../../Models/EArtifacts";
import IPlanningArtifact from "../../Models/IPlanningArtifact";

interface AccomodationsState {
  accomodations: IAccomodation[];
  accomodationIsDragged: boolean;
}

const initialState: AccomodationsState = {
  accomodations: [],
  accomodationIsDragged: false,
};

export const getAllAccomodations = createAsyncThunk(
  "getAllAccomodations",
  async (tripId: number) => {
    return (await getAllItemsAPI(
      EArtifactTableName.Accomodation,
      tripId
    )) as IAccomodation[];
  }
);

export const insertAccomodation = createAsyncThunk(
  "insertAccomodation",
  async (accomodation: IAccomodation) => {
    const result = await insertItemAPI(
      EArtifactTableName.Accomodation,
      accomodation
    );
    return {
      ...accomodation,
      id: result.id,
      attachment: result.newAttachments,
    };
  }
);

export const updateAccomodation = createAsyncThunk(
  "updateAccomodation",
  async (accomodation: IAccomodation) => {
    await updateItemAPI(EArtifactTableName.Accomodation, accomodation);
    return accomodation;
  }
);

export const deleteAccomodation = createAsyncThunk(
  "deleteAccomodation",
  async (accomodationId: number) => {
    await deleteItemAPI(EArtifactTableName.Accomodation, accomodationId);
    return accomodationId;
  }
);

export const accomodationsSlice = createSlice({
  name: "accomodationsSlice",
  initialState: initialState,
  reducers: {
    setAllAccomodations: (
      state: AccomodationsState,
      action: PayloadAction<IAccomodation[]>
    ) => {
      state.accomodations = action.payload;
    },
    insertAccomodation: (
      state: AccomodationsState,
      action: PayloadAction<IAccomodation>
    ) => {
      state.accomodations.push(action.payload);
    },
    updateAccomodation: (
      state: AccomodationsState,
      action: PayloadAction<IAccomodation>
    ) => {
      const updatedAccomodation = action.payload;
      state.accomodations = state.accomodations.map((activity) =>
        activity.id === updatedAccomodation.id ? updatedAccomodation : activity
      );
    },
    deleteAccomodation: (
      state: AccomodationsState,
      action: PayloadAction<number>
    ) => {
      state.accomodations = state.accomodations.filter(
        (accomodation) => accomodation.id !== action.payload
      );
    },
    setUsedAccomodations: (
      state: AccomodationsState,
      action: PayloadAction<number>
    ) => {
      state.accomodations = state.accomodations.map((accomodation) =>
        accomodation.id === action.payload
          ? { ...accomodation, used: accomodation.used === 0 ? 1 : 0 }
          : accomodation
      );
    },
    updateUsedAccomodations: (
      state: AccomodationsState,
      action: PayloadAction<IPlanningArtifact[]>
    ) => {
      state.accomodations.forEach((accomodation) => {
        accomodation.used = action.payload.some(
          (PA) => PA.artifactId === accomodation.id
        )
          ? 1
          : 0;
      });
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getAllAccomodations.fulfilled, (state, action) => {
        accomodationsSlice.caseReducers.setAllAccomodations(state, action);
      })
      .addCase(deleteAccomodation.fulfilled, (state, action) => {
        accomodationsSlice.caseReducers.deleteAccomodation(state, action);
      })
      .addCase(insertAccomodation.fulfilled, (state, action) => {
        accomodationsSlice.caseReducers.insertAccomodation(state, action);
      })
      .addCase(updateAccomodation.fulfilled, (state, action) => {
        accomodationsSlice.caseReducers.updateAccomodation(state, action);
      });
  },
});

export const { setUsedAccomodations, updateUsedAccomodations } =
  accomodationsSlice.actions;

export const selectAccomodations = (state: RootState) =>
  state.accomodationsReducer.accomodations;

export default accomodationsSlice.reducer;
