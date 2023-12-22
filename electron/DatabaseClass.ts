import betterSqlite = require("better-sqlite3");
export default class DatabaseAPI {
  db: betterSqlite.Database;

  constructor() {
    this.db = new betterSqlite("./journey_plan.db");
  }

  getDataBase() {
    return this.db;
  }
}
