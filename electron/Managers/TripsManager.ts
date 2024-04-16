import { Database } from "better-sqlite3";
import {
  AccommodationsTable,
  ActivitiesTable,
  AttachmentsTable,
  PlanningArtifactTable,
  PlanningsTable,
  TablesName,
  TransportsTable,
  TripsTable,
} from "../../src/Models/DataBaseModel";
import ITrip from "../../src/Models/ITrip";
import fs = require("fs");
import path = require("path");
import { tripImagesPath } from "../helpers";
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
      const newPath = path.join(tripImagesPath, fileName);

      try {
        fs.copyFileSync(trip.image_path, newPath);
        trip.image_path = newPath;
      } catch (error) {
        console.warn("Copy Error", error);
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
      const newPath = path.join(tripImagesPath, fileName);

      try {
        fs.copyFileSync(trip.image_path, newPath);
        trip.image_path = newPath;
        const sql = `SELECT ${TripsTable.imagePath} from ${TablesName.trips} WHERE ${TripsTable.id} = ${trip.id}`;
        const imagePath = this.db.prepare(sql).all()[0] as {
          image_path: string;
        };
        fs.unlinkSync(imagePath.image_path);
      } catch (error) {
        // console.warn("warning", error);
        //mecanism wanted
      }
    }
    const columns = Object.keys(trip)
      .map((key) => `${key} = ? `)
      .join(",");

    let updatePlanningArtifact = `UPDATE ${TablesName.planning_artifact} 
    SET ${PlanningArtifactTable.date} = '${trip.start_date}'
    WHERE ${PlanningArtifactTable.id_planning} IN 
    (SELECT ${PlanningsTable.id} 
      FROM ${TablesName.plannings} 
      WHERE ${PlanningsTable.id_trip} = ${trip.id}) 
    AND ${PlanningArtifactTable.date} < '${trip.start_date}'`;
    this.db.prepare(updatePlanningArtifact).run();

    updatePlanningArtifact = `UPDATE ${TablesName.planning_artifact} 
    SET ${PlanningArtifactTable.date} = '${trip.end_date}'
    WHERE ${PlanningArtifactTable.id_planning} IN 
    (SELECT ${PlanningsTable.id} 
      FROM ${TablesName.plannings} 
      WHERE ${PlanningsTable.id_trip} = ${trip.id}) 
    AND ${PlanningArtifactTable.date} > '${trip.end_date}'`;
    this.db.prepare(updatePlanningArtifact).run();

    const sql = `UPDATE ${TablesName.trips} SET ${columns} WHERE ${TripsTable.id} = ${trip.id}`;

    const stmt = this.db.prepare(sql);
    stmt.run(Object.values(trip));
  };

  deleteTrip = async (tripId: number) => {
    let attachmentQuery = `SELECT att.${AttachmentsTable.path} FROM ${TablesName.activities} act JOIN ${TablesName.attachments} att ON act.${ActivitiesTable.id} = att.${AttachmentsTable.id_activity} WHERE act.${ActivitiesTable.id_trip} = ${tripId}`;
    const activitesPaths = this.db.prepare(attachmentQuery).all() as {
      path: string;
    }[];
    attachmentQuery = `SELECT att.${AttachmentsTable.path} FROM ${TablesName.transports} act JOIN ${TablesName.attachments} att ON act.${TransportsTable.id} = att.${AttachmentsTable.id_transport} WHERE act.${TransportsTable.id_trip} = ${tripId}`;
    const transportsPaths = this.db.prepare(attachmentQuery).all() as {
      path: string;
    }[];
    attachmentQuery = `SELECT att.${AttachmentsTable.path} FROM ${TablesName.accommodations} act JOIN ${TablesName.attachments} att ON act.${AccommodationsTable.id} = att.${AttachmentsTable.id_accommodation} WHERE act.${AccommodationsTable.id_trip} = ${tripId}`;
    const accommodationsPaths = this.db.prepare(attachmentQuery).all() as {
      path: string;
    }[];

    const paths = [
      ...activitesPaths,
      ...transportsPaths,
      ...accommodationsPaths,
    ];

    const imagePathQuery = `SELECT ${TripsTable.imagePath} from ${TablesName.trips} WHERE ${TripsTable.id} = ${tripId}`;
    const imagePath = this.db.prepare(imagePathQuery).all() as {
      image_path: string;
    }[];

    for (const pathObj of paths) {
      if (pathObj.path) {
        try {
          fs.unlinkSync(pathObj.path);
        } catch (error) {
          console.warn(
            "Error while deleting attachments related to trip: " +
              tripId +
              " with file: " +
              pathObj.path,
            error
          );
        }
      }
    }
    for (const pathObj of imagePath) {
      if (pathObj.image_path) {
        try {
          fs.unlinkSync(pathObj.image_path);
        } catch (error) {
          console.warn(
            "Error while deleting attachments related to trip: " +
              tripId +
              " with file: " +
              pathObj.image_path,
            error
          );
        }
      }
    }

    const sql = `DELETE FROM ${TablesName.trips} WHERE ${TripsTable.id} = ${tripId}`;
    const stmt = this.db.prepare(sql);
    stmt.run();
  };
}
