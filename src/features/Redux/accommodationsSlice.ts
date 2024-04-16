import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import IAccommodation from "../../Models/IAccommodation";
import {
  deleteItemAPI,
  getAllItemsAPI,
  insertItemAPI,
  updateItemAPI,
} from "../ipc/ipcArtifactsFunctions";
import { RootState } from "../../app/store";
import { EArtifactTableName } from "../../Models/EArtifacts";
import IPlanningArtifact from "../../Models/IPlanningArtifact";

interface AccommodationsState {
  accommodations: IAccommodation[];
  accommodationIsDragged: boolean;
}

const initialState: AccommodationsState = {
  accommodations: [],
  accommodationIsDragged: false,
};

export const getAllAccommodations = createAsyncThunk(
  "getAllAccommodations",
  async (tripId: number) => {
    return (await getAllItemsAPI(
      EArtifactTableName.Accommodation,
      tripId
    )) as IAccommodation[];
  }
);

export const insertAccommodation = createAsyncThunk(
  "insertAccommodation",
  async (accommodation: IAccommodation) => {
    const result = await insertItemAPI(
      EArtifactTableName.Accommodation,
      accommodation
    );
    return {
      ...accommodation,
      id: result.id,
      attachment: result.newAttachments,
    };
  }
);

export const updateAccommodation = createAsyncThunk(
  "updateAccommodation",
  async (accommodation: IAccommodation) => {
    await updateItemAPI(EArtifactTableName.Accommodation, accommodation);
    return accommodation;
  }
);

export const deleteAccommodation = createAsyncThunk(
  "deleteAccommodation",
  async (accommodationId: number) => {
    await deleteItemAPI(EArtifactTableName.Accommodation, accommodationId);
    return accommodationId;
  }
);

export const accommodationsSlice = createSlice({
  name: "accommodationsSlice",
  initialState: initialState,
  reducers: {
    setAllAccommodations: (
      state: AccommodationsState,
      action: PayloadAction<IAccommodation[]>
    ) => {
      state.accommodations = action.payload;
    },
    insertAccommodation: (
      state: AccommodationsState,
      action: PayloadAction<IAccommodation>
    ) => {
      state.accommodations.push(action.payload);
    },
    updateAccommodation: (
      state: AccommodationsState,
      action: PayloadAction<IAccommodation>
    ) => {
      const updatedAccommodation = action.payload;
      state.accommodations = state.accommodations.map((activity) =>
        activity.id === updatedAccommodation.id
          ? updatedAccommodation
          : activity
      );
    },
    deleteAccommodation: (
      state: AccommodationsState,
      action: PayloadAction<number>
    ) => {
      state.accommodations = state.accommodations.filter(
        (accommodation) => accommodation.id !== action.payload
      );
    },
    setUsedAccommodations: (
      state: AccommodationsState,
      action: PayloadAction<number>
    ) => {
      state.accommodations = state.accommodations.map((accommodation) =>
        accommodation.id === action.payload
          ? { ...accommodation, used: !accommodation.used }
          : accommodation
      );
    },
    initUsedAccommodations: (
      state: AccommodationsState,
      action: PayloadAction<IPlanningArtifact[]>
    ) => {
      state.accommodations.forEach((accommodation) => {
        accommodation.used = action.payload.some(
          (PA) => PA.artifactId === accommodation.id
        );
      });
    },
    resetAccommodationsSlice: () => initialState,
  },
  extraReducers(builder) {
    builder
      .addCase(getAllAccommodations.fulfilled, (state, action) => {
        accommodationsSlice.caseReducers.setAllAccommodations(state, action);
      })
      .addCase(deleteAccommodation.fulfilled, (state, action) => {
        accommodationsSlice.caseReducers.deleteAccommodation(state, action);
      })
      .addCase(insertAccommodation.fulfilled, (state, action) => {
        accommodationsSlice.caseReducers.insertAccommodation(state, action);
      })
      .addCase(updateAccommodation.fulfilled, (state, action) => {
        accommodationsSlice.caseReducers.updateAccommodation(state, action);
      });
  },
});

export const {
  setUsedAccommodations,
  initUsedAccommodations,
  resetAccommodationsSlice,
} = accommodationsSlice.actions;

export const selectAccommodations = (state: RootState) =>
  state.accommodationsReducer.accommodations;

export default accommodationsSlice.reducer;
