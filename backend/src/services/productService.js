const { AppDataSource } = require("../config/data-source");
const Product = require("../models/Product");
const Category = require("../models/Category");
const { slugify } = require("../utils/slug");
const { notFound, badRequest } = require("../utils/apiError");

function productRepo() {
  return AppDataSource.getRepository(Product);
}

function categoryRepo() {
  return AppDataSource.getRepository(Category);
}

async function generateUniqueSlug(name) {
  const repo = productRepo();
  const base = slugify(name);
  let slug = base;
  let suffix = 1;
  while (await repo.findOne({ where: { slug }, withDeleted: true })) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }
  return slug;
}

function resolveSort(sort) {
  const allowed = {
    createdAt: "product.createdAt",
    price: "product.price",
    name: "product.name"
  };
  return allowed[sort] || allowed.createdAt;
}

async function listProducts({ search, categoryId, sort = "createdAt", order = "DESC", page = 1, limit = 10 }) {
  const repo = productRepo();
  const qb = repo
    .createQueryBuilder("product")
    .leftJoinAndSelect("product.category", "category")
    .where("product.deletedAt IS NULL");

  if (search) {
    const formatted = `%${search.toLowerCase()}%`;
    qb.andWhere("(LOWER(product.name) LIKE :search OR LOWER(product.description) LIKE :search)", {
      search: formatted
    });
  }

  if (categoryId) {
    qb.andWhere("category.id = :categoryId", { categoryId });
  }

  const sortField = resolveSort(sort);
  const sortDirection = order.toUpperCase() === "ASC" ? "ASC" : "DESC";
  qb.orderBy(sortField, sortDirection);

  const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
  const pageSize = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
  qb.skip((pageNumber - 1) * pageSize).take(pageSize);

  const [items, total] = await qb.getManyAndCount();
  return {
    items,
    meta: {
      total,
      page: pageNumber,
      limit: pageSize,
      pageCount: Math.ceil(total / pageSize) || 1
    }
  };
}

async function getProductById(id, { includeDeleted = false } = {}) {
  const repo = productRepo();
  const product = await repo.findOne({ where: { id }, relations: { category: true }, withDeleted: includeDeleted });
  if (!product || (!includeDeleted && product.deletedAt)) {
    throw notFound("Product not found");
  }
  return product;
}

async function createProduct({ name, description, price, stock, categoryId, image, imageUrl }) {
  if (!categoryId) {
    throw badRequest("categoryId is required");
  }
  const cRepo = categoryRepo();
  const category = await cRepo.findOne({ where: { id: categoryId } });
  if (!category) {
    throw notFound("Category not found");
  }

  const repo = productRepo();
  const slug = await generateUniqueSlug(name);
  const product = repo.create({
    name,
    slug,
    description,
    image: (imageUrl ?? image)?.trim() || null,
    price,
    stock,
    category
  });
  await repo.save(product);
  return getProductById(product.id);
}

async function updateProduct(id, updates) {
  const repo = productRepo();
  const product = await getProductById(id);

  if (updates.categoryId) {
    const category = await categoryRepo().findOne({ where: { id: updates.categoryId } });
    if (!category) {
      throw notFound("Category not found");
    }
    product.category = category;
  }

  if (updates.name && updates.name !== product.name) {
    product.name = updates.name;
    product.slug = await generateUniqueSlug(updates.name);
  }

  if (updates.description !== undefined) {
    product.description = updates.description;
  }

  const nextImage = updates.imageUrl ?? updates.image;
  if (nextImage !== undefined) {
    product.image = nextImage ? String(nextImage).trim() : null;
  }

  if (updates.price !== undefined) {
    product.price = updates.price;
  }

  if (updates.stock !== undefined) {
    product.stock = updates.stock;
  }

  await repo.save(product);
  return getProductById(id);
}

async function softDeleteProduct(id) {
  const repo = productRepo();
  const product = await getProductById(id);
  await repo.softRemove(product);
  return { success: true };
}

async function ensureStock(productId, quantity, manager) {
  const repo = manager ? manager.getRepository(Product) : productRepo();
  const product = await repo.findOne({ where: { id: productId } });
  if (!product) {
    throw notFound("Product not found");
  }
  if (product.deletedAt) {
    throw badRequest("Product unavailable");
  }
  if (product.stock < quantity) {
    throw badRequest("Insufficient stock");
  }
  return product;
}

async function decrementStock(productId, quantity, manager) {
  const repo = manager ? manager.getRepository(Product) : productRepo();
  await repo.decrement({ id: productId }, "stock", quantity);
}

module.exports = {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  softDeleteProduct,
  ensureStock,
  decrementStock
};
