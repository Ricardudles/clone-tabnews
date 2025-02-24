import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

var baseUrl = "http://localhost:3000";

describe("POST /api/v1/status", () => {
  describe("Anonymous user", () => {
    test("Retrieving MethodNotAllowed", async () => {
      const response = await fetch(`${baseUrl}/api/v1/status`, {
        method: "POST",
      });
      expect(response.status).toBe(405);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "MethodNotAllowed",
        message: "Método não permitido para este endpoint",
        action:
          "Verifique se o método HTTP enviado é válido para este endopoint",
        status_code: 405,
      });
    });
  });
});
