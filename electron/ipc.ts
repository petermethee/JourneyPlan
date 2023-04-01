import { ipcMain } from "electron";
import { Database } from "sqlite3";
import ITrip from "../src/Models/ITrip";
import { TablesName, TripsTable } from "../src/Models/DataBaseModel";

export enum EIpcChanels {
  getAllTrips = "getAllTrips",
  insertTrip = "insertTrip",
}

export const initIPCHandlers = (db: Database) => {
  //SELECT TRIP
  ipcMain.handle(EIpcChanels.getAllTrips, async () => {
    const trips = await new Promise<ITrip[]>((resolve, reject) => {
      db.all("SELECT * from " + TablesName.trips, (err, rows) => {
        if (err) {
          reject(err);
        }
        resolve(rows as ITrip[]);
      });
    });

    return trips;
  });

  //INSERT TRIP
  ipcMain.handle(EIpcChanels.insertTrip, async (_event, trip: ITrip) => {
    const columns = "(" + Object.keys(trip).join(",") + ")";
    const values = Object.values(trip);
    const placeholders = Object.keys(trip)
      .map((_key) => "(?)")
      .join(",");
    const sql =
      "INSERT INTO " + TablesName.trips + columns + " VALUES " + placeholders;

    console.log(sql);

    await new Promise<void>((resolve, reject) => {
      db.run(sql, values, (err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  });
};
