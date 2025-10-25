const { EntitySchema } = require("typeorm");
const { getTimestampColumnType } = require("../utils/dbTypeHelpers");

module.exports = new EntitySchema({
  name: "OrderItem",
  tableName: "order_items",
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
    order: {
      type: "many-to-one",
      target: "Order",
      joinColumn: {
        name: "order_id"
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
