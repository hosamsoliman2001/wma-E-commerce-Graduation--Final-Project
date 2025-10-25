// adminRoutes.js
const { Router } = require("express");
const orderController = require("../controllers/orderController");
const { authenticate, authorizeAdmin } = require("../middleware/authJwt");

const router = Router();

router.get("/metrics", authenticate(), authorizeAdmin(), orderController.getMetrics);
router.get("/orders", authenticate(), authorizeAdmin(), orderController.adminListOrders);
router.get("/orders/:id", authenticate(), authorizeAdmin(), orderController.adminGetOrder);

module.exports = router;
