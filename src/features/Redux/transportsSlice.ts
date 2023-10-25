import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ITransport from "../../Models/ITransport";
import {
  deleteItemAPI,
  getAllItemsAPI,
  insertItemAPI,
  updateItemAPI,
} from "../ipc/ipcArtifactsFunctions";
import { RootState } from "../../app/store";
import { EArtifactTableName } from "../../Models/EArtifacts";
import IPlanningArtifact from "../../Models/IPlanningArtifact";

interface TransportsState {
  transports: ITransport[];
}

const initialState: TransportsState = {
  transports: [],
};

export const getAllTransports = createAsyncThunk(
  "getAllTransports",
  async (tripId: number) => {
    return (await getAllItemsAPI(
      EArtifactTableName.Transport,
      tripId
    )) as ITransport[];
  }
);

export const insertTransport = createAsyncThunk(
  "insertTransport",
  async (transport: ITransport) => {
    const result = await insertItemAPI(EArtifactTableName.Transport, transport);
    return { ...transport, id: result.id, attachment: result.newAttachments };
  }
);

export const updateTransport = createAsyncThunk(
  "updateTransport",
  async (transport: ITransport) => {
    await updateItemAPI(EArtifactTableName.Transport, transport);
    return transport;
  }
);

export const deleteTransport = createAsyncThunk(
  "deleteTransport",
  async (transportId: number) => {
    await deleteItemAPI(EArtifactTableName.Transport, transportId);
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
      state.transports = action.payload;
    },
    insertTransport: (
      state: TransportsState,
      action: PayloadAction<ITransport>
    ) => {
      state.transports.push(action.payload);
    },
    updateTransport: (
      state: TransportsState,
      action: PayloadAction<ITransport>
    ) => {
      const updatedTransport = action.payload;
      state.transports = state.transports.map((transport) =>
        transport.id === updatedTransport.id ? updatedTransport : transport
      );
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
          ? { ...transport, used: transport.used === 0 ? 1 : 0 }
          : transport
      );
    },
    updateUsedTransports: (
      state: TransportsState,
      action: PayloadAction<IPlanningArtifact[]>
    ) => {
      state.transports.forEach((transport) => {
        transport.used = action.payload.some(
          (PA) => PA.artifactId === transport.id
        )
          ? 1
          : 0;
      });
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getAllTransports.fulfilled, (state, action) => {
        transportsSlice.caseReducers.setAllTransports(state, action);
      })
      .addCase(deleteTransport.fulfilled, (state, action) => {
        transportsSlice.caseReducers.deleteTransport(state, action);
      })
      .addCase(insertTransport.fulfilled, (state, action) => {
        transportsSlice.caseReducers.insertTransport(state, action);
      })
      .addCase(updateTransport.fulfilled, (state, action) => {
        transportsSlice.caseReducers.updateTransport(state, action);
      });
  },
});

export const { setUsedTransports, updateUsedTransports } =
  transportsSlice.actions;

export const selectTransports = (state: RootState) =>
  state.transportsReducer.transports;

export default transportsSlice.reducer;
