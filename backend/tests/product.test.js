const request = require("./utils/request");
const { createAdminAndToken, createCategory } = require("./utils/factories");
const { AppDataSource } = require("../src/config/data-source");
const Product = require("../src/models/Product");

describe("Product API", () => {
  test("allows admins to create and fetch products", async () => {
    const { token: adminToken } = await createAdminAndToken();
    const category = await createCategory({ name: "Test Category" });

    const createResponse = await request
      .post("/api/v1/products")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Test Product",
        description: "Amazing product",
        price: 49.99,
        stock: 15,
        categoryId: category.id
      });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.name).toBe("Test Product");

    const listResponse = await request.get("/api/v1/products");
    expect(listResponse.status).toBe(200);
    expect(listResponse.body.items.length).toBeGreaterThan(0);
    const created = listResponse.body.items.find((item) => item.id === createResponse.body.id);
    expect(created).toBeDefined();
  });

  test("soft deletes product", async () => {
    const { token: adminToken } = await createAdminAndToken();
    const category = await createCategory({ name: "Delete Category" });

    const repo = AppDataSource.getRepository(Product);
    const product = await repo.save(
      repo.create({
        name: "Delete Me",
        slug: "delete-me",
        description: "To be deleted",
        price: 10,
        stock: 5,
        category
      })
    );

    const deleteResponse = await request
      .delete(`/api/v1/products/${product.id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(deleteResponse.status).toBe(200);

    const listResponse = await request.get("/api/v1/products");
    const found = listResponse.body.items.find((item) => item.id === product.id);
    expect(found).toBeUndefined();
  });
});
