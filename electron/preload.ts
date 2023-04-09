import { contextBridge, ipcRenderer } from "electron";
import { IElectronAPI } from "../src/features/ipc/IElectronAPI";
import ITrip from "../src/Models/ITrip";
import { EIpcChanels } from "./IPC_API/EIpcChannels";
import IActivity from "../src/Models/IActivity";

type SameAPI<T> = { [k in keyof T]: Function };
contextBridge.exposeInMainWorld("electronAPI", {
  //TRIPS
  getAllTrips: () => ipcRenderer.invoke(EIpcChanels.getAllTrips),
  insertTrip: (trip: ITrip) => ipcRenderer.invoke(EIpcChanels.insertTrip, trip),
  updateTrip: (trip: ITrip) => ipcRenderer.invoke(EIpcChanels.updateTrip, trip),
  deleteTrip: (tripId: number) =>
    ipcRenderer.invoke(EIpcChanels.deleteTrip, tripId),

  //ACTIVITY
  getAllActivities: (tripId: number) =>
    ipcRenderer.invoke(EIpcChanels.getAllActivities, tripId),
  insertActivity: (activity: IActivity) =>
    ipcRenderer.invoke(EIpcChanels.insertActivity, activity),
  updateActivity: (activity: IActivity) =>
    ipcRenderer.invoke(EIpcChanels.updateActivity, activity),
  deleteActivity: (activityId: number) =>
    ipcRenderer.invoke(EIpcChanels.deleteActivity, activityId),
} as SameAPI<IElectronAPI>);
