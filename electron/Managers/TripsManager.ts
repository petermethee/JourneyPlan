import { Database } from "sqlite3";
import { TablesName, TripsTable } from "../../src/Models/DataBaseModel";
import ITrip from "../../src/Models/ITrip";
import fs = require("fs");
import path = require("path");

const IMAGE_FOLDER_PATH = path.join(__dirname, "../../../src/image");

export default class TripsManager {
  db: Database;
  constructor(db: Database) {
    this.db = db;
  }

  getAllTrips = async () => {
    const trips = await new Promise<ITrip[]>((resolve, reject) => {
      this.db.all("SELECT * from " + TablesName.trips, (err, rows) => {
        if (err) {
          reject(err);
        }
        resolve(rows as ITrip[]);
      });
    });
    return trips;
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
    const values = Object.values(trip);
    const placeholders =
      "(" +
      Object.keys(trip)
        .map((_key) => "?")
        .join(",") +
      ")";
    const sql =
      "INSERT INTO " + TablesName.trips + columns + " VALUES " + placeholders;

    await new Promise<void>((resolve, reject) => {
      this.db.run(sql, values, (err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  };

  updateTrip = async (trip: ITrip) => {
    if (trip.image_path) {
      const extension = trip.image_path.split(".")[1];
      const fileName = new Date().getTime() + "." + extension;
      const newPath = path.join(IMAGE_FOLDER_PATH, fileName);

      fs.copyFile(trip.image_path, newPath, (err) => {
        //err not undefined is possible if user update trip but not the image
        //=> path is only file name so source of copy is wrong.
        //No problem here, this mecanism is wanted and perfectly handled
        if (!err) {
          trip.image_path = fileName;
        }
      });
    }
    const columns = Object.keys(trip)
      .map((key) => `${key} = ? `)
      .join(",");
    const values = Object.values(trip);

    const sql = `UPDATE ${TablesName.trips} SET ${columns} WHERE ${TripsTable.id} = ${trip.id}`;

    await new Promise<void>((resolve, reject) => {
      this.db.run(sql, values, (err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  };

  deleteTrip = async (tripId: number) => {
    const sql = `DELETE FROM ${TablesName.trips} WHERE ${TripsTable.id} = ${tripId}`;
    console.log("delet", sql);

    await new Promise<void>((resolve, reject) => {
      this.db.run(sql, (err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  };
}
