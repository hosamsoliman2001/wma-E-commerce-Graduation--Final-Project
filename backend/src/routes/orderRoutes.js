// orderRoutes.js
const { Router } = require("express");
const orderController = require("../controllers/orderController");
const { authenticate, authorizeAdmin } = require("../middleware/authJwt");

const router = Router();

router.get("/", authenticate(), orderController.listOrders);
router.get("/:id", authenticate(), orderController.getOrder);

router.patch("/:id/status", authenticate(), authorizeAdmin(), orderController.updateOrderStatus);

module.exports = router;
