import { Database } from "better-sqlite3";
import { PlanningsTable, TablesName } from "../../src/Models/DataBaseModel";
import { IPlanning } from "../../src/Models/IPlanningArtifact";
import fs = require("fs");
import path = require("path");

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
}
