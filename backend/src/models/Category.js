// Category.js
const { EntitySchema } = require("typeorm");
const { getTimestampColumnType } = require("../utils/dbTypeHelpers");

module.exports = new EntitySchema({
  name: "Category",
  tableName: "categories",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid"
    },
    name: {
      type: "varchar",
      length: 150,
      unique: true
    },
    description: {
      type: "text",
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
    products: {
      type: "one-to-many",
      target: "Product",
      inverseSide: "category"
    }
  }
});
