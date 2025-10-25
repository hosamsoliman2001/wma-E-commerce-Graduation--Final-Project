// productController.js
const productService = require("../services/productService");
const validate = require("../middleware/validate");
const {
  listProductsValidator,
  productIdValidator,
  createProductValidator,
  updateProductValidator
} = require("../validators/productValidators");

const listProducts = [
  listProductsValidator,
  validate,
  async (req, res, next) => {
    try {
      const { search, cat: categoryId, sort, order, page, limit } = req.query;
      const result = await productService.listProducts({ search, categoryId, sort, order, page, limit });
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
];

const getProduct = [
  productIdValidator,
  validate,
  async (req, res, next) => {
    try {
      const product = await productService.getProductById(req.params.id);
      res.json(product);
    } catch (err) {
      next(err);
    }
  }
];

const createProduct = [
  createProductValidator,
  validate,
  async (req, res, next) => {
    try {
      const { name, description, price, stock, categoryId, image, imageUrl } = req.body;
      const product = await productService.createProduct({ name, description, price, stock, categoryId, image, imageUrl });
      res.status(201).json(product);
    } catch (err) {
      next(err);
    }
  }
];

const updateProduct = [
  productIdValidator,
  updateProductValidator,
  validate,
  async (req, res, next) => {
    try {
      const product = await productService.updateProduct(req.params.id, req.body);
      res.json(product);
    } catch (err) {
      next(err);
    }
  }
];

const deleteProduct = [
  productIdValidator,
  validate,
  async (req, res, next) => {
    try {
      const result = await productService.softDeleteProduct(req.params.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
];

module.exports = {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
};
