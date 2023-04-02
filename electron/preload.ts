import { contextBridge, ipcRenderer } from "electron";
import { IElectronAPI } from "../src/features/ipc/IElectronAPI";
import { EIpcChanels } from "./IPC_API";
import ITrip from "../src/Models/ITrip";

type SameAPI<T> = { [k in keyof T]: Function };
contextBridge.exposeInMainWorld("electronAPI", {
  getAllTrips: () => ipcRenderer.invoke(EIpcChanels.getAllTrips),
  insertTrip: (trip: ITrip) => ipcRenderer.invoke(EIpcChanels.insertTrip, trip),
  updateTrip: (trip: ITrip) => ipcRenderer.invoke(EIpcChanels.updateTrip, trip),
} as SameAPI<IElectronAPI>);
