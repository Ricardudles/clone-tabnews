import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runMigrations();
});

var baseUrl = "http://localhost:3000";

describe("POST /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    test("With unique and valid data", async () => {
      const response = await fetch(`${baseUrl}/api/v1/users`, {
        method: "POST",
      });

      expect(response.status).toBe(201);
    });
  });
});
