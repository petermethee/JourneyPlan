import { ipcMain } from "electron";
import ITrip from "../../../src/renderer/src/Models/ITrip";
import DatabaseAPI from "../DatabaseClass";
import TripsManager from "../Managers/TripsManager";
import { EIpcChannels } from "./EIpcChannels";

export default class TripIpcHandlers {
  tripsManager: TripsManager;

  constructor(dataBaseAPI: DatabaseAPI) {
    this.tripsManager = new TripsManager(dataBaseAPI.db);
  }

  initIPCHandlers = () => {
    /////// TRIP /////////
    //SELECT TRIP
    ipcMain.handle(EIpcChannels.getAllTrips, async () => {
      return await this.tripsManager.getAllTrips();
    });

    //INSERT TRIP
    ipcMain.handle(
      EIpcChannels.insertTrip,
      async (_event, trip: Partial<ITrip>) => {
        //trip is partial to allow id deletion
        await this.tripsManager.insertTrip(trip);
      },
    );

    //UPDATE TRIP
    ipcMain.handle(EIpcChannels.updateTrip, async (_event, trip: ITrip) => {
      await this.tripsManager.updateTrip(trip);
    });

    //DELETE TRIP
    ipcMain.handle(EIpcChannels.deleteTrip, async (_event, tripId: number) => {
      await this.tripsManager.deleteTrip(tripId);
    });
  };
}
