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
import IPlanningArtifact, {
  IDBPlanningArtifact,
  IPlanning,
} from "../../src/Models/IPlanningArtifact";
import path = require("path");
import { EArtifact } from "../../src/Models/EArtifacts";
import { dialog } from "electron";
import * as fs from "fs";

export const IMAGE_FOLDER_PATH = path.join(__dirname, "../../../src/image");

export default class PlanningsManager {
  db: Database;
  constructor(db: Database) {
    this.db = db;
  }

  getAllPlannings = async (tripId: number) => {
    const sql = `SELECT * FROM ${TablesName.plannings} WHERE ${PlanningsTable.id_trip} = ${tripId}`;
    const stmt = this.db.prepare(sql);
    return stmt.all() as IPlanning[];
  };

  insertPlanning = async (planning: Partial<IPlanning>) => {
    delete planning.id; //planning is partial to allow id deletion
    const columns = "(" + Object.keys(planning).join(",") + ")";
    const placeholders = "(@" + Object.keys(planning).join(",@") + ")";
    let sql =
      "INSERT INTO " +
      TablesName.plannings +
      columns +
      " VALUES " +
      placeholders;
    let stmt = this.db.prepare(sql);

    const id_planning = stmt.run(planning).lastInsertRowid;
    return id_planning;
  };

  updatePlanning = async (planning: IPlanning) => {
    const columns = Object.keys(planning)
      .map((key) => `${key} = ? `)
      .join(",");

    const sql = `UPDATE ${TablesName.plannings} SET ${columns} WHERE ${PlanningsTable.id} = ${planning.id}`;

    const stmt = this.db.prepare(sql);
    stmt.run(Object.values(planning));
  };

  deletePlanning = async (planningId: number) => {
    const sql = `DELETE FROM ${TablesName.plannings} WHERE ${PlanningsTable.id} = ${planningId}`;
    const stmt = this.db.prepare(sql);
    stmt.run();
  };

  //#region //Planning Atifact
  getAllArtifactsPlanning = async (planningId: number) => {
    const sql = `SELECT * FROM ${TablesName.planning_artifact} WHERE ${PlanningArtifactTable.id_planning} = ${planningId}`;
    const stmt = this.db.prepare(sql);
    stmt.run();
    const result = stmt.all() as IDBPlanningArtifact[];
    return result.map((dbPA) => dbPAToPA(dbPA));
  };

  insertArtifactPlanning = async (planningArtifact: IPlanningArtifact) => {
    const dbPlanningArtifact: Partial<IDBPlanningArtifact> = {
      [PlanningArtifactTable.date]: planningArtifact.date,
      [PlanningArtifactTable.timeIndex]: planningArtifact.timeIndex,
      [getPlanningArtifactCorrectColumn(planningArtifact.artifactType)]:
        planningArtifact.artifactId,
      [PlanningArtifactTable.id_planning]: planningArtifact.id_planning,
    };
    const columns = "(" + Object.keys(dbPlanningArtifact).join(",") + ")";
    const placeholders =
      "(@" + Object.keys(dbPlanningArtifact).join(",@") + ")";
    let sql =
      "INSERT INTO " +
      TablesName.planning_artifact +
      columns +
      " VALUES " +
      placeholders;
    let stmt = this.db.prepare(sql);
    const idPlanningArtifact = stmt.run(dbPlanningArtifact).lastInsertRowid;
    return idPlanningArtifact;
  };

