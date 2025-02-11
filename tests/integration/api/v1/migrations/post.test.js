import database from "infra/database.js";
var baseUrl = "http://localhost:3000";

beforeAll(cleanDatabase);

async function cleanDatabase() {
  await database.query("DROP schema public CASCADE; create schema public;");
}

test("2 Posts to /api/v1/migrations should return 201 and 200", async () => {
  const response1 = await fetch(`${baseUrl}/api/v1/migrations`, {
    method: "POST",
  });

  expect(response1.status).toBe(201);

  const response1Body = await response1.json();

  console.log(response1Body);

  expect(Array.isArray(response1Body)).toBe(true);
  expect(response1Body.length).toBeGreaterThan(0);

  const response2 = await fetch(`${baseUrl}/api/v1/migrations`, {
    method: "POST",
  });
  expect(response2.status).toBe(200);

  const response2Body = await response2.json();

  console.log(response2Body);

  expect(Array.isArray(response2Body)).toBe(true);
  expect(response2Body.length).toBe(0);
});
