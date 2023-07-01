import { ipcMain } from "electron";
import { Database } from "sqlite3";
import IActivity from "../../src/Models/IActivity";
import DatabaseAPI from "../DatabaseClass";
import { EIpcChanels } from "./EIpcChannels";
import ArtifactsDbManager from "../Managers/ArtifactsDbManager";
import { TablesName } from "../../src/Models/DataBaseModel";
import { EArtifactTableName } from "../../src/Models/EArtifacts";

export default class ArtifactIpcHandlers {
  db: Database;
  dataBaseManager: ArtifactsDbManager;

  constructor(dataBaseAPI: DatabaseAPI) {
    this.db = dataBaseAPI.getDataBase();
    this.dataBaseManager = new ArtifactsDbManager(this.db);
  }

  initIPCHandlers = () => {
    //SELECT
    ipcMain.handle(
      EIpcChanels.getAllItems,
      async (_event, tableName: EArtifactTableName, tripId: number) => {
        return await this.dataBaseManager.getAllFromTable(tableName, tripId);
      }
    );

    //INSERT
    ipcMain.handle(
      EIpcChanels.insertItem,
      async (
        _event,
        tableName: EArtifactTableName,
        trip: Partial<IActivity>
      ) => {
        //trip is partial to allow id deletion
        await this.dataBaseManager.insertInTable(tableName, trip);
      }
    );

    //UPDATE
    ipcMain.handle(
      EIpcChanels.updateItem,
      async (_event, tableName: EArtifactTableName, trip: IActivity) => {
        await this.dataBaseManager.updateTable(tableName, trip);
      }
    );

    //DELETE
    ipcMain.handle(
      EIpcChanels.deleteItem,
      async (_event, tableName: EArtifactTableName, tripId: number) => {
        await this.dataBaseManager.deleteFromTable(tableName, tripId);
      }
    );
  };
}
