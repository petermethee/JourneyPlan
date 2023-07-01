import { Database } from "sqlite3";
import IActivity from "../../src/Models/IActivity";
import ITransport from "../../src/Models/ITransport";
import IAccomodation from "../../src/Models/IAccomodation";

import {
  AttachmentsTable,
  TablesName,
  TripsTable,
} from "../../src/Models/DataBaseModel";
import { EArtifactTableName } from "../../src/Models/EArtifacts";

export default class ArtifactsDbManager {
  db: Database;
  constructor(db: Database) {
    this.db = db;
  }
  getAllFromTable = async (tableName: EArtifactTableName, tripId: number) => {
    const sql = `SELECT * FROM ${tableName} WHERE ${TripsTable.id} = ${tripId}`;
    const artifacts = await new Promise<
      IActivity[] | ITransport[] | IAccomodation[]
    >((resolve, reject) => {
      this.db.all(sql, (err, rows) => {
        if (err) {
          reject(err);
        }
        resolve(rows as IActivity[] | ITransport[] | IAccomodation[]);
      });
    });
    return artifacts;
  };

  insertInTable = async (
    tableName: EArtifactTableName,
    item: Partial<IActivity> | Partial<ITransport> | Partial<IAccomodation>
  ) => {
    delete item.id; //tem is partial to allow id deletion
    const attachments = item.attachment;
    delete item.attachment;
    const columns = "(" + Object.keys(item).join(",") + ")";
    const values = Object.values(item);
    const placeholders =
      "(" +
      Object.keys(item)
        .map((_key) => "?")
        .join(",") +
      ")";

    const attachmentsId: number[] = [];

    //insert attachment
    if (attachments) {
      await this.manageAttachment(attachments);
    }

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
    tableName: EArtifactTableName,
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

  deleteFromTable = async (tableName: EArtifactTableName, itemId: number) => {
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

  manageAttachment = async (
    attachments: {
      path: string;
      name: string;
    }[]
  ) => {
    const attachmentQueries = attachments.map(
      (_PJ) =>
        `INSERT INTO ${TablesName.attachments} (${AttachmentsTable.name},${AttachmentsTable.path}) VALUES(?,?)`
    );

    for (let index = 0; index < attachmentQueries.length; index++) {
      const query = attachmentQueries[index];
      const pj = attachments[index];
      await new Promise<void>((resolve, reject) => {
        this.db.run(query, [pj.name, pj.path], (err) => {
          if (err) {
            reject(err);
          }
          resolve();
        });
      });
    }
  };
}
