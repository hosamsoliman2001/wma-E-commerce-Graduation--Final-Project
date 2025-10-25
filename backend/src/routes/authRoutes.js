// authRoutes.js
const { Router } = require("express");
const authController = require("../controllers/authController");
const { loginLimiter } = require("../middleware/rateLimit");
const { authenticate } = require("../middleware/authJwt");

const router = Router();

router.post("/register", authController.register);
router.post("/login", loginLimiter, authController.login);
router.post("/logout", authenticate(), authController.logout);

module.exports = router;
