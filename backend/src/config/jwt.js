const { requireEnv } = require("./env");

const JWT_SECRET = requireEnv("JWT_SECRET", "changeme-secret");
const JWT_EXPIRES_IN = requireEnv("JWT_EXPIRES_IN", "24h");

module.exports = {
  JWT_SECRET,
  JWT_EXPIRES_IN
};
