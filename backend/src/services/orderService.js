const { AppDataSource } = require("../config/data-source");
const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Product = require("../models/Product");
const User = require("../models/User");
const { notFound, badRequest } = require("../utils/apiError");

const ORDER_STATUSES = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

function orderRepo() {
  return AppDataSource.getRepository(Order);
}

async function listUserOrders(userId, { page = 1, limit = 10 } = {}) {
  const repo = orderRepo();
  const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
  const pageSize = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);

  const [orders, total] = await repo.findAndCount({
    where: { user: { id: userId } },
    relations: { items: { product: true }, cart: true },
    order: { createdAt: "DESC" },
    skip: (pageNumber - 1) * pageSize,
    take: pageSize
  });

  return {
    items: orders,
    meta: {
      total,
      page: pageNumber,
      limit: pageSize,
      pageCount: Math.ceil(total / pageSize) || 1
    }
  };
}

async function getOrderDetail(orderId, { userId, isAdmin = false }) {
  const repo = orderRepo();
  const order = await repo.findOne({
    where: { id: orderId },
    relations: { items: { product: true }, user: true, cart: true }
  });
  if (!order) {
    throw notFound("Order not found");
  }
  if (!isAdmin && order.user.id !== userId) {
    throw notFound("Order not found");
  }
  return order;
}

async function updateOrderStatus(orderId, status) {
  if (!ORDER_STATUSES.includes(status)) {
    throw badRequest("Invalid order status");
  }
  const repo = orderRepo();
  const order = await repo.findOne({ where: { id: orderId } });
  if (!order) {
    throw notFound("Order not found");
  }
  order.status = status;
  await repo.save(order);
  return order;
}

async function listOrdersAdmin({ status, page = 1, limit = 20 }) {
  const repo = orderRepo();
  const qb = repo
    .createQueryBuilder("order")
    .leftJoinAndSelect("order.user", "user")
    .leftJoinAndSelect("order.items", "items")
    .leftJoinAndSelect("items.product", "product")
    .orderBy("order.createdAt", "DESC");

  if (status) {
    qb.andWhere("order.status = :status", { status });
  }

  const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
  const pageSize = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
  qb.skip((pageNumber - 1) * pageSize).take(pageSize);

  const [orders, total] = await qb.getManyAndCount();

  return {
    items: orders,
    meta: {
      total,
      page: pageNumber,
      limit: pageSize,
      pageCount: Math.ceil(total / pageSize) || 1
    }
  };
}

async function getAdminMetrics() {
  const totalSalesResult = await orderRepo()
    .createQueryBuilder("order")
    .select("COALESCE(SUM(order.total), 0)", "total")
    .getRawOne();
  const totalSales = Number(totalSalesResult.total || 0);

  const productCountResult = await AppDataSource.getRepository(Product)
    .createQueryBuilder("product")
    .where("product.deletedAt IS NULL")
    .select("COUNT(product.id)", "count")
    .getRawOne();
  const productCount = Number(productCountResult.count || 0);

  const activeUsersResult = await AppDataSource.getRepository(User)
    .createQueryBuilder("user")
    .select("COUNT(user.id)", "count")
    .getRawOne();
  const activeUsers = Number(activeUsersResult.count || 0);

  const ordersByStatusResult = await orderRepo()
    .createQueryBuilder("order")
    .select("order.status", "status")
    .addSelect("COUNT(order.id)", "count")
    .groupBy("order.status")
    .getRawMany();

  const ordersByStatus = ordersByStatusResult.reduce((acc, row) => {
    acc[row.status] = Number(row.count);
    return acc;
  }, {});

  return {
    totalSales,
    productCount,
    activeUsers,
    ordersByStatus
  };
}

module.exports = {
  ORDER_STATUSES,
  listUserOrders,
  getOrderDetail,
  updateOrderStatus,
  listOrdersAdmin,
  getAdminMetrics
};
