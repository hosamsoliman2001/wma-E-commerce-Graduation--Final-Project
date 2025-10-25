const { Table, TableForeignKey, TableIndex } = require("typeorm");

module.exports = class InitSchema1700000000000 {
  name = "InitSchema1700000000000";

  async up(queryRunner) {
    await queryRunner.createTable(
      new Table({
        name: "users",
        columns: [
          {
            name: "id",
            type: "varchar",
            length: "36",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "uuid"
          },
          {
            name: "username",
            type: "varchar",
            length: "100",
            isUnique: true
          },
          {
            name: "email",
            type: "varchar",
            length: "255",
            isUnique: true
          },
          {
            name: "password_hash",
            type: "varchar",
            length: "255"
          },
          {
            name: "is_admin",
            type: "boolean",
            default: false
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP"
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP"
          }
        ]
      })
    );

    await queryRunner.createTable(
      new Table({
        name: "categories",
        columns: [
          {
            name: "id",
            type: "varchar",
            length: "36",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "uuid"
          },
          {
            name: "name",
            type: "varchar",
            length: "150",
            isUnique: true
          },
          {
            name: "description",
            type: "text",
            isNullable: true
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP"
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP"
          }
        ]
      })
    );

    await queryRunner.createTable(
      new Table({
        name: "products",
        columns: [
          {
            name: "id",
            type: "varchar",
            length: "36",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "uuid"
          },
          {
            name: "name",
            type: "varchar",
            length: "200",
            isUnique: true
          },
          {
            name: "slug",
            type: "varchar",
            length: "255",
            isUnique: true
          },
          {
            name: "description",
            type: "text",
            isNullable: true
          },
          {
            name: "price",
            type: "decimal",
            precision: 10,
            scale: 2
          },
          {
            name: "stock",
            type: "int",
            default: 0
          },
          {
            name: "image",
            type: "text",
            isNullable: true
          },
          {
            name: "category_id",
            type: "varchar",
            length: "36"
          },
          {
            name: "deleted_at",
            type: "timestamp",
            isNullable: true
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP"
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP"
          }
        ]
      })
    );

    await queryRunner.createTable(
      new Table({
        name: "carts",
        columns: [
          {
            name: "id",
            type: "varchar",
            length: "36",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "uuid"
          },
          {
            name: "user_id",
            type: "varchar",
            length: "36"
          },
          {
            name: "status",
            type: "varchar",
            length: "20",
            default: "'ACTIVE'"
          },
          {
            name: "subtotal",
            type: "decimal",
            precision: 10,
            scale: 2,
            default: 0
          },
          {
            name: "total",
            type: "decimal",
            precision: 10,
            scale: 2,
            default: 0
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP"
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP"
          }
        ]
      })
    );

    await queryRunner.createTable(
      new Table({
        name: "cart_items",
        columns: [
          {
            name: "id",
            type: "varchar",
            length: "36",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "uuid"
          },
          {
            name: "cart_id",
            type: "varchar",
            length: "36"
          },
          {
            name: "product_id",
            type: "varchar",
            length: "36"
          },
          {
            name: "quantity",
            type: "int",
            default: 1
          },
          {
            name: "unit_price",
            type: "decimal",
            precision: 10,
            scale: 2
          },
          {
            name: "total_price",
            type: "decimal",
            precision: 10,
            scale: 2
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP"
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP"
          }
        ]
      })
    );

    await queryRunner.createTable(
      new Table({
        name: "orders",
        columns: [
          {
            name: "id",
            type: "varchar",
            length: "36",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "uuid"
          },
          {
            name: "user_id",
            type: "varchar",
            length: "36"
          },
          {
            name: "cart_id",
            type: "varchar",
            length: "36",
            isUnique: true
          },
          {
            name: "status",
            type: "varchar",
            length: "20",
            default: "'PENDING'"
          },
          {
            name: "subtotal",
            type: "decimal",
            precision: 10,
            scale: 2
          },
          {
            name: "tax",
            type: "decimal",
            precision: 10,
            scale: 2,
            default: 0
          },
          {
            name: "total",
            type: "decimal",
            precision: 10,
            scale: 2
          },
          {
            name: "payment_ref",
            type: "varchar",
            length: "255",
            isNullable: true
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP"
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP"
          }
        ]
      })
    );

    await queryRunner.createTable(
      new Table({
        name: "order_items",
        columns: [
          {
            name: "id",
            type: "varchar",
            length: "36",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "uuid"
          },
          {
            name: "order_id",
            type: "varchar",
            length: "36"
          },
          {
            name: "product_id",
            type: "varchar",
            length: "36"
          },
          {
            name: "quantity",
            type: "int",
            default: 1
          },
          {
            name: "unit_price",
            type: "decimal",
            precision: 10,
            scale: 2
          },
          {
            name: "total_price",
            type: "decimal",
            precision: 10,
            scale: 2
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP"
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP"
          }
        ]
      })
    );

    await queryRunner.createForeignKey(
      "products",
      new TableForeignKey({
        name: "FK_product_category",
        columnNames: ["category_id"],
        referencedTableName: "categories",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE"
      })
    );

    await queryRunner.createForeignKey(
      "carts",
      new TableForeignKey({
        name: "FK_cart_user",
        columnNames: ["user_id"],
        referencedTableName: "users",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE"
      })
    );

    await queryRunner.createForeignKey(
      "cart_items",
      new TableForeignKey({
        name: "FK_cart_items_cart",
        columnNames: ["cart_id"],
        referencedTableName: "carts",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE"
      })
    );

    await queryRunner.createForeignKey(
      "cart_items",
      new TableForeignKey({
        name: "FK_cart_items_product",
        columnNames: ["product_id"],
        referencedTableName: "products",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE"
      })
    );

    await queryRunner.createForeignKey(
      "orders",
      new TableForeignKey({
        name: "FK_order_user",
        columnNames: ["user_id"],
        referencedTableName: "users",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE"
      })
    );

    await queryRunner.createForeignKey(
      "orders",
      new TableForeignKey({
        name: "FK_order_cart",
        columnNames: ["cart_id"],
        referencedTableName: "carts",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE"
      })
    );

    await queryRunner.createForeignKey(
      "order_items",
      new TableForeignKey({
        name: "FK_order_items_order",
        columnNames: ["order_id"],
        referencedTableName: "orders",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE"
      })
    );

    await queryRunner.createForeignKey(
      "order_items",
      new TableForeignKey({
        name: "FK_order_items_product",
        columnNames: ["product_id"],
        referencedTableName: "products",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE"
      })
    );

    await queryRunner.createIndex(
      "carts",
      new TableIndex({
        name: "IDX_cart_user",
        columnNames: ["user_id"]
      })
    );

    await queryRunner.createIndex(
      "cart_items",
      new TableIndex({
        name: "IDX_cart_items_cart_product",
        columnNames: ["cart_id", "product_id"]
      })
    );

    await queryRunner.createIndex(
      "orders",
      new TableIndex({
        name: "IDX_order_user",
        columnNames: ["user_id"]
      })
    );

    await queryRunner.createIndex(
      "order_items",
      new TableIndex({
        name: "IDX_order_items_order",
        columnNames: ["order_id"]
      })
    );
  }

  async down(queryRunner) {
    await queryRunner.dropIndex("order_items", "IDX_order_items_order");
    await queryRunner.dropIndex("orders", "IDX_order_user");
    await queryRunner.dropIndex("cart_items", "IDX_cart_items_cart_product");
    await queryRunner.dropIndex("carts", "IDX_cart_user");

    await queryRunner.dropForeignKey("order_items", "FK_order_items_product");
    await queryRunner.dropForeignKey("order_items", "FK_order_items_order");
    await queryRunner.dropForeignKey("orders", "FK_order_cart");
    await queryRunner.dropForeignKey("orders", "FK_order_user");
    await queryRunner.dropForeignKey("cart_items", "FK_cart_items_product");
    await queryRunner.dropForeignKey("cart_items", "FK_cart_items_cart");
    await queryRunner.dropForeignKey("carts", "FK_cart_user");
    await queryRunner.dropForeignKey("products", "FK_product_category");

    await queryRunner.dropTable("order_items");
    await queryRunner.dropTable("orders");
    await queryRunner.dropTable("cart_items");
    await queryRunner.dropTable("carts");
    await queryRunner.dropTable("products");
    await queryRunner.dropTable("categories");
    await queryRunner.dropTable("users");
  }
};
