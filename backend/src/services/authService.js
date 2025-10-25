const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRES_IN } = require("../config/jwt");
const userService = require("./userService");
const tokenBlacklistService = require("./tokenBlacklistService");
const { unauthorized } = require("../utils/apiError");

function toPublicUser(user) {
  const { passwordHash, ...publicUser } = user;
  return publicUser;
}

function signToken(user) {
  const payload = {
    sub: user.id,
    email: user.email,
    isAdmin: user.isAdmin
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

async function register({ username, email, password }) {
  const user = await userService.createUser({ username, email, password });
  const token = signToken(user);
  return { token, user: toPublicUser(user) };
}

async function login({ email, password }) {
  const user = await userService.validateCredentials(email, password);
  if (!user) {
    throw unauthorized("Invalid email or password");
  }
  const token = signToken(user);
  return { token, user: toPublicUser(user) };
}

function logout(token, exp) {
  tokenBlacklistService.add(token, exp);
}

module.exports = {
  register,
  login,
  logout,
  toPublicUser
};
