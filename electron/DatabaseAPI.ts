import sqlite3 = require("sqlite3");

sqlite3.verbose();
const db = new sqlite3.Database(
  "./journey_plan.db",
  sqlite3.OPEN_READWRITE,
  (err: any) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Connected to the in-memory SQlite database.");
  }
);

export enum Trips {
  title = "trips",
  name = "name",
  id = "id",
  location = "location",
  startDate = "start_date",
  endDate = "end_date",
  nbTravelers = "nb_travelers",
  imagePath = "image_path",
}

export default db;
