import sqlite3 = require("sqlite3");
export default class DatabaseAPI {
  db: sqlite3.Database;

  constructor() {
    sqlite3.verbose();
    this.db = new sqlite3.Database(
      "./journey_plan.db",
      sqlite3.OPEN_READWRITE,
      (err: any) => {
        if (err) {
          return console.error(err.message);
        }
        console.log(
          "Connected to the SQlite database: ",
          __dirname + "/journey_plan.db"
        );
      }
    );
  }

  getDataBase() {
    return this.db;
  }
}