  updateArtifactPlanning = async (planningArtifact: IPlanningArtifact) => {
    const dbPlanningArtifact: Partial<IDBPlanningArtifact> = {
      [PlanningArtifactTable.id]: planningArtifact.id,
      [PlanningArtifactTable.date]: planningArtifact.date,
      [PlanningArtifactTable.timeIndex]: planningArtifact.timeIndex,
      [getPlanningArtifactCorrectColumn(planningArtifact.artifactType)]:
        planningArtifact.artifactId,
      [PlanningArtifactTable.id_planning]: planningArtifact.id_planning,
    };
    const columns = Object.keys(dbPlanningArtifact)
      .map((key) => `${key} = ? `)
      .join(",");

    const sql = `UPDATE ${TablesName.planning_artifact} SET ${columns} WHERE ${PlanningArtifactTable.id} = ${dbPlanningArtifact.id}`;

    const stmt = this.db.prepare(sql);
    stmt.run(Object.values(dbPlanningArtifact));
  };
  deleteArtifactPlanning = async (planningArtifactId: number) => {
    const sql = `DELETE FROM ${TablesName.planning_artifact} WHERE ${PlanningArtifactTable.id} = ${planningArtifactId}`;
    const stmt = this.db.prepare(sql);
    stmt.run();
  };
  exportAttachments = async (planningId: number) => {
    const planningTripQuery = `SELECT plannings.${PlanningsTable.name} as planningName, 
    trips.${TripsTable.name} as tripName
    FROM ${TablesName.plannings} plannings JOIN ${TablesName.trips} trips ON plannings.${PlanningsTable.id_trip} = trips.${TripsTable.id}
    WHERE plannings.${PlanningsTable.id}=${planningId}`;

    const stmt = this.db.prepare(planningTripQuery);
    const fileInfos = stmt.all() as {
      planningName: string;
      tripName: string;
    }[];

    if (fileInfos.length) {
      const fileInfo = fileInfos[0];
      const fileName = fileInfo.tripName + "_" + fileInfo.planningName;

      let filePath = await dialog.showSaveDialog({
        title: "Exporter les pièces jointes",
        buttonLabel: "Exporter",
        properties: ["createDirectory"],
        defaultPath: path.join(require("os").homedir(), "Downloads", fileName),
      });

      if (!filePath.canceled) {
        const activitiesAttachments = this.selectAttachmentsInTable(
          TablesName.activities,
          ActivitiesTable.name,
          ActivitiesTable.id,
          planningId
        );
        const transportsAttachments = this.selectAttachmentsInTable(
          TablesName.transports,
          TransportsTable.name,
          TransportsTable.id,
          planningId
        );
        const accommodationsAttachments = this.selectAttachmentsInTable(
          TablesName.accommodations,
          AccommodationsTable.name,
          AccommodationsTable.id,
          planningId
        );

        const activitiesFilePath = path.join(filePath.filePath!, "Activites");
        saveArtifactsAttachments(activitiesAttachments, activitiesFilePath);

        const transportsFilePath = path.join(filePath.filePath!, "Transports");
        saveArtifactsAttachments(transportsAttachments, transportsFilePath);

        const accommodationsFilePath = path.join(
          filePath.filePath!,
          "Logements"
        );
        saveArtifactsAttachments(
          accommodationsAttachments,
          accommodationsFilePath
        );
      }
    }
  };
  //#endregion

  selectAttachmentsInTable = (
    tabelName: string,
    nameCol: string,
    idCol: string,
    planningId: number
  ) => {
    const sql = `SELECT att.${AttachmentsTable.path}, 
    att.${AttachmentsTable.name} AS attachment_name, 
    act.${nameCol} AS artifact_name, 
    act.${idCol}
    FROM ${TablesName.attachments} att 
    JOIN ${TablesName.planning_artifact} pa ON att.${AttachmentsTable.id_activity} = pa.${PlanningArtifactTable.id_activity} 
    JOIN ${tabelName} act ON att.${AttachmentsTable.id_activity} = act.${idCol} 
    WHERE pa.${PlanningArtifactTable.id_planning}  = ${planningId}`;
    const stmt = this.db.prepare(sql);
    const res = stmt.all() as {
      path: string;
      attachment_name: string;
      artifact_name: string;
      id: number;
    }[];
    return res;
  };
}

const dbPAToPA = (dbPA: IDBPlanningArtifact) => {
  const artifactType = dbPA.id_activity
    ? EArtifact.Activity
    : dbPA.id_transport
    ? EArtifact.Transport
    : EArtifact.Accommodation;
  const artifactId = dbPA[getPlanningArtifactCorrectColumn(artifactType)]!;

  const result: IPlanningArtifact = {
    artifactId,
    artifactType: artifactType,
    [PlanningArtifactTable.id]: dbPA.id,
    [PlanningArtifactTable.id_planning]: dbPA.id_planning,
    [PlanningArtifactTable.date]: dbPA.date,
    [PlanningArtifactTable.timeIndex]: dbPA.timeIndex,
  };
  return result;
};

const getPlanningArtifactCorrectColumn = (artifactType: EArtifact) => {
  return artifactType === EArtifact.Activity
    ? PlanningArtifactTable.id_activity
    : artifactType === EArtifact.Transport
    ? PlanningArtifactTable.id_transport
    : PlanningArtifactTable.id_accommodation;
};

const saveArtifactsAttachments = (
  artifactsAttachments: {
    path: string;
    attachment_name: string;
    artifact_name: string;
    id: number;
  }[],
  artifactFilePath: string
) => {
  fs.mkdirSync(artifactFilePath, { recursive: true });
  artifactsAttachments.forEach((item) => {
    const artifactPath = path.join(
      artifactFilePath,
      item.id + "_" + item.artifact_name
    );
    if (!fs.existsSync(artifactPath)) {
      fs.mkdirSync(artifactPath);
    }
    fs.copyFileSync(item.path, path.join(artifactPath, item.attachment_name));
  });
};
