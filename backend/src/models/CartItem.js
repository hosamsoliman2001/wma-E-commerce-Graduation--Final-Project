// CartItem.js
const { EntitySchema } = require("typeorm");
const { getTimestampColumnType } = require("../utils/dbTypeHelpers");

module.exports = new EntitySchema({
  name: "CartItem",
  tableName: "cart_items",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid"
    },
    quantity: {
      type: "int",
      default: 1
    },
    unitPrice: {
      name: "unit_price",
      type: "decimal",
      precision: 10,
      scale: 2
    },
    totalPrice: {
      name: "total_price",
      type: "decimal",
      precision: 10,
      scale: 2
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
    cart: {
      type: "many-to-one",
      target: "Cart",
      joinColumn: {
        name: "cart_id"
      },
      onDelete: "CASCADE",
      nullable: false
    },
    product: {
      type: "many-to-one",
      target: "Product",
      joinColumn: {
        name: "product_id"
      },
      nullable: false
    }
  }
});
