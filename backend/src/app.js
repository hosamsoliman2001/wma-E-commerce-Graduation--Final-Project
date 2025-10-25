// app.js
const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");

require("./config/env");

const { apiLimiter } = require("./middleware/rateLimit");
const errorHandler = require("./middleware/errorHandler");
const swaggerSpec = require("./docs/swagger");

const FRONTEND_DIR = path.resolve(__dirname, "..", "..", "frontend");
const IMAGES_DIR = path.resolve(__dirname, "..", "images");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin"
    }
  })
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.static(FRONTEND_DIR));
app.use("/images", express.static(IMAGES_DIR));

app.use("/api/v1", apiLimiter);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/carts", cartRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/admin", adminRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use((req, res, next) => {
  if (
    req.method === "GET" &&
    !req.path.startsWith("/api/") &&
    !req.path.startsWith("/docs")
  ) {
    res.sendFile(path.join(FRONTEND_DIR, "index.html"));
    return;
  }
  next();
});

app.use(errorHandler);

module.exports = app;
