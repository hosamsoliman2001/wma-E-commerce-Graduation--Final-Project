// orderController.js
const orderService = require("../services/orderService");
const validate = require("../middleware/validate");
const {
  orderIdParam,
  listOrdersValidator,
  adminListOrdersValidator,
  updateStatusValidator
} = require("../validators/orderValidators");

const listOrders = [
  listOrdersValidator,
  validate,
  async (req, res, next) => {
    try {
      const { page, limit } = req.query;
      const orders = await orderService.listUserOrders(req.user.id, { page, limit });
      res.json(orders);
    } catch (err) {
      next(err);
    }
  }
];

const getOrder = [
  orderIdParam,
  validate,
  async (req, res, next) => {
    try {
      const order = await orderService.getOrderDetail(req.params.id, { userId: req.user.id });
      res.json(order);
    } catch (err) {
      next(err);
    }
  }
];

const adminListOrders = [
  adminListOrdersValidator,
  validate,
  async (req, res, next) => {
    try {
      const { status, page, limit } = req.query;
      const orders = await orderService.listOrdersAdmin({ status, page, limit });
      res.json(orders);
    } catch (err) {
      next(err);
    }
  }
];

const adminGetOrder = [
  orderIdParam,
  validate,
  async (req, res, next) => {
    try {
      const order = await orderService.getOrderDetail(req.params.id, { isAdmin: true });
      res.json(order);
    } catch (err) {
      next(err);
    }
  }
];

const updateOrderStatus = [
  orderIdParam,
  updateStatusValidator,
  validate,
  async (req, res, next) => {
    try {
      const order = await orderService.updateOrderStatus(req.params.id, req.body.status);
      res.json(order);
    } catch (err) {
      next(err);
    }
  }
];

const getMetrics = [
  async (_req, res, next) => {
    try {
      const metrics = await orderService.getAdminMetrics();
      res.json(metrics);
    } catch (err) {
      next(err);
    }
  }
];

module.exports = {
  listOrders,
  getOrder,
  adminListOrders,
  adminGetOrder,
  updateOrderStatus,
  getMetrics
};
