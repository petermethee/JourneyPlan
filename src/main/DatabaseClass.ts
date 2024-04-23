import betterSqlite, { Database } from "better-sqlite3";
import { dbPath } from "./helpers";

export default class DatabaseAPI {
  db: Database;

  constructor() {
    this.db = new betterSqlite(dbPath);
    this.db.pragma("busy_timeout = 3000");
  }

  getDataBase() {
    return this.db as Database;
  }
}
