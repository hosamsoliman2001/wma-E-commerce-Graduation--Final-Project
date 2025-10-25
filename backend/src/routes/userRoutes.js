// userRoutes.js
const { Router } = require("express");
const userController = require("../controllers/userController");
const { authenticate } = require("../middleware/authJwt");

const router = Router();

router.get("/me", authenticate(), userController.getMe);

module.exports = router;
