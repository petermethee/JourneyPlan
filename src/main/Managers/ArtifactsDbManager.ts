import { Database } from 'better-sqlite3'
import IActivity from '../../../src/renderer/src/Models/IActivity'
import ITransport from '../../../src/renderer/src/Models/ITransport'
import IAccommodation from '../../../src/renderer/src/Models/IAccommodation'
import {
  AttachmentsTable,
  PlanningArtifactTable,
  TablesName
} from '../../../src/renderer/src/Models/DataBaseModel'
import {
  EArtifactTableName,
  getArtifactTableEnum
} from '../../../src/renderer/src/Models/EArtifacts'
import IAttachment from '../../../src/renderer/src/Models/IAttachment'
import { copyFileSync, unlinkSync } from 'fs'
import { attachmentsPath } from '../helpers'
import { join } from 'path'

export default class ArtifactsDbManager {
  db: Database
  constructor(db: Database) {
    this.db = db
  }
  getAllFromTable = (tableName: EArtifactTableName, tripId: number) => {
    const sql = `SELECT * FROM ${tableName} WHERE ${
      getArtifactTableEnum(tableName).id_trip
    } = ${tripId}`
    const stmt = this.db.prepare(sql)
    const res = stmt.all() as IActivity[] | ITransport[] | IAccommodation[]
    const artifactColumn = this.getAttachmentCorrectColumn(tableName)
    res.forEach((artifact) => {
      const sql = `SELECT ${AttachmentsTable.name},${AttachmentsTable.path} FROM ${TablesName.attachments} WHERE ${artifactColumn} = ${artifact.id}`
      const stmt = this.db.prepare(sql)
      const attachments = stmt.all() as IAttachment[]
      artifact.attachment = attachments

      const planningArtifactColumn = this.getPlanningArtifactCorrectColumn(tableName)
      const usedSQL = `SELECT EXISTS(SELECT id FROM ${TablesName.planning_artifact} WHERE ${planningArtifactColumn} = ${artifact.id})`
      const usedStmt = this.db.prepare(usedSQL)
      const result = usedStmt.get() as { [key: string]: 0 | 1 }
      artifact.used = Object.values(result)[0] === 1
    })

    return res
  }

  insertInTable = (
    tableName: EArtifactTableName,
    item: Partial<IActivity> | Partial<ITransport> | Partial<IAccommodation>
  ) => {
    delete item.id //item is partial to allow id deletion
    delete item.used
    const attachments = item.attachment //save before deleting
    delete item.attachment
    const columns = '(' + Object.keys(item).join(',') + ')'
    const placeholders = '(@' + Object.keys(item).join(',@') + ')'
    const sql = `INSERT INTO ${tableName} ${columns} VALUES ${placeholders}`
    const stmt = this.db.prepare(sql)
    const id = stmt.run(item).lastInsertRowid
    let newAttachments: IAttachment[] = []
    if (attachments) {
      newAttachments = this.manageAttachmentInsertion(id, tableName, attachments)
    }
    return { id, newAttachments }
  }

  updateTable = (
    tableName: EArtifactTableName,
    item: Partial<IActivity> | Partial<ITransport> | Partial<IAccommodation>
  ) => {
    const attachments = item.attachment
    delete item.attachment
    delete item.used
    const columns = Object.keys(item)
      .map((key) => `${key} = ? `)
      .join(',')

    const sql = `UPDATE ${tableName} SET ${columns} WHERE id = ${item.id}`
    const stmt = this.db.prepare(sql)
    stmt.run(...Object.values(item))
    let newAttachments: IAttachment[] = []

    if (attachments) {
      newAttachments = this.manageAttachmentUpdate(item.id!, tableName, attachments)
    }
    return newAttachments
  }

  deleteFromTable = (tableName: EArtifactTableName, artifactId: number) => {
    this.manageAttachmentDeletion(artifactId, tableName)
    const sql = `DELETE FROM ${tableName} WHERE id = ${artifactId}`
    const stmt = this.db.prepare(sql)
    stmt.run()
  }

