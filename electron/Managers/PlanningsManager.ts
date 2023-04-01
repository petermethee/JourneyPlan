import { Database } from "sqlite3";

export default class PlanningsManager {
  db: Database;
  constructor(db: Database) {
    this.db = db;
  }
}
