import { ipcMain } from "electron";
import { Database } from "sqlite3";
import { TripsTable } from "../src/Models/Trips";

export enum EIpcChanels {
  getAllTrips = "getAllTrips",
}

export const initIPCHandlers = (db: Database) => {
  ipcMain.handle(EIpcChanels.getAllTrips, async () => {
    const trips = await new Promise((resolve, reject) => {
      db.all("SELECT * from " + TripsTable.title, (err, rows) => {
        if (err) {
          reject(err);
        }
        resolve(rows);
      });
    });

    return trips;
  });
};
