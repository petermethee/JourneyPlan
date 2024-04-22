import { ipcMain } from "electron";
import { Database } from "better-sqlite3";
import IActivity from "../../../src/renderer/src/Models/IActivity";
import DatabaseAPI from "../DatabaseClass";
import { EIpcChannels } from "./EIpcChannels";
import ArtifactsDbManager from "../Managers/ArtifactsDbManager";
import { EArtifactTableName } from "../../../src/renderer/src/Models/EArtifacts";
import ITransport from "../../../src/renderer/src/Models/ITransport";
import IAccommodation from "../../../src/renderer/src/Models/IAccommodation";

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
      EIpcChannels.getAllItems,
      (_event, tableName: EArtifactTableName, tripId: number) => {
        return this.dataBaseManager.getAllFromTable(tableName, tripId);
      },
    );

    //INSERT
    ipcMain.handle(
      EIpcChannels.insertItem,
      (
        _event,
        tableName: EArtifactTableName,
        artifact:
          | Partial<IActivity>
          | Partial<ITransport>
          | Partial<IAccommodation>,
      ) => {
        //trip is partial to allow id deletion
        return this.dataBaseManager.insertInTable(tableName, artifact);
      },
    );

    //UPDATE
    ipcMain.handle(
      EIpcChannels.updateItem,
      (_event, tableName: EArtifactTableName, trip: IActivity) => {
        return this.dataBaseManager.updateTable(tableName, trip);
      },
    );

    //DELETE
    ipcMain.handle(
      EIpcChannels.deleteItem,
      (_event, tableName: EArtifactTableName, tripId: number) => {
        this.dataBaseManager.deleteFromTable(tableName, tripId);
      },
    );
  };
}
