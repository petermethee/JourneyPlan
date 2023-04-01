import { Database } from "sqlite3";

export default class ActivitesManager {
  db: Database;
  constructor(db: Database) {
    this.db = db;
  }
}
