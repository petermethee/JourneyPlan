import { Database } from "sqlite3";

export default class AccommodationManager {
  db: Database;
  constructor(db: Database) {
    this.db = db;
  }
}
