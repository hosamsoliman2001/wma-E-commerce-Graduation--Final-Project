class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}

function badRequest(message) {
  return new ApiError(400, message);
}

function unauthorized(message = "Unauthorized") {
  return new ApiError(401, message);
}

function forbidden(message = "Forbidden") {
  return new ApiError(403, message);
}

function notFound(message = "Not found") {
  return new ApiError(404, message);
}

function conflict(message = "Conflict") {
  return new ApiError(409, message);
}

function unprocessable(message = "Unprocessable entity") {
  return new ApiError(422, message);
}

module.exports = {
  ApiError,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  conflict,
  unprocessable
};
