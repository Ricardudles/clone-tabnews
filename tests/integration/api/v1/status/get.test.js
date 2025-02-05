var baseUrl = "http://localhost:3000";

test("Get to /api/v1/status should return 200", async () => {
  const response = await fetch(`${baseUrl}/api/v1/status`);
  expect(response.status).toBe(200);
});
