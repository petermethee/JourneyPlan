import { Database } from "sqlite3";
import IActivity from "../../src/Models/IActivity";
import ITransport from "../../src/Models/ITransport";
import IAccomodation from "../../src/Models/IAccomodation";

import {
  TablesName,
  ActivitiesTable,
  TripsTable,
} from "../../src/Models/DataBaseModel";

export default class DataBaseManager {
  db: Database;
  constructor(db: Database) {
    this.db = db;
  }
  getAllFromTable = async (tableName: string, tripId: number) => {
    const sql = `SELECT * FROM ${tableName} WHERE ${TripsTable.id} = ${tripId}`;
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

  insertInTable = async (
    tableName: string,
    item: Partial<IActivity> | Partial<ITransport> | Partial<IAccomodation>
  ) => {
    delete item.id; //tem is partial to allow id deletion
    const columns = "(" + Object.keys(item).join(",") + ")";
    const values = Object.values(item);
    const placeholders =
      "(" +
      Object.keys(item)
        .map((_key) => "?")
        .join(",") +
      ")";
    const sql = `INSERT INTO ${tableName} ${columns} VALUES ${placeholders}`;

    await new Promise<void>((resolve, reject) => {
      this.db.run(sql, values, (err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  };

  updateTable = async (
    tableName: string,
    item: IActivity | IAccomodation | ITransport
  ) => {
    const columns = Object.keys(item)
      .map((key) => `${key} = ? `)
      .join(",");
    const values = Object.values(item);

    const sql = `UPDATE ${tableName} SET ${columns} WHERE id = ${item.id}`;

    await new Promise<void>((resolve, reject) => {
      this.db.run(sql, values, (err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  };

  deleteFromTable = async (tableName: string, itemId: number) => {
    const sql = `DELETE FROM ${tableName} WHERE id = ${itemId}`;
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
