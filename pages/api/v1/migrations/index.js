import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import { runMigrations } from "models/migrator.js";

const router = createRouter();
router.get(getHandler).post(postHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const migrations = await runMigrations(true);
  return response.status(200).json(migrations);
}

async function postHandler(request, response) {
  const migrations = await runMigrations(false);
  return migrations.length > 0
    ? response.status(201).json(migrations)
    : response.status(200).json(migrations);
}
