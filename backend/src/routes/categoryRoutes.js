// categoryRoutes.js
const { Router } = require("express");
const categoryController = require("../controllers/categoryController");
const { authenticate, authorizeAdmin } = require("../middleware/authJwt");

const router = Router();

router.get("/", categoryController.listCategories);
router.get("/:id", categoryController.getCategory);
router.post("/", authenticate(), authorizeAdmin(), categoryController.createCategory);
router.put("/:id", authenticate(), authorizeAdmin(), categoryController.updateCategory);
router.delete("/:id", authenticate(), authorizeAdmin(), categoryController.deleteCategory);

module.exports = router;
