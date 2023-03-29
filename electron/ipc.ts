import { ipcMain } from "electron";
import { TripsTable } from "./DatabaseAPI";
import { Database } from "sqlite3";

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
