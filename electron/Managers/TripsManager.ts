import { Database } from "better-sqlite3";
import {
  PlanningsTable,
  TablesName,
  TripsTable,
} from "../../src/Models/DataBaseModel";
import ITrip from "../../src/Models/ITrip";
import fs = require("fs");
import path = require("path");

export const IMAGE_FOLDER_PATH = path.join(__dirname, "../../../src/image");

export default class TripsManager {
  db: Database;
  constructor(db: Database) {
    this.db = db;
  }

  getAllTrips = async () => {
    const stmt = this.db.prepare("SELECT * from " + TablesName.trips);
    return stmt.all() as ITrip[];
  };

  insertTrip = async (trip: Partial<ITrip>) => {
    if (trip.image_path) {
      const extension = trip.image_path.split(".")[1];
      const fileName = new Date().getTime() + "." + extension;
      const newPath = path.join(IMAGE_FOLDER_PATH, fileName);
      try {
        fs.copyFile(trip.image_path, newPath, (err) => {
          if (err) console.log("Copy Error", err);
        });
        trip.image_path = fileName;
      } catch (error) {
        trip.image_path = null;
      }
    }
    delete trip.id; //trip is partial to allow id deletion
    const columns = "(" + Object.keys(trip).join(",") + ")";
    const placeholders = "(@" + Object.keys(trip).join(",@") + ")";
    let sql =
      "INSERT INTO " + TablesName.trips + columns + " VALUES " + placeholders;
    let stmt = this.db.prepare(sql);

    const id_trip = stmt.run(trip).lastInsertRowid;

    //#region Create a first empty planning
    const cols = [PlanningsTable.id_trip, PlanningsTable.name];
    sql = `INSERT INTO ${TablesName.plannings} (${cols
      .map((col) => col)
      .join(",")}) VALUES (${cols.map((col) => "@" + col).join(",")})`;
    stmt = this.db.prepare(sql);
    stmt.run({ [cols[0]]: id_trip, [cols[1]]: "Planning 1" });
    //#endregion
  };

  updateTrip = async (trip: ITrip) => {
    if (trip.image_path) {
      const extension = trip.image_path.split(".")[1];
      const fileName = new Date().getTime() + "." + extension;
      const newPath = path.join(IMAGE_FOLDER_PATH, fileName);

      fs.copyFile(trip.image_path, newPath, (err) => {
        //err not undefined is possible if user update trip but not the image
        //=> path is only file name so source of copy is wrong.
        //No problem here, this mecanism is wanted and perfectly handled.
        if (!err) {
          trip.image_path = fileName;
        }
      });
    }
    const columns = Object.keys(trip)
      .map((key) => `${key} = ? `)
      .join(",");

    const sql = `UPDATE ${TablesName.trips} SET ${columns} WHERE ${TripsTable.id} = ${trip.id}`;

    const stmt = this.db.prepare(sql);
    stmt.run(Object.values(trip));
  };

  deleteTrip = async (tripId: number) => {
    const sql = `DELETE FROM ${TablesName.trips} WHERE ${TripsTable.id} = ${tripId}`;
    const stmt = this.db.prepare(sql);
    stmt.run();
  };
}
