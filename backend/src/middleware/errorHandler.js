// errorHandler.js
const { ApiError } = require("../utils/apiError");

function errorHandler(err, _req, res, _next) {
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const message = err instanceof ApiError ? err.message : "Internal server error";
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.error(err);
  }
  res.status(statusCode).json({ error: message });
}

module.exports = errorHandler;
