import { contextBridge, ipcRenderer } from "electron";
import { IElectronAPI } from "../src/features/ipc/IElectronAPI";
import ITrip from "../src/Models/ITrip";
import { EIpcChanels } from "./IPC_API/EIpcChannels";
import { IArtifact } from "../src/Models/IArtifact";
import { EArtifactTableName } from "../src/Models/EArtifacts";
import IPlanningArtifact, { IPlanning } from "../src/Models/IPlanningArtifact";

type SameAPI<T> = { [k in keyof T]: Function };
contextBridge.exposeInMainWorld("electronAPI", {
  //TRIPS
  getAllTrips: () => ipcRenderer.invoke(EIpcChanels.getAllTrips),
  insertTrip: (trip: ITrip) => ipcRenderer.invoke(EIpcChanels.insertTrip, trip),
  updateTrip: (trip: ITrip) => ipcRenderer.invoke(EIpcChanels.updateTrip, trip),
  deleteTrip: (tripId: number) =>
    ipcRenderer.invoke(EIpcChanels.deleteTrip, tripId),

  //GENERIC
  getAllItems: (tableName: EArtifactTableName, tripId: number) =>
    ipcRenderer.invoke(EIpcChanels.getAllItems, tableName, tripId),
  insertItem: (tableName: EArtifactTableName, item: IArtifact) =>
    ipcRenderer.invoke(EIpcChanels.insertItem, tableName, item),
  updateItem: (tableName: EArtifactTableName, item: IArtifact) =>
    ipcRenderer.invoke(EIpcChanels.updateItem, tableName, item),
  deleteItem: (tableName: EArtifactTableName, itemId: number) =>
    ipcRenderer.invoke(EIpcChanels.deleteItem, tableName, itemId),

  //PLANNING
  getAllPlannings: (tripId: number) =>
    ipcRenderer.invoke(EIpcChanels.getAllPlannings, tripId),
  deletePlanning: (planningId: number) =>
    ipcRenderer.invoke(EIpcChanels.deletePlanning, planningId),
  insertPlanning: (planning: IPlanning) =>
    ipcRenderer.invoke(EIpcChanels.insertPlanning, planning),
  updatePlanning: (planning: IPlanning) =>
    ipcRenderer.invoke(EIpcChanels.updatePlanning, planning),

  //PLANNING ARTIFACTS
  getAllArtifactsPlanning: (planningId: number) =>
    ipcRenderer.invoke(EIpcChanels.getAllArtifactsPlanning, planningId),
  deleteArtifactPlanning: (planningArtifactId: number) =>
    ipcRenderer.invoke(EIpcChanels.deleteArtifactPlanning, planningArtifactId),
  insertArtifactPlanning: (planningArtifact: IPlanningArtifact) =>
    ipcRenderer.invoke(EIpcChanels.insertArtifactPlanning, planningArtifact),
  updateArtifactPlanning: (planningArtifact: IPlanningArtifact) =>
    ipcRenderer.invoke(EIpcChanels.updateArtifactPlanning, planningArtifact),
  exportAttachments: (planningId: number) =>
    ipcRenderer.invoke(EIpcChanels.exportAttachments, planningId),
} as SameAPI<IElectronAPI>);
