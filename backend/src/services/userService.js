const bcrypt = require("bcrypt");
const { AppDataSource } = require("../config/data-source");
const User = require("../models/User");
const { conflict, notFound } = require("../utils/apiError");

const SALT_ROUNDS = 12;

function getUserRepo() {
  return AppDataSource.getRepository(User);
}

async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function createUser({ username, email, password, isAdmin = false }) {
  const repo = getUserRepo();
  const existing = await repo.findOne({ where: [{ username }, { email }] });
  if (existing) {
    throw conflict("Username or email already in use");
  }
  const passwordHash = await hashPassword(password);
  const user = repo.create({ username, email, passwordHash, isAdmin });
  await repo.save(user);
  const { passwordHash: _ignored, ...cleanUser } = user;
  return cleanUser;
}

async function validateCredentials(email, password) {
  const repo = getUserRepo();
  const user = await repo.findOne({ where: { email } });
  if (!user) {
    return null;
  }
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    return null;
  }
  return user;
}

async function getUserById(id) {
  const repo = getUserRepo();
  const user = await repo.findOne({ where: { id } });
  if (!user) {
    throw notFound("User not found");
  }
  return user;
}

module.exports = {
  createUser,
  validateCredentials,
  getUserById
};
