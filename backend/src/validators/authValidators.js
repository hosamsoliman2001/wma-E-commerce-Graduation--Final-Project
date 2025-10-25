const { body } = require("express-validator");

const registerValidator = [
  body("username").isString().trim().isLength({ min: 3, max: 100 }),
  body("email").isEmail().normalizeEmail(),
  body("password").isString().isLength({ min: 8 })
];

const loginValidator = [
  body("email").isEmail().normalizeEmail(),
  body("password").isString().notEmpty()
];

module.exports = {
  registerValidator,
  loginValidator
};
