import retry from "async-retry";
import database from "infra/database.js";
import { runMigrations } from "models/migrator.js";

async function waitForAllServices() {
  await waitForWebServer();

  async function waitForWebServer() {
    return retry(fetchStatusPage, {
      retires: 100,
      maxTimeout: 1000,
      minTimeout: 10,
    });

    async function fetchStatusPage() {
      const response = await fetch("http://localhost:3000/api/v1/status");
      if (response.status !== 200) {
        throw new Error("Status endpoint not ready");
      }
    }
  }
}

async function clearDatabase() {
  await database.query("DROP schema public CASCADE; create schema public;");
}

async function runMigrations() {
  await runMigrations(false, true);
}

const orchestrator = { waitForAllServices, clearDatabase, runMigrations };
export default orchestrator;
