import { Database } from "sqlite3";
import IActivity from "../../src/Models/IActivity";
import {
  TablesName,
  ActivitiesTable,
  TripsTable,
} from "../../src/Models/DataBaseModel";

export default class ActivitesManager {
  db: Database;
  constructor(db: Database) {
    this.db = db;
  }
  getAllActivities = async (tripId: number) => {
    const sql = `SELECT * FROM ${TablesName.activities} WHERE ${TripsTable.id} = ${tripId}`;
    const activities = await new Promise<IActivity[]>((resolve, reject) => {
      this.db.all(sql, (err, rows) => {
        if (err) {
          reject(err);
        }
        resolve(rows as IActivity[]);
      });
    });
    return activities;
  };

  insertActivity = async (activity: Partial<IActivity>) => {
    delete activity.id; //activity is partial to allow id deletion
    const columns = "(" + Object.keys(activity).join(",") + ")";
    const values = Object.values(activity);
    const placeholders =
      "(" +
      Object.keys(activity)
        .map((_key) => "?")
        .join(",") +
      ")";
    const sql =
      "INSERT INTO " +
      TablesName.activities +
      columns +
      " VALUES " +
      placeholders;

    await new Promise<void>((resolve, reject) => {
      this.db.run(sql, values, (err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  };

  updateActivity = async (activity: IActivity) => {
    const columns = Object.keys(activity)
      .map((key) => `${key} = ? `)
      .join(",");
    const values = Object.values(activity);

    const sql = `UPDATE ${TablesName.activities} SET ${columns} WHERE ${ActivitiesTable.id} = ${activity.id}`;

    await new Promise<void>((resolve, reject) => {
      this.db.run(sql, values, (err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  };

  deleteActivity = async (activityId: number) => {
    const sql = `DELETE FROM ${TablesName.activities} WHERE ${ActivitiesTable.id} = ${activityId}`;
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
