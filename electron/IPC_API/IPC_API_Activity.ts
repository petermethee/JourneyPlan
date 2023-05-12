import { ipcMain } from "electron";
import { Database } from "sqlite3";
import IActivity from "../../src/Models/IActivity";
import DatabaseAPI from "../DatabaseClass";
import { EIpcChanels } from "./EIpcChannels";
import DataBaseManager from "../Managers/DataBaseManager";

export default class IPC_API_Activity {
  db: Database;
  activitiesManager: DataBaseManager;

  constructor(dataBaseAPI: DatabaseAPI) {
    this.db = dataBaseAPI.getDataBase();
    this.activitiesManager = new DataBaseManager(this.db);
  }

  initIPCHandlers = () => {
    //SELECT
    ipcMain.handle(
      EIpcChanels.getAllItems,
      async (_event, tableName: string, tripId: number) => {
        return await this.activitiesManager.getAllFromTable(tableName, tripId);
      }
    );

    //INSERT
    ipcMain.handle(
      EIpcChanels.insertItem,
      async (_event, tableName: string, trip: Partial<IActivity>) => {
        //trip is partial to allow id deletion
        await this.activitiesManager.insertInTable(tableName, trip);
      }
    );

    //UPDATE
    ipcMain.handle(
      EIpcChanels.updateItem,
      async (_event, tableName: string, trip: IActivity) => {
        await this.activitiesManager.updateTable(tableName, trip);
      }
    );

    //DELETE
    ipcMain.handle(
      EIpcChanels.deleteItem,
      async (_event, tableName: string, tripId: number) => {
        await this.activitiesManager.deleteFromTable(tableName, tripId);
      }
    );
  };
}
