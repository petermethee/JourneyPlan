import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { EIpcChanels } from '../main/IPC_API/EIpcChannels'
import { EArtifactTableName } from '../renderer/src/Models/EArtifacts'
import IPlanningArtifact, { IPlanning } from '../renderer/src/Models/IPlanningArtifact'
import ITrip from '../renderer/src/Models/ITrip'
import { IArtifact } from '../renderer/src/Models/IArtifact'
import { IElectronAPI } from '../renderer/src/features/ipc/IElectronAPI'

// Custom APIs for renderer
const api: IElectronAPI = {
  //TRIPS
  getAllTrips: () => ipcRenderer.invoke(EIpcChanels.getAllTrips),
  insertTrip: (trip: ITrip) => ipcRenderer.invoke(EIpcChanels.insertTrip, trip),
  updateTrip: (trip: ITrip) => ipcRenderer.invoke(EIpcChanels.updateTrip, trip),
  deleteTrip: (tripId: number) => ipcRenderer.invoke(EIpcChanels.deleteTrip, tripId),

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
  getAllPlannings: (tripId: number) => ipcRenderer.invoke(EIpcChanels.getAllPlannings, tripId),
  deletePlanning: (planningId: number) =>
    ipcRenderer.invoke(EIpcChanels.deletePlanning, planningId),
  insertPlanning: (planning: IPlanning) => ipcRenderer.invoke(EIpcChanels.insertPlanning, planning),
  updatePlanning: (planning: IPlanning) => ipcRenderer.invoke(EIpcChanels.updatePlanning, planning),

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
    ipcRenderer.invoke(EIpcChanels.exportAttachments, planningId)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('electronAPI', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
