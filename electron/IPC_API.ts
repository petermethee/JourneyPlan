import { ipcMain } from "electron";
import { Database } from "sqlite3";
import ITrip from "../src/Models/ITrip";
import DatabaseAPI from "./DatabaseClass";
import TripsManager from "./Managers/TripsManager";
import AccommodationManager from "./Managers/AccomodationsManager";
import ActivitiesManager from "./Managers/ActivitiesManager ";
import PlanningsManager from "./Managers/PlanningsManager";
import TransportsManager from "./Managers/TransportsManager";

export enum EIpcChanels {
  getAllTrips = "getAllTrips",
  insertTrip = "insertTrip",
  updateTrip = "updateTrip",
}
export default class IPC_API {
  dataBaseAPI: DatabaseAPI;
  db: Database;
  tripsManager: TripsManager;
  accommodationManager: AccommodationManager;
  activitiesManager: ActivitiesManager;
  planningsManager: PlanningsManager;
  transportsManager: TransportsManager;

  constructor() {
    this.dataBaseAPI = new DatabaseAPI();
    this.db = this.dataBaseAPI.getDataBase();
    this.tripsManager = new TripsManager(this.db);
    this.accommodationManager = new AccommodationManager(this.db);
    this.activitiesManager = new ActivitiesManager(this.db);
    this.planningsManager = new PlanningsManager(this.db);
    this.transportsManager = new TransportsManager(this.db);
  }

  initIPCHandlers = () => {
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

    //INSERT TRIP
    ipcMain.handle(EIpcChanels.updateTrip, async (_event, trip: ITrip) => {
      await this.tripsManager.updateTrip(trip);
    });
  };
}
