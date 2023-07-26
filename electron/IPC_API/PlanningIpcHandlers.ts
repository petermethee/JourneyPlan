import { ipcMain } from "electron";
import { Database } from "better-sqlite3";
import { IPlanning } from "../../src/Models/IPlanningArtifact";
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
  };
}
