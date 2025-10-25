function getTimestampColumnType() {
  const currentDbType = (process.env.DB_TYPE || "mysql").toLowerCase();
  return currentDbType === "sqlite" ? "datetime" : "timestamp";
}

module.exports = {
  getTimestampColumnType
};
