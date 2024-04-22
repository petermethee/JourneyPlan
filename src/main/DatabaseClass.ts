import betterSqlite, { Database } from 'better-sqlite3'

export default class DatabaseAPI {
  db: Database

  constructor(dbPath: string) {
    this.db = new betterSqlite(dbPath)
    this.db.pragma('busy_timeout = 3000')
  }

  getDataBase() {
    return this.db as Database
  }
}
