process.env.NODE_ENV = "test";
process.env.DB_TYPE = "sqlite";
process.env.DB_NAME = ":memory:";
process.env.JWT_SECRET = "test-secret";
process.env.JWT_EXPIRES_IN = "1h";

const { AppDataSource } = require("../src/config/data-source");

beforeAll(async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
});

beforeEach(async () => {
  await AppDataSource.synchronize(true);
});

afterAll(async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
});
