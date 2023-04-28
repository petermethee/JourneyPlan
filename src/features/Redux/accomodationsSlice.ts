import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import IAccomodation from "../../Models/IAccomodation";
import {
  deleteItemAPI,
  getAllItemsAPI,
  insertItemAPI,
  updateItemAPI,
} from "../ipc/ipcGenericFunctions";
import { RootState } from "../../app/store";
import { AlertColor } from "@mui/material";
import { mockedAccomodations } from "../../MockData/MockedAccomodations";
import { TablesName } from "../../Models/DataBaseModel";

interface AccomodationsState {
  accomodations: IAccomodation[];
  snackbarStatus: {
    snackBarSeverity?: AlertColor;
    message: string;
  };
}

const initialState: AccomodationsState = {
  accomodations: mockedAccomodations,
  snackbarStatus: { message: "" },
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

export const { setUsedAccomodations } = accomodationsSlice.actions;

export const selectAccomodations = (state: RootState) =>
  state.accomodationsReducer.accomodations;

export default accomodationsSlice.reducer;
