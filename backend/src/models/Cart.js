// Cart.js
const { EntitySchema } = require("typeorm");
const { getTimestampColumnType } = require("../utils/dbTypeHelpers");

module.exports = new EntitySchema({
  name: "Cart",
  tableName: "carts",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid"
    },
    status: {
      type: "varchar",
      length: 20,
      default: "ACTIVE"
    },
    subtotal: {
      type: "decimal",
      precision: 10,
      scale: 2,
      default: 0
    },
    total: {
      type: "decimal",
      precision: 10,
      scale: 2,
      default: 0
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
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: {
        name: "user_id"
      },
      nullable: false
    },
    items: {
      type: "one-to-many",
      target: "CartItem",
      inverseSide: "cart",
      cascade: true
    },
    order: {
      type: "one-to-one",
      target: "Order",
      inverseSide: "cart"
    }
  }
});
