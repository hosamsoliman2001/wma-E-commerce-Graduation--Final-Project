const { body, param } = require("express-validator");

const categoryIdValidator = [param("id").isUUID()];

const createCategoryValidator = [
  body("name").isString().trim().isLength({ min: 3 }),
  body("description").optional().isString()
];

const updateCategoryValidator = [
  body("name").optional().isString().trim().isLength({ min: 3 }),
  body("description").optional().isString()
];

module.exports = {
  categoryIdValidator,
  createCategoryValidator,
  updateCategoryValidator
};
