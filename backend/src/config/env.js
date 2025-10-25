const path = require("path");
const dotenv = require("dotenv");

const envPath = process.env.NODE_ENV === "test" ? ".env.test" : ".env";
dotenv.config({ path: path.resolve(process.cwd(), envPath) });

function requireEnv(name, fallback) {
  const value = process.env[name];
  if (value === undefined || value === "") {
    if (fallback !== undefined) {
      return fallback;
    }
    throw new Error(`Missing environment variable ${name}`);
  }
  return value;
}

module.exports = {
  requireEnv
};
