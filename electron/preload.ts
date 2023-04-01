import { contextBridge, ipcRenderer } from "electron";
import { IElectronAPI } from "../src/features/ipc/IElectronAPI";
import { EIpcChanels } from "./ipc";
import ITrip from "../src/Models/ITrip";

type SameAPI<T> = { [k in keyof T]: Function };
contextBridge.exposeInMainWorld("electronAPI", {
  getAllTrips: () => ipcRenderer.invoke(EIpcChanels.getAllTrips),
  insertTrip: (trip: ITrip) => ipcRenderer.invoke(EIpcChanels.insertTrip, trip),
} as SameAPI<IElectronAPI>);
