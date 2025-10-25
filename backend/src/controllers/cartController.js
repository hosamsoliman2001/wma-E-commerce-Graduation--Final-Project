// cartController.js
const cartService = require("../services/cartService");
const validate = require("../middleware/validate");
const { cartItemValidator, cartItemParamValidator } = require("../validators/cartValidators");

const getCart = [
  async (req, res, next) => {
    try {
      const cart = await cartService.getActiveCart(req.user.id);
      res.json(cart);
    } catch (err) {
      next(err);
    }
  }
];

const addOrUpdateItem = [
  cartItemValidator,
  validate,
  async (req, res, next) => {
    try {
      const { product_id: productId, qty } = req.body;
      const cart = await cartService.addOrUpdateItem(req.user.id, { productId, quantity: qty });
      res.status(201).json(cart);
    } catch (err) {
      next(err);
    }
  }
];

const removeItem = [
  cartItemParamValidator,
  validate,
  async (req, res, next) => {
    try {
      const cart = await cartService.removeItem(req.user.id, req.params.productId);
      res.json(cart);
    } catch (err) {
      next(err);
    }
  }
];

const checkout = [
  async (req, res, next) => {
    try {
      const result = await cartService.checkout(req.user.id);
      res.status(201).json({ order_id: result.orderId });
    } catch (err) {
      next(err);
    }
  }
];

module.exports = {
  getCart,
  addOrUpdateItem,
  removeItem,
  checkout
};
