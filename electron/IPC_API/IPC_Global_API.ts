import { ipcMain } from "electron";
import { Database } from "sqlite3";
import IActivity from "../../src/Models/IActivity";
import DatabaseAPI from "../DatabaseClass";
import { EIpcChanels } from "./EIpcChannels";
import DataBaseManager from "../Managers/DataBaseManager";

export default class IPC_API_Activity {
  dataBaseAPI: DatabaseAPI;
  db: Database;
  activitiesManager: DataBaseManager;

  constructor() {
    this.dataBaseAPI = new DatabaseAPI();
    this.db = this.dataBaseAPI.getDataBase();
    this.activitiesManager = new DataBaseManager(this.db);
  }

  initIPCHandlers = () => {
    //SELECT
    ipcMain.handle(
      EIpcChanels.getAllActivities,
      async (_event, tableName: string, tripId: number) => {
        return await this.activitiesManager.getAllFromTable(tableName, tripId);
      }
    );

    //INSERT
    ipcMain.handle(
      EIpcChanels.insertActivity,
      async (_event, tableName: string, trip: Partial<IActivity>) => {
        //trip is partial to allow id deletion
        await this.activitiesManager.insertInTable(tableName, trip);
      }
    );

    //UPDATE
    ipcMain.handle(
      EIpcChanels.updateActivity,
      async (_event, tableName: string, trip: IActivity) => {
        await this.activitiesManager.updateTable(tableName, trip);
      }
    );

    //DELETE
    ipcMain.handle(
      EIpcChanels.deleteActivity,
      async (_event, tableName: string, tripId: number) => {
        await this.activitiesManager.deleteFromTable(tableName, tripId);
      }
    );
  };
}
