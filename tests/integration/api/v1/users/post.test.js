import orchestrator from "tests/orchestrator.js";
import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runMigrations();
});

var baseUrl = "http://localhost:3000";

describe("POST /api/v1/users", () => {
  describe("Anonymous user", () => {
    test("With unique and valid data", async () => {
      const response = await fetch(`${baseUrl}/api/v1/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "username",
          email: "email@hotmail.com",
          password: "password",
        }),
      });

      expect(response.status).toBe(201);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "username",
        email: "email@hotmail.com",
        password: "password",
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });

    test("With duplicated email", async () => {
      const response = await fetch(`${baseUrl}/api/v1/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "emailduplicado1",
          email: "duplicado@hotmail.com",
          password: "password",
        }),
      });

      expect(response.status).toBe(201);

      const response2 = await fetch(`${baseUrl}/api/v1/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "emailduplicado2",
          email: "Duplicado@hotmail.com",
          password: "password",
        }),
      });

      expect(response2.status).toBe(400);

      const responseBody = await response2.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "Email informado já está em uso.",
        action: "Informe outro email.",
        status_code: 400,
      });
    });

    test("With duplicated username", async () => {
      const response = await fetch(`${baseUrl}/api/v1/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "usernameduplicado",
          email: "email1@hotmail.com",
          password: "password",
        }),
      });

      expect(response.status).toBe(201);

      const response2 = await fetch(`${baseUrl}/api/v1/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "usernameDuplicado",
          email: "email2@hotmail.com",
          password: "password",
        }),
      });

      expect(response2.status).toBe(400);

      const responseBody = await response2.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "Username informado já está em uso.",
        action: "Informe outro username.",
        status_code: 400,
      });
    });
  });
});
