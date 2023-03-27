import { ipcMain } from "electron";
import db, { Trips } from "./DatabaseAPI";

export enum EIpcChanels {
  getAllTrips = "getAllTrips",
}

export const initIPCHandlers = () => {
  ipcMain.handle(EIpcChanels.getAllTrips, () => {
    db.all("SELECT * from " + Trips.title, [], (err, rows) => {
      if (err) {
        console.warn(err);
        throw err;
      }
      rows.forEach((row) => {
        console.log("icicicicci", row);
      });
    });
  });
};
