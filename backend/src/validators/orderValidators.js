const { param, body, query } = require("express-validator");

const orderIdParam = [param("id").isUUID()];

const listOrdersValidator = [
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 100 })
];

const adminListOrdersValidator = [
  query("status").optional().isString(),
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 100 })
];

const updateStatusValidator = [body("status").isString().isLength({ min: 2, max: 30 })];

module.exports = {
  orderIdParam,
  listOrdersValidator,
  adminListOrdersValidator,
  updateStatusValidator
};
