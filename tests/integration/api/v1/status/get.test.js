import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

var baseUrl = "http://localhost:3000";

describe("GET /api/v1/status", () => {
  describe("Anonymous user", () => {
    test("Retrieving current system status", async () => {
      const response = await fetch(`${baseUrl}/api/v1/status`);
      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody.updated_at).toBeDefined();

      const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();
      expect(responseBody.updated_at).toEqual(parsedUpdatedAt);

      expect(responseBody.dependencies.database.version).toBeDefined();
      expect(responseBody.dependencies.database.version).toEqual("16.0");

      expect(responseBody.dependencies.database.max_connections).toBeDefined();
      expect(
        responseBody.dependencies.database.max_connections,
      ).toBeGreaterThan(0);

      expect(
        responseBody.dependencies.database.opened_connections,
      ).toBeDefined();
      expect(responseBody.dependencies.database.opened_connections).toEqual(1);
      expect(
        responseBody.dependencies.database.opened_connections,
      ).toBeLessThanOrEqual(responseBody.dependencies.database.max_connections);
    });
  });
});
