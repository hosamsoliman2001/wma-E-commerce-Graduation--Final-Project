// categoryController.js
const categoryService = require("../services/categoryService");
const validate = require("../middleware/validate");
const {
  categoryIdValidator,
  createCategoryValidator,
  updateCategoryValidator
} = require("../validators/categoryValidators");

const listCategories = [
  async (_req, res, next) => {
    try {
      const categories = await categoryService.listCategories();
      res.json(categories);
    } catch (err) {
      next(err);
    }
  }
];

const getCategory = [
  categoryIdValidator,
  validate,
  async (req, res, next) => {
    try {
      const category = await categoryService.getCategoryById(req.params.id);
      res.json(category);
    } catch (err) {
      next(err);
    }
  }
];

const createCategory = [
  createCategoryValidator,
  validate,
  async (req, res, next) => {
    try {
      const { name, description } = req.body;
      const category = await categoryService.createCategory({ name, description });
      res.status(201).json(category);
    } catch (err) {
      next(err);
    }
  }
];

const updateCategory = [
  categoryIdValidator,
  updateCategoryValidator,
  validate,
  async (req, res, next) => {
    try {
      const category = await categoryService.updateCategory(req.params.id, req.body);
      res.json(category);
    } catch (err) {
      next(err);
    }
  }
];

const deleteCategory = [
  categoryIdValidator,
  validate,
  async (req, res, next) => {
    try {
      const result = await categoryService.deleteCategory(req.params.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
];

module.exports = {
  listCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
};
