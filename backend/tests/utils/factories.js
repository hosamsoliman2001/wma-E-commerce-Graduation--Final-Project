const { randomUUID } = require("crypto");
const bcrypt = require("bcrypt");
const request = require("./request");
const { AppDataSource } = require("../../src/config/data-source");
const User = require("../../src/models/User");
const Category = require("../../src/models/Category");

const DEFAULT_PASSWORD = "Password123!";

async function createUser(overrides = {}) {
  const repo = AppDataSource.getRepository(User);
  const user = repo.create({
    username: overrides.username || `user_${randomUUID()}`,
    email: overrides.email || `user_${randomUUID()}@example.com`,
    passwordHash: bcrypt.hashSync(overrides.password || DEFAULT_PASSWORD, 12),
    isAdmin: overrides.isAdmin ?? false
  });
  return repo.save(user);
}

async function loginUser(email, password = DEFAULT_PASSWORD) {
  const response = await request
    .post("/api/v1/auth/login")
    .send({ email, password });
  return response.body.token;
}

async function createAdminAndToken() {
  const admin = await createUser({
    username: `admin_${randomUUID()}`,
    email: `admin_${randomUUID()}@example.com`,
    password: DEFAULT_PASSWORD,
    isAdmin: true
  });
  const token = await loginUser(admin.email, DEFAULT_PASSWORD);
  return { admin, token };
}

async function createCategory(overrides = {}) {
  const repo = AppDataSource.getRepository(Category);
  const category = repo.create({
    name: overrides.name || `Category ${randomUUID()}`,
    description: overrides.description || "Test category"
  });
  return repo.save(category);
}

module.exports = {
  DEFAULT_PASSWORD,
  createUser,
  loginUser,
  createAdminAndToken,
  createCategory
};
