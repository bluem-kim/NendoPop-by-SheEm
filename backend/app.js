const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

// Middlewares
app.use(express.json({ limit: "25mb" }));
app.use(cookieParser());
app.use(cors());

// Import routes
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const categoryRoutes = require("./routes/categories");
const userRoutes = require("./routes/users");
const orderRoutes = require("./routes/orders");
const reviewRoutes = require("./routes/reviews");

// Mount routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/reviews", reviewRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("API is running successfully");
});

module.exports = app;