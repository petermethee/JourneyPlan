import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import IAccomodation from "../../Models/IAccomodation";
import {
  deleteItemAPI,
  getAllItemsAPI,
  insertItemAPI,
  updateItemAPI,
} from "../ipc/ipcGenericFunctions";
import { RootState } from "../../app/store";
import { mockedAccomodations } from "../../MockData/MockedAccomodations";
import { TablesName } from "../../Models/DataBaseModel";

interface AccomodationsState {
  accomodations: IAccomodation[];
  accomodationIsDragged: boolean;
}

const initialState: AccomodationsState = {
  accomodations: mockedAccomodations,
  accomodationIsDragged: false,
};

export const getAllAccomodations = createAsyncThunk(
  "getAllAccomodations",
  async (tripId: number) => {
    return (await getAllItemsAPI(
      TablesName.accomodations,
      tripId
    )) as IAccomodation[];
  }
);

export const insertAccomodation = createAsyncThunk(
  "insertAccomodation",
  async (accomodation: IAccomodation) => {
    return await insertItemAPI(TablesName.accomodations, accomodation);
  }
);

export const updateAccomodation = createAsyncThunk(
  "updateAccomodation",
  async (accomodation: IAccomodation) => {
    return await updateItemAPI(TablesName.accomodations, accomodation);
  }
);

export const deleteAccomodation = createAsyncThunk(
  "deleteAccomodation",
  async (accomodationId: number) => {
    await deleteItemAPI(TablesName.accomodations, accomodationId);
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
      // state.accomodations = action.payload;
      state.accomodations = mockedAccomodations;
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
          ? { ...accomodation, used: true }
          : accomodation
      );
    },
    setAccomdationIsDragged: (
      state: AccomodationsState,
      action: PayloadAction<boolean>
    ) => {
      state.accomodationIsDragged = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getAllAccomodations.fulfilled, (state, action) => {
        accomodationsSlice.caseReducers.setAllAccomodations(state, action);
      })
      .addCase(deleteAccomodation.fulfilled, (state, action) => {
        accomodationsSlice.caseReducers.deleteAccomodation(state, action);
      });
  },
});

export const { setUsedAccomodations, setAccomdationIsDragged } =
  accomodationsSlice.actions;

export const selectAccomodations = (state: RootState) =>
  state.accomodationsReducer.accomodations;
export const selectAccomodationIsDragged = (state: RootState) =>
  state.accomodationsReducer.accomodationIsDragged;

export default accomodationsSlice.reducer;
