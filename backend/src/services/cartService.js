const { AppDataSource } = require("../config/data-source");
const Cart = require("../models/Cart");
const CartItem = require("../models/CartItem");
const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const { ensureStock, decrementStock } = require("./productService");
const { badRequest, notFound } = require("../utils/apiError");

function cartRepo() {
  return AppDataSource.getRepository(Cart);
}

function cartItemRepo() {
  return AppDataSource.getRepository(CartItem);
}

function orderRepo() {
  return AppDataSource.getRepository(Order);
}

async function getActiveCart(userId) {
  const repo = cartRepo();
  let cart = await repo.findOne({
    where: { user: { id: userId }, status: "ACTIVE" },
    relations: { items: { product: true }, user: true }
  });
  if (!cart) {
    cart = repo.create({ user: { id: userId }, status: "ACTIVE", subtotal: 0, total: 0 });
    cart = await repo.save(cart);
    cart.items = [];
  }
  return cart;
}

function calculateTotals(cart) {
  const subtotal = cart.items.reduce((sum, item) => sum + Number(item.totalPrice), 0);
  cart.subtotal = subtotal;
  cart.total = subtotal;
  return cart;
}

async function addOrUpdateItem(userId, { productId, quantity }) {
  if (!productId || !quantity || quantity <= 0) {
    throw badRequest("productId and quantity > 0 required");
  }
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  try {
    const manager = queryRunner.manager;
    let cart = await manager.getRepository(Cart).findOne({
      where: { user: { id: userId }, status: "ACTIVE" },
      relations: { items: { product: true } }
    });
    if (!cart) {
      cart = manager.getRepository(Cart).create({ user: { id: userId }, status: "ACTIVE", subtotal: 0, total: 0 });
      cart = await manager.getRepository(Cart).save(cart);
      cart.items = [];
    }

    const product = await ensureStock(productId, quantity, manager);

    let item = cart.items.find((cartItem) => cartItem.product.id === productId);
    if (!item) {
      item = manager.getRepository(CartItem).create({
        cart,
        product,
        quantity,
        unitPrice: product.price,
        totalPrice: Number(product.price) * quantity
      });
      await manager.getRepository(CartItem).save(item);
      cart.items.push(item);
    } else {
      item.quantity = quantity;
      item.unitPrice = product.price;
      item.totalPrice = Number(product.price) * quantity;
      await manager.getRepository(CartItem).save(item);
    }

    calculateTotals(cart);
    await manager.getRepository(Cart).save(cart);

    await queryRunner.commitTransaction();

    cart.items = await manager.getRepository(CartItem).find({
      where: { cart: { id: cart.id } },
      relations: { product: true }
    });

    return calculateTotals(cart);
  } catch (err) {
    await queryRunner.rollbackTransaction();
    throw err;
  } finally {
    await queryRunner.release();
  }
}

async function removeItem(userId, productId) {
  const repo = cartRepo();
  const cart = await repo.findOne({
    where: { user: { id: userId }, status: "ACTIVE" },
    relations: { items: { product: true } }
  });
  if (!cart) {
    throw notFound("Cart not found");
  }
  const item = cart.items.find((cartItem) => cartItem.product.id === productId);
  if (!item) {
    throw notFound("Cart item not found");
  }
  await cartItemRepo().remove(item);
  cart.items = cart.items.filter((cartItem) => cartItem.product.id !== productId);
  calculateTotals(cart);
  await repo.save(cart);
  return cart;
}

async function checkout(userId) {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  try {
    const manager = queryRunner.manager;
    const cart = await manager.getRepository(Cart).findOne({
      where: { user: { id: userId }, status: "ACTIVE" },
      relations: { items: { product: true }, user: true }
    });
    if (!cart || cart.items.length === 0) {
      throw badRequest("Cart is empty");
    }

    calculateTotals(cart);

    for (const item of cart.items) {
      await ensureStock(item.product.id, item.quantity, manager);
    }

    for (const item of cart.items) {
      await decrementStock(item.product.id, item.quantity, manager);
    }

    const order = manager.getRepository(Order).create({
      user: cart.user,
      cart,
      status: "PAID",
      subtotal: cart.subtotal,
      tax: 0,
      total: cart.total
    });
    const savedOrder = await manager.getRepository(Order).save(order);

    const orderItems = cart.items.map((item) => {
      return manager.getRepository(OrderItem).create({
        order: savedOrder,
        product: item.product,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice
      });
    });
    await manager.getRepository(OrderItem).save(orderItems);

    cart.status = "CHECKED_OUT";
    await manager.getRepository(Cart).save(cart);

    await queryRunner.commitTransaction();

    return { orderId: savedOrder.id };
  } catch (err) {
    await queryRunner.rollbackTransaction();
    throw err;
  } finally {
    await queryRunner.release();
  }
}

module.exports = {
  getActiveCart,
  addOrUpdateItem,
  removeItem,
  checkout,
  calculateTotals
};
