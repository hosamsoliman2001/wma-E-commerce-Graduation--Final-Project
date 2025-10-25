// Order.js
const { EntitySchema } = require("typeorm");
const { getTimestampColumnType } = require("../utils/dbTypeHelpers");

module.exports = new EntitySchema({
  name: "Order",
  tableName: "orders",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid"
    },
    status: {
      type: "varchar",
      length: 20,
      default: "PENDING"
    },
    subtotal: {
      type: "decimal",
      precision: 10,
      scale: 2
    },
    tax: {
      type: "decimal",
      precision: 10,
      scale: 2,
      default: 0
    },
    total: {
      type: "decimal",
      precision: 10,
      scale: 2
    },
    paymentRef: {
      name: "payment_ref",
      type: "varchar",
      length: 255,
      nullable: true
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
    cart: {
      type: "one-to-one",
      target: "Cart",
      joinColumn: {
        name: "cart_id"
      },
      nullable: false
    },
    items: {
      type: "one-to-many",
      target: "OrderItem",
      inverseSide: "order",
      cascade: true
    }
  }
});
