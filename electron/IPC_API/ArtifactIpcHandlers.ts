import { ipcMain } from "electron";
import { Database } from "better-sqlite3";
import IActivity from "../../src/Models/IActivity";
import DatabaseAPI from "../DatabaseClass";
import { EIpcChanels } from "./EIpcChannels";
import ArtifactsDbManager from "../Managers/ArtifactsDbManager";
import { TablesName } from "../../src/Models/DataBaseModel";
import { EArtifactTableName } from "../../src/Models/EArtifacts";
import ITransport from "../../src/Models/ITransport";
import IAccomodation from "../../src/Models/IAccomodation";

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
      (_event, tableName: EArtifactTableName, tripId: number) => {
        return this.dataBaseManager.getAllFromTable(tableName, tripId);
      }
    );

    //INSERT
    ipcMain.handle(
      EIpcChanels.insertItem,
      (
        _event,
        tableName: EArtifactTableName,
        artifact:
          | Partial<IActivity>
          | Partial<ITransport>
          | Partial<IAccomodation>
      ) => {
        //trip is partial to allow id deletion
        return this.dataBaseManager.insertInTable(tableName, artifact);
      }
    );

    //UPDATE
    ipcMain.handle(
      EIpcChanels.updateItem,
      (_event, tableName: EArtifactTableName, trip: IActivity) => {
        return this.dataBaseManager.updateTable(tableName, trip);
      }
    );

    //DELETE
    ipcMain.handle(
      EIpcChanels.deleteItem,
      (_event, tableName: EArtifactTableName, tripId: number) => {
        this.dataBaseManager.deleteFromTable(tableName, tripId);
      }
    );
  };
}
