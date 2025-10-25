const { body, param } = require("express-validator");

const cartItemValidator = [
  body("product_id").isUUID(),
  body("qty").isInt({ min: 1 })
];

const cartItemParamValidator = [param("productId").isUUID()];

module.exports = {
  cartItemValidator,
  cartItemParamValidator
};
