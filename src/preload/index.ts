import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";
import { EIpcChannels } from "../main/IPC_API/EIpcChannels";
import { EArtifactTableName } from "../renderer/src/Models/EArtifacts";
import IPlanningArtifact, {
  IPlanning,
} from "../renderer/src/Models/IPlanningArtifact";
import ITrip from "../renderer/src/Models/ITrip";
import { IArtifact } from "../renderer/src/Models/IArtifact";
import { IElectronAPI } from "../renderer/src/features/ipc/IElectronAPI";

// Custom APIs for renderer
const api: IElectronAPI = {
  //TRIPS
  getAllTrips: () => ipcRenderer.invoke(EIpcChannels.getAllTrips),
  insertTrip: (trip: ITrip) =>
    ipcRenderer.invoke(EIpcChannels.insertTrip, trip),
  updateTrip: (trip: ITrip) =>
    ipcRenderer.invoke(EIpcChannels.updateTrip, trip),
  deleteTrip: (tripId: number) =>
    ipcRenderer.invoke(EIpcChannels.deleteTrip, tripId),

  //GENERIC
  getAllItems: (tableName: EArtifactTableName, tripId: number) =>
    ipcRenderer.invoke(EIpcChannels.getAllItems, tableName, tripId),
  insertItem: (tableName: EArtifactTableName, item: IArtifact) =>
    ipcRenderer.invoke(EIpcChannels.insertItem, tableName, item),
  updateItem: (tableName: EArtifactTableName, item: IArtifact) =>
    ipcRenderer.invoke(EIpcChannels.updateItem, tableName, item),
  deleteItem: (tableName: EArtifactTableName, itemId: number) =>
    ipcRenderer.invoke(EIpcChannels.deleteItem, tableName, itemId),

  //PLANNING
  getAllPlannings: (tripId: number) =>
    ipcRenderer.invoke(EIpcChannels.getAllPlannings, tripId),
  deletePlanning: (planningId: number) =>
    ipcRenderer.invoke(EIpcChannels.deletePlanning, planningId),
  insertPlanning: (planning: IPlanning) =>
    ipcRenderer.invoke(EIpcChannels.insertPlanning, planning),
  updatePlanning: (planning: IPlanning) =>
    ipcRenderer.invoke(EIpcChannels.updatePlanning, planning),

  //PLANNING ARTIFACTS
  getAllArtifactsPlanning: (planningId: number) =>
    ipcRenderer.invoke(EIpcChannels.getAllArtifactsPlanning, planningId),
  deleteArtifactPlanning: (planningArtifactId: number) =>
    ipcRenderer.invoke(EIpcChannels.deleteArtifactPlanning, planningArtifactId),
  insertArtifactPlanning: (planningArtifact: IPlanningArtifact) =>
    ipcRenderer.invoke(EIpcChannels.insertArtifactPlanning, planningArtifact),
  updateArtifactPlanning: (planningArtifact: IPlanningArtifact) =>
    ipcRenderer.invoke(EIpcChannels.updateArtifactPlanning, planningArtifact),
  exportAttachments: (planningId: number) =>
    ipcRenderer.invoke(EIpcChannels.exportAttachments, planningId),
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("electronAPI", api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}
