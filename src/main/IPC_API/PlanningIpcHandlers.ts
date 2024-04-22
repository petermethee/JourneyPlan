import { ipcMain } from "electron";
import { Database } from "better-sqlite3";
import IPlanningArtifact, {
  IPlanning,
} from "../../../src/renderer/src/Models/IPlanningArtifact";
import DatabaseAPI from "../DatabaseClass";
import PlanningsManager from "../Managers/PlanningsManager";
import { EIpcChanels } from "./EIpcChannels";

export default class PlanningIpcHandlers {
  db: Database;
  planningsManager: PlanningsManager;

  constructor(dataBaseAPI: DatabaseAPI) {
    this.db = dataBaseAPI.getDataBase();
    this.planningsManager = new PlanningsManager(this.db);
  }

  initIPCHandlers = () => {
    ipcMain.handle(
      EIpcChanels.getAllPlannings,
      async (_event, tripId: number) => {
        return await this.planningsManager.getAllPlannings(tripId);
      }
    );

    ipcMain.handle(
      EIpcChanels.insertPlanning,
      async (_event, planning: Partial<IPlanning>) => {
        //planning is partial to allow id deletion
        return await this.planningsManager.insertPlanning(planning);
      }
    );

    ipcMain.handle(
      EIpcChanels.updatePlanning,
      async (_event, planning: IPlanning) => {
        await this.planningsManager.updatePlanning(planning);
      }
    );

    ipcMain.handle(
      EIpcChanels.deletePlanning,
      async (_event, planningId: number) => {
        await this.planningsManager.deletePlanning(planningId);
      }
    );

    ipcMain.handle(
      EIpcChanels.getAllArtifactsPlanning,
      async (_event, planningId: number) => {
        return await this.planningsManager.getAllArtifactsPlanning(planningId);
      }
    );
    ipcMain.handle(
      EIpcChanels.insertArtifactPlanning,
      async (_event, planningArtifact: IPlanningArtifact) => {
        return await this.planningsManager.insertArtifactPlanning(
          planningArtifact
        );
      }
    );
    ipcMain.handle(
      EIpcChanels.updateArtifactPlanning,
      async (_event, planningArtifact: IPlanningArtifact) => {
        await this.planningsManager.updateArtifactPlanning(planningArtifact);
      }
    );
    ipcMain.handle(
      EIpcChanels.deleteArtifactPlanning,
      async (_event, planningArtifactId: number) => {
        await this.planningsManager.deleteArtifactPlanning(planningArtifactId);
      }
    );

    ipcMain.handle(
      EIpcChanels.exportAttachments,
      async (_event, planningId: number) => {
        await this.planningsManager.exportAttachments(planningId);
      }
    );
  };
}
