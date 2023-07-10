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
    const id = await insertItemAPI(
      EArtifactTableName.Accomodation,
      accomodation
    );
    return { ...accomodation, id };
  }
);

export const updateAccomodation = createAsyncThunk(
  "updateAccomodation",
  async (accomodation: IAccomodation) => {
    return await updateItemAPI(EArtifactTableName.Accomodation, accomodation);
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
      });
  },
});

export const { setUsedAccomodations } = accomodationsSlice.actions;

export const selectAccomodations = (state: RootState) =>
  state.accomodationsReducer.accomodations;

export default accomodationsSlice.reducer;
