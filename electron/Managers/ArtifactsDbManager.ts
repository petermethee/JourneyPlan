import { Database } from "better-sqlite3";
import IActivity from "../../src/Models/IActivity";
import ITransport from "../../src/Models/ITransport";
import IAccomodation from "../../src/Models/IAccomodation";
import fs = require("fs");

import { AttachmentsTable, TablesName } from "../../src/Models/DataBaseModel";
import {
  EArtifactTableName,
  getArtifactTableEnum,
} from "../../src/Models/EArtifacts";
import path = require("path");
import { IMAGE_FOLDER_PATH } from "./TripsManager";
import IAttachment from "../../src/Models/IAttachment";

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
      const attachments = stmt.all() as IAttachment[];
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
    let newAttachments: IAttachment[] = [];
    if (attachments) {
      newAttachments = this.manageAttachmentInsertion(
        id,
        tableName,
        attachments
      );
    }
    return { id, newAttachments };
  };

  updateTable = (
    tableName: EArtifactTableName,
    item: Partial<IActivity> | Partial<ITransport> | Partial<IAccomodation>
  ) => {
    const attachments = item.attachment;
    delete item.attachment;
    const columns = Object.keys(item)
      .map((key) => `${key} = ? `)
      .join(",");

    const sql = `UPDATE ${tableName} SET ${columns} WHERE id = ${item.id}`;
    const stmt = this.db.prepare(sql);
    stmt.run(...Object.values(item));
    let newAttachments: IAttachment[] = [];

    if (attachments) {
      newAttachments = this.manageAttachmentUpdate(
        item.id!,
        tableName,
        attachments
      );
    }
    return newAttachments;
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
    attachments: IAttachment[]
  ) => {
    const newAttachments: IAttachment[] = [];
    const artifactColumn = getAttachmentCorrectColumn(artifactType);

    const query = `INSERT INTO ${TablesName.attachments} (${AttachmentsTable.name},${AttachmentsTable.path},${artifactColumn}) VALUES(@${AttachmentsTable.name},@${AttachmentsTable.path},@${artifactColumn})`;
    const insert = this.db.prepare(query);

    const insertMany = this.db.transaction((pjs: IAttachment[]) => {
      for (const pj of pjs) {
        const splitted = pj.path.split(".");
        const extension = splitted[splitted.length - 1];
        const fileName = new Date().getTime() + "." + extension;
        const newPath = path.join(IMAGE_FOLDER_PATH, fileName);

        fs.copyFile(pj.path, newPath, (err) => {
          if (err) console.log("Copy of attachment error: ", err);
        });

        insert.run({ ...pj, [artifactColumn]: artifactId, path: newPath });
        newAttachments.push({ name: pj.name, path: newPath });
      }
    });
    insertMany(attachments);
    return newAttachments;
  };

  manageAttachmentUpdate = (
    artifactId: number | bigint,
    artifactType: EArtifactTableName,
    attachments: IAttachment[]
  ) => {
    const newAttachments: IAttachment[] = [];
    const artifactColumn = getAttachmentCorrectColumn(artifactType);
    const query = `SELECT ${AttachmentsTable.path}, ${AttachmentsTable.id}, ${AttachmentsTable.name} FROM ${TablesName.attachments} WHERE ${artifactColumn} = ${artifactId}`;
    const stmt = this.db.prepare(query);
    const oldAttachments = stmt.all() as {
      path: string;
      id: number;
      name: string;
    }[];
    for (const oldPJ of oldAttachments) {
      const newAttachIndex = attachments.findIndex(
        (attachment) => attachment.path === oldPJ.path
      );
      if (newAttachIndex === -1) {
        fs.unlinkSync(oldPJ.path);
        const sql = `DELETE FROM ${TablesName.attachments} WHERE id = ${oldPJ.id}`;
        const stmt = this.db.prepare(sql);
        stmt.run();
      } else {
        attachments.splice(newAttachIndex, 1);
        newAttachments.push(oldPJ);
      }
    }
    return [
      ...newAttachments,
      ...this.manageAttachmentInsertion(artifactId, artifactType, attachments),
    ];
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
      fs.unlinkSync(pathObj.path);
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
