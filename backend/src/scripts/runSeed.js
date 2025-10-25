const { randomUUID } = require("crypto");
const bcrypt = require("bcrypt");
require("../config/env");
const { AppDataSource } = require("../config/data-source");

async function run() {
  try {
    console.log("Initializing data source for seeding...");
    await AppDataSource.initialize();
    const dbType = AppDataSource.options.type;
    console.log(`Data source initialized using driver: ${dbType}. Seeding database...`);

    const disableForeignKeys = async () => {
      if (dbType === "mysql") {
        await AppDataSource.query("SET FOREIGN_KEY_CHECKS = 0");
      } else if (dbType === "sqlite") {
        await AppDataSource.query("PRAGMA foreign_keys = OFF");
      }
    };

    const enableForeignKeys = async () => {
      if (dbType === "mysql") {
        await AppDataSource.query("SET FOREIGN_KEY_CHECKS = 1");
      } else if (dbType === "sqlite") {
        await AppDataSource.query("PRAGMA foreign_keys = ON");
      }
    };

    const orderItemRepo = AppDataSource.getRepository("OrderItem");
    const orderRepo = AppDataSource.getRepository("Order");
    const cartItemRepo = AppDataSource.getRepository("CartItem");
    const cartRepo = AppDataSource.getRepository("Cart");
    const productRepo = AppDataSource.getRepository("Product");
    const categoryRepo = AppDataSource.getRepository("Category");
    const userRepo = AppDataSource.getRepository("User");

    await disableForeignKeys();

    await orderItemRepo.clear();
    await orderRepo.clear();
    await cartItemRepo.clear();
    await cartRepo.clear();
    await productRepo.clear();
    await categoryRepo.clear();
    await userRepo.clear();

    await enableForeignKeys();

    const categoriesConfig = [
      { key: "mobiles", name: "Mobiles", description: "Smartphones and tablets." },
      { key: "laptops", name: "Laptops", description: "Portable and powerful notebooks." },
      { key: "audio", name: "Audio", description: "Headphones, earbuds, and speakers." },
      { key: "wearables", name: "Wearables", description: "Smart watches and fitness trackers." },
      { key: "accessories", name: "Accessories", description: "Peripherals and add-ons." }
    ];

    const categoryIds = {};
    for (const category of categoriesConfig) {
      const id = randomUUID();
      categoryIds[category.key] = id;
      await AppDataSource.query(
        "INSERT INTO categories (id, name, description) VALUES (?, ?, ?)",
        [id, category.name, category.description]
      );
    }

    const IMAGE_BASE = "/images";

    const productsConfig = [
      {
        name: "iPhone 15 Pro",
        slug: "iphone-15-pro",
        description: "Apple smartphone with A17 Pro chip.",
        price: "1299.99",
        stock: 10,
        categoryKey: "mobiles",
        image: `${IMAGE_BASE}/iphone15pro.jpg`
      },
      {
        name: "Samsung Galaxy S24",
        slug: "samsung-galaxy-s24",
        description: "Flagship Android device with AMOLED display.",
        price: "1199.99",
        stock: 15,
        categoryKey: "mobiles",
        image: `${IMAGE_BASE}/galaxys24.jpg`
      },
      {
        name: "MacBook Air M3",
        slug: "macbook-air-m3",
        description: "Lightweight laptop with Apple M3 chip.",
        price: "1699.00",
        stock: 8,
        categoryKey: "laptops",
        image: `${IMAGE_BASE}/macbookairm3.jpg`
      },
      {
        name: "Dell XPS 13",
        slug: "dell-xps-13",
        description: "High-end Windows ultrabook.",
        price: "1599.00",
        stock: 12,
        categoryKey: "laptops",
        image: `${IMAGE_BASE}/dellxps13.jpg`
      },
      {
        name: "Sony WH-1000XM5",
        slug: "sony-wh-1000xm5",
        description: "Noise-cancelling wireless headphones.",
        price: "399.99",
        stock: 20,
        categoryKey: "audio",
        image: `${IMAGE_BASE}/sonywh1000xm5.jpg`
      },
      {
        name: "AirPods Pro 2",
        slug: "airpods-pro-2",
        description: "Apple earbuds with active noise cancellation.",
        price: "249.99",
        stock: 30,
        categoryKey: "audio",
        image: `${IMAGE_BASE}/airpodspro2.jpg`
      },
      {
        name: "Apple Watch Ultra 2",
        slug: "apple-watch-ultra-2",
        description: "Premium smartwatch with GPS and cellular.",
        price: "799.00",
        stock: 18,
        categoryKey: "wearables",
        image: `${IMAGE_BASE}/applewatchultra2.jpg`
      },
      {
        name: "Fitbit Charge 6",
        slug: "fitbit-charge-6",
        description: "Fitness tracker with heart-rate monitoring.",
        price: "199.00",
        stock: 25,
        categoryKey: "wearables",
        image: `${IMAGE_BASE}/fitbitcharge6.jpg`
      },
      {
        name: "Logitech MX Master 3S",
        slug: "logitech-mx-master-3s",
        description: "Ergonomic wireless mouse.",
        price: "129.00",
        stock: 40,
        categoryKey: "accessories",
        image: `${IMAGE_BASE}/mxmaster3s.jpg`
      },
      {
        name: "Razer BlackWidow V4",
        slug: "razer-blackwidow-v4",
        description: "Mechanical gaming keyboard.",
        price: "179.99",
        stock: 35,
        categoryKey: "accessories",
        image: `${IMAGE_BASE}/razerblackwidowv4.jpg`
      },
      {
        name: "Webcam HD",
        slug: "webcam-hd",
        description: "1080p HD webcam with microphone.",
        price: "49.99",
        stock: 40,
        categoryKey: "accessories",
        image: `${IMAGE_BASE}/mxmaster3s.jpg`
      }
    ];

    for (const product of productsConfig) {
      const imageValue = (product.imageUrl ?? product.image) ?? null;
      await AppDataSource.query(
        "INSERT INTO products (id, name, slug, description, price, stock, category_id, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          randomUUID(),
          product.name,
          product.slug,
          product.description,
          product.price,
          product.stock,
          categoryIds[product.categoryKey],
          imageValue
        ]
      );
    }

    const adminPassword = "Password123!";
    const adminHash = await bcrypt.hash(adminPassword, 10);
    const adminId = randomUUID();

    await AppDataSource.query(
      "INSERT INTO users (id, username, email, password_hash, is_admin) VALUES (?, ?, ?, ?, ?)",
      [adminId, "admin", "admin@example.com", adminHash, 1]
    );

    console.log("Database has been successfully seeded.");
    console.log("🔐 Admin credentials => email: admin@example.com, password: Password123!");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

run();
