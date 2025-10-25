const request = require("./utils/request");
const { createUser, DEFAULT_PASSWORD } = require("./utils/factories");

describe("Auth API", () => {
  test("registers a new user", async () => {
    const email = `user_${Date.now()}@example.com`;
    const response = await request.post("/api/v1/auth/register").send({
      username: "testuser",
      email,
      password: "Password123!"
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("token");
    expect(response.body.user.email).toBe(email);
  });

  test("logs in an existing user", async () => {
    const user = await createUser();

    const response = await request.post("/api/v1/auth/login").send({
      email: user.email,
      password: DEFAULT_PASSWORD
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body.user.email).toBe(user.email);
  });

  test("returns current user profile", async () => {
    const user = await createUser();

    const login = await request.post("/api/v1/auth/login").send({
      email: user.email,
      password: DEFAULT_PASSWORD
    });

    const response = await request
      .get("/api/v1/users/me")
      .set("Authorization", `Bearer ${login.body.token}`);

    expect(response.status).toBe(200);
    expect(response.body.email).toBe(user.email);
    expect(response.body).not.toHaveProperty("passwordHash");
  });
});
