import { ipcMain } from "electron";
import { Database } from "sqlite3";
import IActivity from "../../src/Models/IActivity";
import DatabaseAPI from "../DatabaseClass";
import ActivitiesManager from "../Managers/ActivitiesManager";
import { EIpcChanels } from "./EIpcChannels";

export default class IPC_API_Activity {
  dataBaseAPI: DatabaseAPI;
  db: Database;
  activitiesManager: ActivitiesManager;

  constructor() {
    this.dataBaseAPI = new DatabaseAPI();
    this.db = this.dataBaseAPI.getDataBase();
    this.activitiesManager = new ActivitiesManager(this.db);
  }

  initIPCHandlers = () => {
    //ACTIVITIES
    //SELECT ACTIVITY
    ipcMain.handle(
      EIpcChanels.getAllActivities,
      async (_event, tripId: number) => {
        return await this.activitiesManager.getAllActivities(tripId);
      }
    );

    //INSERT ACTIVITY
    ipcMain.handle(
      EIpcChanels.insertActivity,
      async (_event, trip: Partial<IActivity>) => {
        //trip is partial to allow id deletion
        await this.activitiesManager.insertActivity(trip);
      }
    );

    //UPDATE ACTIVITY
    ipcMain.handle(
      EIpcChanels.updateActivity,
      async (_event, trip: IActivity) => {
        await this.activitiesManager.updateActivity(trip);
      }
    );

    //DELETE ACTIVITY
    ipcMain.handle(
      EIpcChanels.deleteActivity,
      async (_event, tripId: number) => {
        await this.activitiesManager.deleteActivity(tripId);
      }
    );
  };
}
