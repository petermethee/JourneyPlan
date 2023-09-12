import { Database } from "better-sqlite3";
import {
  AccomodationsTable,
  ActivitiesTable,
  AttachmentsTable,
  PlanningsTable,
  TablesName,
  TransportsTable,
  TripsTable,
} from "../../src/Models/DataBaseModel";
import ITrip from "../../src/Models/ITrip";
import fs = require("fs");
import path = require("path");
import { publicFolder } from "../main";

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
      const newPath = this.getTripPicturePath(fileName);

      try {
        fs.copyFileSync(trip.image_path, newPath);
        trip.image_path = fileName;
      } catch (error) {
        console.log("Copy Error", error);
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
      const newPath = this.getTripPicturePath(fileName);

      try {
        fs.copyFileSync(trip.image_path, newPath);
        trip.image_path = fileName;
        const sql = `SELECT ${TripsTable.imagePath} from ${TablesName.trips} WHERE ${TripsTable.id} = ${trip.id}`;
        const imagePath = this.db.prepare(sql).all()[0] as {
          image_path: string;
        };
        console.log("deleteing image at", imagePath);
        fs.unlinkSync(this.getTripPicturePath(imagePath.image_path));
      } catch (error) {
        // console.log("warning", error);
        //mecanism wanted
      }
    }
    const columns = Object.keys(trip)
      .map((key) => `${key} = ? `)
      .join(",");

    const sql = `UPDATE ${TablesName.trips} SET ${columns} WHERE ${TripsTable.id} = ${trip.id}`;

    const stmt = this.db.prepare(sql);
    stmt.run(Object.values(trip));
  };

  deleteTrip = async (tripId: number) => {
    let attachmentQuery = `SELECT att.${AttachmentsTable.path} FROM ${TablesName.activities} act JOIN ${TablesName.attachments} att ON act.${ActivitiesTable.id} = att.${AttachmentsTable.id_activity} WHERE act.${ActivitiesTable.id_trip} = ${tripId}`;
    const activitesPathes = this.db.prepare(attachmentQuery).all() as {
      path: string;
    }[];
    attachmentQuery = `SELECT att.${AttachmentsTable.path} FROM ${TablesName.transports} act JOIN ${TablesName.attachments} att ON act.${TransportsTable.id} = att.${AttachmentsTable.id_transport} WHERE act.${TransportsTable.id_trip} = ${tripId}`;
    const transportsPathes = this.db.prepare(attachmentQuery).all() as {
      path: string;
    }[];
    attachmentQuery = `SELECT att.${AttachmentsTable.path} FROM ${TablesName.accomodations} act JOIN ${TablesName.attachments} att ON act.${AccomodationsTable.id} = att.${AttachmentsTable.id_accomodation} WHERE act.${AccomodationsTable.id_trip} = ${tripId}`;
    const accomodationsPathes = this.db.prepare(attachmentQuery).all() as {
      path: string;
    }[];

    const pathes = [
      ...activitesPathes,
      ...transportsPathes,
      ...accomodationsPathes,
    ];

    const imagePathQuery = `SELECT ${TripsTable.imagePath} from ${TablesName.trips} WHERE ${TripsTable.id} = ${tripId}`;
    const imagePath = this.db.prepare(imagePathQuery).all() as {
      image_path: string;
    }[];

    try {
      for (const pathObj of pathes) {
        fs.unlinkSync(pathObj.path);
      }
      for (const pathObj of imagePath) {
        fs.unlinkSync(this.getTripPicturePath(pathObj.image_path));
      }
    } catch (error) {
      console.log(
        "Error while deleting attachments related to trip: " + tripId,
        error
      );
    }

    const sql = `DELETE FROM ${TablesName.trips} WHERE ${TripsTable.id} = ${tripId}`;
    const stmt = this.db.prepare(sql);
    stmt.run();
  };

  private getTripPicturePath = (name: string) => {
    return path.join(publicFolder, process.env.REACT_APP_TRIP_PICTURE!, name);
  };
}
