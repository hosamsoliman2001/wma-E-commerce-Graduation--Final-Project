// authJwt.js
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/jwt");
const { AppDataSource } = require("../config/data-source");
const tokenBlacklistService = require("../services/tokenBlacklistService");
const User = require("../models/User");
const { unauthorized, forbidden } = require("../utils/apiError");

async function loadUser(userId) {
  const repo = AppDataSource.getRepository(User);
  return repo.findOne({ where: { id: userId } });
}

function authenticate() {
  return async (req, _res, next) => {
    try {
      const authHeader = req.headers["authorization"] || "";
      const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
      if (!token) {
        throw unauthorized();
      }
      if (tokenBlacklistService.isBlacklisted(token)) {
        throw unauthorized();
      }

      const payload = jwt.verify(token, JWT_SECRET);
      req.userTokenPayload = payload;
      req.authToken = token;
      const user = await loadUser(payload.sub);
      if (!user) {
        throw unauthorized();
      }
      req.user = {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin
      };
      next();
    } catch (err) {
      if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
        next(unauthorized());
        return;
      }
      next(err);
    }
  };
}

function authorizeAdmin() {
  return (req, _res, next) => {
    if (!req.user || !req.user.isAdmin) {
      next(forbidden());
      return;
    }
    next();
  };
}

module.exports = {
  authenticate,
  authorizeAdmin
};
