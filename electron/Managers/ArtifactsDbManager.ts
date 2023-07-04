import { Database } from "better-sqlite3";
import IActivity from "../../src/Models/IActivity";
import ITransport from "../../src/Models/ITransport";
import IAccomodation from "../../src/Models/IAccomodation";
import fs = require("fs");

import {
  AttachmentsTable,
  TablesName,
  TripsTable,
} from "../../src/Models/DataBaseModel";
import {
  EArtifact,
  EArtifactTableName,
  getArtifactTableEnum,
} from "../../src/Models/EArtifacts";
import path = require("path");
import { IMAGE_FOLDER_PATH } from "./TripsManager";

export default class ArtifactsDbManager {
  db: Database;
  constructor(db: Database) {
    this.db = db;
  }
  getAllFromTable = (tableName: EArtifactTableName, tripId: number) => {
    const sql = `SELECT * FROM ${tableName} WHERE ${
      getArtifactTableEnum(tableName).id_trip
    } = ${tripId}`;
    const stmt = this.db.prepare(sql);
    const res = stmt.all() as IActivity[] | ITransport[] | IAccomodation[];
    const artifactColumn = getAttachmentCorrectColumn(tableName);
    res.forEach((artifact) => {
      const sql = `SELECT ${AttachmentsTable.name},${AttachmentsTable.path} FROM ${TablesName.attachments} WHERE ${artifactColumn} = ${artifact.id}`;
      const stmt = this.db.prepare(sql);
      const attachments = stmt.all() as { path: string; name: string }[];
      artifact.attachment = attachments;
    });

    return res;
  };

  insertInTable = (
    tableName: EArtifactTableName,
    item: Partial<IActivity> | Partial<ITransport> | Partial<IAccomodation>
  ) => {
    delete item.id; //item is partial to allow id deletion
    const attachments = item.attachment;
    delete item.attachment;

    item.used = (item.used ? 1 : 0) as any; //sqlite doesn't handle boolean
    const columns = "(" + Object.keys(item).join(",") + ")";
    const placeholders = "(@" + Object.keys(item).join(",@") + ")";

    const sql = `INSERT INTO ${tableName} ${columns} VALUES ${placeholders}`;
    const stmt = this.db.prepare(sql);
    const id = stmt.run(item).lastInsertRowid;
    if (attachments) {
      this.manageAttachment(id, tableName, attachments);
    }
    return id;
  };

  manageAttachment = (
    artifactId: number | bigint,
    artifactType: EArtifactTableName,
    attachments: {
      path: string;
      name: string;
    }[]
  ) => {
    const artifactColumn = getAttachmentCorrectColumn(artifactType);

    const query = `INSERT INTO ${TablesName.attachments} (${AttachmentsTable.name},${AttachmentsTable.path},${artifactColumn}) VALUES(@${AttachmentsTable.name},@${AttachmentsTable.path},@${artifactColumn})`;
    const insert = this.db.prepare(query);

    const insertMany = this.db.transaction(
      (
        pjs: {
          path: string;
          name: string;
        }[]
      ) => {
        for (const pj of pjs) {
          const extension = pj.path.split(".")[1];
          const fileName = new Date().getTime() + "." + extension;
          const newPath = path.join(IMAGE_FOLDER_PATH, fileName);
          try {
            fs.copyFile(pj.path, newPath, (err) => {
              if (err) console.log("Copy of attachment error: ", err);
            });
          } catch (error) {
            console.log("catch an error when copying attachment file: ", error);
          }
          console.log("data", { ...pj, [artifactColumn]: artifactId });

          insert.run({ ...pj, [artifactColumn]: artifactId });
        }
      }
    );
    insertMany(attachments);
  };

  updateTable = (
    tableName: EArtifactTableName,
    item: IActivity | IAccomodation | ITransport
  ) => {
    const columns = Object.keys(item)
      .map((key) => `${key} = ? `)
      .join(",");

    const sql = `UPDATE ${tableName} SET ${columns} WHERE id = ${item.id}`;

    const stmt = this.db.prepare(sql);
    stmt.run(item);
  };

  deleteFromTable = (tableName: EArtifactTableName, itemId: number) => {
    const sql = `DELETE FROM ${tableName} WHERE id = ${itemId}`;
    const stmt = this.db.prepare(sql);
    stmt.run();
  };
}

const getAttachmentCorrectColumn = (artifactType: EArtifactTableName) => {
  return artifactType === EArtifactTableName.Activity
    ? AttachmentsTable.id_activity
    : artifactType === EArtifactTableName.Transport
    ? AttachmentsTable.id_transport
    : AttachmentsTable.id_accomodation;
};
