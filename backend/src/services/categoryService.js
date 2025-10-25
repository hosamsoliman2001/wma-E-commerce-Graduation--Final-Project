const { AppDataSource } = require("../config/data-source");
const Category = require("../models/Category");
const { notFound, conflict } = require("../utils/apiError");

function categoryRepo() {
  return AppDataSource.getRepository(Category);
}

async function listCategories() {
  const repo = categoryRepo();
  return repo.find({ order: { name: "ASC" } });
}

async function getCategoryById(id) {
  const repo = categoryRepo();
  const category = await repo.findOne({ where: { id } });
  if (!category) {
    throw notFound("Category not found");
  }
  return category;
}

async function createCategory({ name, description }) {
  const repo = categoryRepo();
  const exists = await repo.findOne({ where: { name } });
  if (exists) {
    throw conflict("Category already exists");
  }
  const category = repo.create({ name, description });
  return repo.save(category);
}

async function updateCategory(id, updates) {
  const repo = categoryRepo();
  const category = await getCategoryById(id);
  if (updates.name && updates.name !== category.name) {
    const exists = await repo.findOne({ where: { name: updates.name } });
    if (exists) {
      throw conflict("Category already exists");
    }
    category.name = updates.name;
  }
  if (updates.description !== undefined) {
    category.description = updates.description;
  }
  return repo.save(category);
}

async function deleteCategory(id) {
  const repo = categoryRepo();
  const category = await getCategoryById(id);
  await repo.remove(category);
  return { success: true };
}

module.exports = {
  listCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
