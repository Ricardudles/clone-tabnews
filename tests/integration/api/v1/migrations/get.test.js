import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
});

var baseUrl = "http://localhost:3000";

describe("GET /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    test("Testing pending migrations", async () => {
      const response = await fetch(`${baseUrl}/api/v1/migrations`);
      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(Array.isArray(responseBody)).toBe(true);
      expect(responseBody.length).toBeGreaterThan(0);
    });
  });
});
