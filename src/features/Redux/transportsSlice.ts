import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ITransport from "../../Models/ITransport";
import {
  deleteItemAPI,
  getAllItemsAPI,
  insertItemAPI,
  updateItemAPI,
} from "../ipc/ipcGenericFunctions";
import { RootState } from "../../app/store";
import { mockedTransports } from "../../MockData/MockedTransports";
import { TablesName } from "../../Models/DataBaseModel";

interface TransportsState {
  transports: ITransport[];
}

const initialState: TransportsState = {
  transports: mockedTransports,
};

export const getAllTransports = createAsyncThunk(
  "getAllTransports",
  async (tripId: number) => {
    return (await getAllItemsAPI(
      TablesName.transports,
      tripId
    )) as ITransport[];
  }
);

export const insertTransport = createAsyncThunk(
  "insertTransport",
  async (transport: ITransport) => {
    return await insertItemAPI(TablesName.transports, transport);
  }
);

export const updateTransport = createAsyncThunk(
  "updateTransport",
  async (transport: ITransport) => {
    return await updateItemAPI(TablesName.transports, transport);
  }
);

export const deleteTransport = createAsyncThunk(
  "deleteTransport",
  async (transportId: number) => {
    await deleteItemAPI(TablesName.transports, transportId);
    return transportId;
  }
);

export const transportsSlice = createSlice({
  name: "transportsSlice",
  initialState: initialState,
  reducers: {
    setAllTransports: (
      state: TransportsState,
      action: PayloadAction<ITransport[]>
    ) => {
      // state.transports = action.payload;
      state.transports = mockedTransports;
    },
    deleteTransport: (
      state: TransportsState,
      action: PayloadAction<number>
    ) => {
      state.transports = state.transports.filter(
        (transport) => transport.id !== action.payload
      );
    },
    setUsedTransports: (
      state: TransportsState,
      action: PayloadAction<number>
    ) => {
      state.transports = state.transports.map((transport) =>
        transport.id === action.payload
          ? { ...transport, used: !transport.used }
          : transport
      );
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getAllTransports.fulfilled, (state, action) => {
        transportsSlice.caseReducers.setAllTransports(state, action);
      })
      .addCase(deleteTransport.fulfilled, (state, action) => {
        transportsSlice.caseReducers.deleteTransport(state, action);
      });
  },
});

export const { setUsedTransports } = transportsSlice.actions;

export const selectTransports = (state: RootState) =>
  state.transportsReducer.transports;

export default transportsSlice.reducer;
