// authController.js
const authService = require("../services/authService");
const validate = require("../middleware/validate");
const { registerValidator, loginValidator } = require("../validators/authValidators");
const { unauthorized } = require("../utils/apiError");

const register = [
  registerValidator,
  validate,
  async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      const result = await authService.register({ username, email, password });
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }
];

const login = [
  loginValidator,
  validate,
  async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const result = await authService.login({ email, password });
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
];

const logout = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"] || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      throw unauthorized();
    }

    const decoded = req.userTokenPayload;
    const exp = decoded && decoded.exp;

    authService.logout(token, exp);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  logout
};
