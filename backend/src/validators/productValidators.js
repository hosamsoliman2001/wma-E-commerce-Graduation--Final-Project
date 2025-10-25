const { body, param, query } = require("express-validator");

const listProductsValidator = [
  query("search").optional().isString(),
  query("cat").optional().isUUID(),
  query("sort").optional().isIn(["createdAt", "price", "name"]),
  query("order").optional().isIn(["ASC", "DESC", "asc", "desc"]),
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 100 })
];

const productIdValidator = [param("id").isUUID()];

const createProductValidator = [
  body("name").isString().trim().isLength({ min: 3 }),
  body("description").optional().isString(),
  body("price").isFloat({ gt: 0 }),
  body("stock").optional().isInt({ min: 0 }),
  body("image").optional().isString().trim().isLength({ max: 2048 }),
  body("imageUrl").optional().isString().trim().isLength({ max: 2048 }),
  body("categoryId").isUUID()
];

const updateProductValidator = [
  body("name").optional().isString().trim().isLength({ min: 3 }),
  body("description").optional().isString(),
  body("price").optional().isFloat({ gt: 0 }),
  body("stock").optional().isInt({ min: 0 }),
  body("image").optional().isString().trim().isLength({ max: 2048 }),
  body("imageUrl").optional().isString().trim().isLength({ max: 2048 }),
  body("categoryId").optional().isUUID()
];

module.exports = {
  listProductsValidator,
  productIdValidator,
  createProductValidator,
  updateProductValidator
};
