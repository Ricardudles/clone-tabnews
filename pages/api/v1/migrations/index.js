import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database";
import { createRouter } from "next-connect";
import controller from "infra/controller.js";

const router = createRouter();
router.get(getHandler).post(postHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const migrations = await runMigrations(request.method);
  return response.status(200).json(migrations);
}

async function postHandler(request, response) {
  const migrations = await runMigrations(request.method);

  return migrations.length > 0
    ? response.status(201).json(migrations)
    : response.status(200).json(migrations);
}

async function runMigrations(requestMethod) {
  let dbClient;
  try {
    dbClient = await database.getNewClient();

    const migrations = await migrationRunner({
      dbClient: dbClient,
      dryRun: requestMethod === "GET",
      dir: resolve("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    });
    return migrations;
  } finally {
    await dbClient.end();
  }
}
