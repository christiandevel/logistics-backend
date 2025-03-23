import pool from "../config/database";
import { PostgresDatabaseInitializer } from "./postgresInitializer";

export type DatabaseType = "postgres" | "sqlite" | "mysql" | "mariadb";

export class DatabaseInitializerFactory {
  static create(databaseType: DatabaseType) {
    switch (databaseType) {
      case "postgres":
        return new PostgresDatabaseInitializer();
      case "sqlite":
        // Future Implementation
        throw new Error("SQLite is not supported yet");
      case "mysql":
        // Future Implementation
        throw new Error("MySQL is not supported yet");
      case "mariadb":
        // Future Implementation
        throw new Error("MariaDB is not supported yet");
      default:
        throw new Error(`Database type ${databaseType} not supported`);
    }
  }
}