  manageAttachmentInsertion = (
    artifactId: number | bigint,
    artifactType: EArtifactTableName,
    attachments: IAttachment[]
  ) => {
    const newAttachments: IAttachment[] = []
    const artifactColumn = this.getAttachmentCorrectColumn(artifactType)

    const query = `INSERT INTO ${TablesName.attachments} (${AttachmentsTable.name},${AttachmentsTable.path},${artifactColumn}) VALUES(@${AttachmentsTable.name},@${AttachmentsTable.path},@${artifactColumn})`
    const insert = this.db.prepare(query)

    const insertMany = this.db.transaction((pjs: IAttachment[]) => {
      for (const pj of pjs) {
        const splitted = pj.path.split('.')
        const extension = splitted[splitted.length - 1]
        const fileName = new Date().getTime() + '.' + extension
        const newPath = join(attachmentsPath, fileName)

        try {
          copyFileSync(pj.path, newPath)
        } catch (error) {
          console.warn('Copy of attachment error: ', error)
        }

        insert.run({ ...pj, [artifactColumn]: artifactId, path: newPath })
        newAttachments.push({ name: pj.name, path: newPath })
      }
    })
    insertMany(attachments)
    return newAttachments
  }

  manageAttachmentUpdate = (
    artifactId: number | bigint,
    artifactType: EArtifactTableName,
    attachments: IAttachment[]
  ) => {
    const newAttachments: IAttachment[] = []
    const artifactColumn = this.getAttachmentCorrectColumn(artifactType)
    const query = `SELECT ${AttachmentsTable.path}, ${AttachmentsTable.id}, ${AttachmentsTable.name} FROM ${TablesName.attachments} WHERE ${artifactColumn} = ${artifactId}`
    const stmt = this.db.prepare(query)
    const oldAttachments = stmt.all() as {
      path: string
      id: number
      name: string
    }[]
    for (const oldPJ of oldAttachments) {
      const newAttachIndex = attachments.findIndex((attachment) => attachment.path === oldPJ.path)
      if (newAttachIndex === -1) {
        try {
          unlinkSync(oldPJ.path)
        } catch (error) {
          console.warn(
            `Error while deleting attachment related to ${artifactType} ${artifactId}: `,
            error
          )
        }
        const sql = `DELETE FROM ${TablesName.attachments} WHERE id = ${oldPJ.id}`
        const stmt = this.db.prepare(sql)
        stmt.run()
      } else {
        attachments.splice(newAttachIndex, 1)
        newAttachments.push(oldPJ)
      }
    }
    return [
      ...newAttachments,
      ...this.manageAttachmentInsertion(artifactId, artifactType, attachments)
    ]
  }

  manageAttachmentDeletion = (artifactId: number | bigint, artifactType: EArtifactTableName) => {
    const artifactColumn = this.getAttachmentCorrectColumn(artifactType)
    const query = `SELECT ${AttachmentsTable.path} FROM ${TablesName.attachments} WHERE ${artifactColumn} = ${artifactId}`
    const stmt = this.db.prepare(query)
    const paths = stmt.all() as { path: string }[]
    try {
      for (const pathObj of paths) {
        unlinkSync(pathObj.path)
      }
    } catch (error) {
      console.warn(
        `Error while deleting attachments related to ${artifactType} ${artifactId}: `,
        error
      )
    }
  }

  private getAttachmentCorrectColumn = (artifactType: EArtifactTableName) => {
    return artifactType === EArtifactTableName.Activity
      ? AttachmentsTable.id_activity
      : artifactType === EArtifactTableName.Transport
        ? AttachmentsTable.id_transport
        : AttachmentsTable.id_accommodation
  }

  private getPlanningArtifactCorrectColumn = (artifactType: EArtifactTableName) => {
    return artifactType === EArtifactTableName.Activity
      ? PlanningArtifactTable.id_activity
      : artifactType === EArtifactTableName.Transport
        ? PlanningArtifactTable.id_transport
        : PlanningArtifactTable.id_accommodation
  }
}
