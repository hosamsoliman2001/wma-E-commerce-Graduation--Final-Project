// User.js
const { EntitySchema } = require("typeorm");
const { getTimestampColumnType } = require("../utils/dbTypeHelpers");

module.exports = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid"
    },
    username: {
      type: "varchar",
      length: 100,
      unique: true
    },
    email: {
      type: "varchar",
      length: 255,
      unique: true
    },
    passwordHash: {
      name: "password_hash",
      type: "varchar",
      length: 255
    },
    isAdmin: {
      name: "is_admin",
      type: "boolean",
      default: false
    },
    createdAt: {
      name: "created_at",
      type: getTimestampColumnType(),
      createDate: true
    },
    updatedAt: {
      name: "updated_at",
      type: getTimestampColumnType(),
      updateDate: true
    }
  },
  relations: {
    carts: {
      type: "one-to-many",
      target: "Cart",
      inverseSide: "user"
    },
    orders: {
      type: "one-to-many",
      target: "Order",
      inverseSide: "user"
    }
  }
});
