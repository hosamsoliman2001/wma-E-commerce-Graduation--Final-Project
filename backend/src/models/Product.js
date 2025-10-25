// Product.js
const { EntitySchema } = require("typeorm");
const { getTimestampColumnType } = require("../utils/dbTypeHelpers");

module.exports = new EntitySchema({
  name: "Product",
  tableName: "products",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid"
    },
    name: {
      type: "varchar",
      length: 200,
      unique: true
    },
    slug: {
      type: "varchar",
      length: 255,
      unique: true
    },
    description: {
      type: "text",
      nullable: true
    },
    image: {
      type: "text",
      nullable: true
    },
    price: {
      type: "decimal",
      precision: 10,
      scale: 2
    },
    stock: {
      type: "int",
      default: 0
    },
    deletedAt: {
      name: "deleted_at",
      type: getTimestampColumnType(),
      nullable: true,
      deleteDate: true
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
    category: {
      type: "many-to-one",
      target: "Category",
      joinColumn: {
        name: "category_id"
      },
      nullable: false
    },
    cartItems: {
      type: "one-to-many",
      target: "CartItem",
      inverseSide: "product"
    },
    orderItems: {
      type: "one-to-many",
      target: "OrderItem",
      inverseSide: "product"
    }
  }
});
