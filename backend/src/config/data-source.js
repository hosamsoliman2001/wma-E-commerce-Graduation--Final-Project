require("reflect-metadata");
const { DataSource } = require("typeorm");
const { requireEnv } = require("./env");

const DB_TYPE = requireEnv("DB_TYPE", "mysql");

const baseConfig = {
  type: DB_TYPE,
  synchronize: false,
  logging: process.env.NODE_ENV === "development",
  migrationsRun: false,
  entities: [
    require("../models/User"),
    require("../models/Category"),
    require("../models/Product"),
    require("../models/Cart"),
    require("../models/CartItem"),
    require("../models/Order"),
    require("../models/OrderItem")
  ],
  migrations: ["src/migrations/*.js"],
  subscribers: []
};

let AppDataSource;

if (DB_TYPE === "mysql") {
  AppDataSource = new DataSource({
    ...baseConfig,
    host: requireEnv("DB_HOST", "localhost"),
    port: Number(requireEnv("DB_PORT", "3306")),
    username: requireEnv("DB_USER", "root"),
    password: requireEnv("DB_PASSWORD", ""),
    database: requireEnv("DB_NAME", "ecommerce"),
    charset: requireEnv("DB_CHARSET", "utf8mb4_unicode_ci"),
    timezone: requireEnv("DB_TIMEZONE", "Z")
  });
} else if (DB_TYPE === "sqlite") {
  AppDataSource = new DataSource({
    ...baseConfig,
    database: requireEnv("DB_NAME", ":memory:"),
    synchronize: true
  });
} else {
  throw new Error(`Unsupported DB_TYPE ${DB_TYPE}`);
}

module.exports = {
  AppDataSource
};
