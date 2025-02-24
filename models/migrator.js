import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database";
import { ServiceError } from "infra/errors/errors";

export async function runMigrations(dryRun, disableLogging = false) {
  let client;
  try {
    client = await database.getNewClient();

    const defaultOptions = {
      dbClient: client,
      dryRun: dryRun,
      dir: resolve("infra", "migrations"),
      direction: "up",
      verbose: !disableLogging,
      migrationsTable: "pgmigrations",
    };

    if (disableLogging) {
      defaultOptions.log = () => {};
    }

    const migrations = await migrationRunner(defaultOptions);
    return migrations;
  } catch (error) {
    const serviceErrorObject = new ServiceError({
      message: "Erro na conexão com o banco de dados ou na Migração",
      cause: error,
    });
    throw serviceErrorObject;
  } finally {
    await client?.end();
  }
}
