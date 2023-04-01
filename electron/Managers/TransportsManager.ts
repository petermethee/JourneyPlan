import { Database } from "sqlite3";

export default class TransportsManager {
  db: Database;
  constructor(db: Database) {
    this.db = db;
  }
}
