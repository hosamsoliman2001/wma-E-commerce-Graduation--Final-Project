const request = require("./utils/request");
const {
  createUser,
  DEFAULT_PASSWORD,
  createAdminAndToken,
  createCategory
} = require("./utils/factories");
const { AppDataSource } = require("../src/config/data-source");
const Product = require("../src/models/Product");

async function createProductViaApi(adminToken, categoryId, overrides = {}) {
  const response = await request
    .post("/api/v1/products")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({
      name: overrides.name || `Product ${Date.now()}`,
      description: overrides.description || "Test product",
      price: overrides.price ?? 25.5,
      stock: overrides.stock ?? 20,
      categoryId
    });
  return response.body;
}

describe("Cart and Order flow", () => {
  test("user can add to cart and checkout", async () => {
    const { token: adminToken } = await createAdminAndToken();
    const category = await createCategory({ name: "Cart Category" });
    const product = await createProductViaApi(adminToken, category.id, {
      price: 15.0,
      stock: 10
    });

    const user = await createUser({ username: "shopper" });
    const login = await request.post("/api/v1/auth/login").send({
      email: user.email,
      password: DEFAULT_PASSWORD
    });
    const token = login.body.token;

    const addResponse = await request
      .post("/api/v1/carts/items")
      .set("Authorization", `Bearer ${token}`)
      .send({ product_id: product.id, qty: 2 });

    expect(addResponse.status).toBe(201);
    expect(addResponse.body.total).toBeCloseTo(30.0);
    expect(addResponse.body.items).toHaveLength(1);

    const checkoutResponse = await request
      .post("/api/v1/carts/checkout")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(checkoutResponse.status).toBe(201);
    expect(checkoutResponse.body).toHaveProperty("order_id");

    const ordersResponse = await request
      .get("/api/v1/orders")
      .set("Authorization", `Bearer ${token}`);

    expect(ordersResponse.status).toBe(200);
    expect(ordersResponse.body.items).toHaveLength(1);

    const repo = AppDataSource.getRepository(Product);
    const stored = await repo.findOne({ where: { id: product.id } });
    expect(stored.stock).toBe(8);
  });

  test("admin can view metrics and orders", async () => {
    const { admin, token: adminToken } = await createAdminAndToken();
    const category = await createCategory({ name: "Metrics Category" });
    const product = await createProductViaApi(adminToken, category.id, {
      price: 50.0,
      stock: 5,
      name: "Metrics Product"
    });

    const user = await createUser({ username: "metricsUser" });
    const login = await request.post("/api/v1/auth/login").send({
      email: user.email,
      password: DEFAULT_PASSWORD
    });
    const token = login.body.token;

    await request
      .post("/api/v1/carts/items")
      .set("Authorization", `Bearer ${token}`)
      .send({ product_id: product.id, qty: 1 });

    await request
      .post("/api/v1/carts/checkout")
      .set("Authorization", `Bearer ${token}`)
      .send();

    const metricsResponse = await request
      .get("/api/v1/admin/metrics")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(metricsResponse.status).toBe(200);
    expect(metricsResponse.body).toMatchObject({
      totalSales: expect.any(Number),
      productCount: expect.any(Number),
      activeUsers: expect.any(Number),
      ordersByStatus: expect.any(Object)
    });

    const ordersResponse = await request
      .get("/api/v1/admin/orders")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(ordersResponse.status).toBe(200);
    expect(ordersResponse.body.items.length).toBeGreaterThan(0);

    const orderDetailResponse = await request
      .get(`/api/v1/admin/orders/${ordersResponse.body.items[0].id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(orderDetailResponse.status).toBe(200);
    expect(orderDetailResponse.body.user.id).not.toBe(admin.id);
  });
});
