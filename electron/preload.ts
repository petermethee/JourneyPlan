import { contextBridge, ipcRenderer } from "electron";
import { IElectronAPI } from "../src/features/ipc/IElectronAPI";
import { EIpcChanels } from "./ipc";

type SameAPI<T> = { [k in keyof T]: Function };
contextBridge.exposeInMainWorld("electronAPI", {
  getAllTrips: () => ipcRenderer.invoke(EIpcChanels.getAllTrips),
} as SameAPI<IElectronAPI>);
