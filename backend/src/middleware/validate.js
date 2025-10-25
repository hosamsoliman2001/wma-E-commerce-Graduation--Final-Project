const { validationResult } = require("express-validator");
const { badRequest } = require("../utils/apiError");

function validate(req, _res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors
      .array({ onlyFirstError: true })
      .map((err) => `${err.param}: ${err.msg}`)
      .join(", ");
    next(badRequest(message));
    return;
  }
  next();
}

module.exports = validate;
