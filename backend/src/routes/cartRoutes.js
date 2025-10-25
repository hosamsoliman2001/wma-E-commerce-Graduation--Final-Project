// cartRoutes.js
const { Router } = require("express");
const cartController = require("../controllers/cartController");
const { authenticate } = require("../middleware/authJwt");

const router = Router();

router.get("/", authenticate(), cartController.getCart);
router.post("/items", authenticate(), cartController.addOrUpdateItem);
router.delete("/items/:productId", authenticate(), cartController.removeItem);
router.post("/checkout", authenticate(), cartController.checkout);

module.exports = router;
