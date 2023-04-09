import { ipcMain } from "electron";
import { Database } from "sqlite3";
import ITrip from "../../src/Models/ITrip";
import DatabaseAPI from "../DatabaseClass";
import TripsManager from "../Managers/TripsManager";
import { EIpcChanels } from "./EIpcChannels";

export default class IPC_API_Trip {
  dataBaseAPI: DatabaseAPI;
  db: Database;
  tripsManager: TripsManager;

  constructor() {
    this.dataBaseAPI = new DatabaseAPI();
    this.db = this.dataBaseAPI.getDataBase();
    this.tripsManager = new TripsManager(this.db);
  }

  initIPCHandlers = () => {
    /////// TRIP /////////
    //SELECT TRIP
    ipcMain.handle(EIpcChanels.getAllTrips, async () => {
      return await this.tripsManager.getAllTrips();
    });

    //INSERT TRIP
    ipcMain.handle(
      EIpcChanels.insertTrip,
      async (_event, trip: Partial<ITrip>) => {
        //trip is partial to allow id deletion
        await this.tripsManager.insertTrip(trip);
      }
    );

    //UPDATE TRIP
    ipcMain.handle(EIpcChanels.updateTrip, async (_event, trip: ITrip) => {
      await this.tripsManager.updateTrip(trip);
    });

    //DELETE TRIP
    ipcMain.handle(EIpcChanels.deleteTrip, async (_event, tripId: number) => {
      await this.tripsManager.deleteTrip(tripId);
    });

    //ACTIVITIES
    //SELECT ACTIVITY
    ipcMain.handle(EIpcChanels.getAllTrips, async () => {
      return await this.tripsManager.getAllTrips();
    });

    //INSERT ACTIVITY
    ipcMain.handle(
      EIpcChanels.insertTrip,
      async (_event, trip: Partial<ITrip>) => {
        //trip is partial to allow id deletion
        await this.tripsManager.insertTrip(trip);
      }
    );

    //UPDATE ACTIVITY
    ipcMain.handle(EIpcChanels.updateTrip, async (_event, trip: ITrip) => {
      await this.tripsManager.updateTrip(trip);
    });

    //DELETE ACTIVITY
    ipcMain.handle(EIpcChanels.deleteTrip, async (_event, tripId: number) => {
      await this.tripsManager.deleteTrip(tripId);
    });
  };
}
