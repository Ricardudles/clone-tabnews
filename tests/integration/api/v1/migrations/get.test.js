import database from "infra/database.js";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await cleanDatabase();
});

var baseUrl = "http://localhost:3000";

async function cleanDatabase() {
  await database.query("DROP schema public CASCADE; create schema public;");
}

test("Get to /api/v1/migrations should return 200", async () => {
  const response = await fetch(`${baseUrl}/api/v1/migrations`);
  expect(response.status).toBe(200);

  const responseBody = await response.json();

  expect(Array.isArray(responseBody)).toBe(true);
  expect(responseBody.length).toBeGreaterThan(0);
});
