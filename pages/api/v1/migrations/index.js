import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database";

export default async function migrations(request, response) {
  if (!["POST", "GET"].includes(request.method)) {
    return response.status(405).end();
  }

  let dbClient;
  try {
    dbClient = await database.getNewClient();

    const migrations = await migrationRunner({
      dbClient: dbClient,
      dryRun: request.method === "GET",
      dir: join("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    });

    if (request.method !== "POST") {
      return response.status(200).json(migrations);
    }

    return migrations.length > 0
      ? response.status(201).json(migrations)
      : response.status(200).json(migrations);
  } catch (error) {
    return response.status(500).json({ error: error.message });
  } finally {
    await dbClient.end();
  }
}
