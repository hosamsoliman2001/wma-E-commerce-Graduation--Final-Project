// userController.js
const userService = require("../services/userService");
const authService = require("../services/authService");

const getMe = [
  async (req, res, next) => {
    try {
      const user = await userService.getUserById(req.user.id);
      const publicUser = authService.toPublicUser(user);
      res.json(publicUser);
    } catch (err) {
      next(err);
    }
  }
];

module.exports = {
  getMe
};
