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
    console.log("sql query debug is", sql);
    console.log("values", item);

    const stmt = this.db.prepare(sql);
    const id = stmt.run(item).lastInsertRowid;
    if (attachments) {
      this.manageAttachmentInsertion(id, tableName, attachments);
    }
    return id;
  };

  updateTable = (
    tableName: EArtifactTableName,
    item: Partial<IActivity> | Partial<ITransport> | Partial<IAccomodation>
  ) => {
    const attachments = item.attachment;
    console.log("attachment update");

    delete item.attachment;

    const columns = Object.keys(item)
      .map((key) => `${key} = ? `)
      .join(",");

    const sql = `UPDATE ${tableName} SET ${columns} WHERE id = ${item.id}`;

    const stmt = this.db.prepare(sql);
    stmt.run(item);
  };

  deleteFromTable = (tableName: EArtifactTableName, artifactId: number) => {
    this.manageAttachmentDeletion(artifactId, tableName);
    const sql = `DELETE FROM ${tableName} WHERE id = ${artifactId}`;
    const stmt = this.db.prepare(sql);
    stmt.run();
  };

  manageAttachmentInsertion = (
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
          const splitted = pj.path.split(".");
          const extension = splitted[splitted.length - 1];
          const fileName = new Date().getTime() + "." + extension;
          const newPath = path.join(IMAGE_FOLDER_PATH, fileName);
          try {
            fs.copyFile(pj.path, newPath, (err) => {
              if (err) console.log("Copy of attachment error: ", err);
            });
          } catch (error) {
            console.warn(
              "Caught an error when copying attachment file: ",
              error
            );
          }
          insert.run({ ...pj, [artifactColumn]: artifactId, path: newPath });
        }
      }
    );
    insertMany(attachments);
  };

  manageAttachmentUpdate = (
    artifactId: number | bigint,
    artifactType: EArtifactTableName
  ) => {
    const artifactColumn = getAttachmentCorrectColumn(artifactType);
    const query = `SELECT ${AttachmentsTable.path} FROM ${TablesName.attachments} WHERE ${artifactColumn} = ${artifactId}`;
    const stmt = this.db.prepare(query);
    const pathes = stmt.all() as { path: string }[];
    for (const pathObj of pathes) {
      try {
        fs.unlinkSync(pathObj.path);
      } catch (error) {
        console.warn("Caught an error when deleting attachment : ", error);
      }
    }
  };

  manageAttachmentDeletion = (
    artifactId: number | bigint,
    artifactType: EArtifactTableName
  ) => {
    const artifactColumn = getAttachmentCorrectColumn(artifactType);
    const query = `SELECT ${AttachmentsTable.path} FROM ${TablesName.attachments} WHERE ${artifactColumn} = ${artifactId}`;
    const stmt = this.db.prepare(query);
    const pathes = stmt.all() as { path: string }[];
    for (const pathObj of pathes) {
      try {
        fs.unlinkSync(pathObj.path);
      } catch (error) {
        console.warn("Caught an error when deleting attachment : ", error);
      }
    }
  };
}

const getAttachmentCorrectColumn = (artifactType: EArtifactTableName) => {
  return artifactType === EArtifactTableName.Activity
    ? AttachmentsTable.id_activity
    : artifactType === EArtifactTableName.Transport
    ? AttachmentsTable.id_transport
    : AttachmentsTable.id_accomodation;
};
