// productRoutes.js
const { Router } = require("express");
const productController = require("../controllers/productController");
const { authenticate, authorizeAdmin } = require("../middleware/authJwt");

const router = Router();

router.get("/", productController.listProducts);
router.get("/:id", productController.getProduct);
router.post("/", authenticate(), authorizeAdmin(), productController.createProduct);
router.put("/:id", authenticate(), authorizeAdmin(), productController.updateProduct);
router.delete("/:id", authenticate(), authorizeAdmin(), productController.deleteProduct);

module.exports = router;
