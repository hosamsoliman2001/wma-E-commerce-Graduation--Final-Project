const blacklist = new Map();

function scheduleRemoval(token, expirationTime) {
  const delay = Math.max(expirationTime - Date.now(), 0);
  if (delay > 2147483647) {
    return;
  }
  setTimeout(() => {
    blacklist.delete(token);
  }, delay);
}

function add(token, exp) {
  let expirationTime;
  if (typeof exp === "number") {
    expirationTime = exp * 1000;
  } else {
    expirationTime = Date.now() + 24 * 60 * 60 * 1000;
  }
  blacklist.set(token, expirationTime);
  scheduleRemoval(token, expirationTime);
}

function isBlacklisted(token) {
  const expirationTime = blacklist.get(token);
  if (!expirationTime) {
    return false;
  }
  if (expirationTime <= Date.now()) {
    blacklist.delete(token);
    return false;
  }
  return true;
}

module.exports = {
  add,
  isBlacklisted
};
