import betterSqlite = require("better-sqlite3");
export default class DatabaseAPI {
  db: betterSqlite.Database;

  constructor() {
    this.db = new betterSqlite("./journey_plan.db", { verbose: console.log });
    this.db.pragma("busy_timeout = 3000");
  }

  getDataBase() {
    return this.db;
  }
}
