const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const sequelize = require("./config/dbConfig");

// ✅ โหลด environment variables
dotenv.config();

// ✅ Import Models ที่นี่เพื่อให้ Sequelize โหลดก่อน sync
require("./models/projectModel");
require("./models/progressModel");
require("./models/projectResourceModel");
require("./models/resourceModel");
require("./models/userModel");
require("./models/reportModel");
require("./models/logModel");
require("./models/budgetModel");
require("./models/notificationModel");

// ✅ เรียกฟังก์ชันกำหนดความสัมพันธ์
const defineRelationships = require("./models/relation");
defineRelationships();

// ✅ Import Routes
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const progressRoutes = require("./routes/progressRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const projectResourceRoutes = require("./routes/projectResourceRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const reportRoutes = require("./routes/reportRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

// Create an Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Configure CORS for production
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// ✅ Middleware
app.use(express.json());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/resource", resourceRoutes);
app.use("/api/projectResource", projectResourceRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/notifications", notificationRoutes);

// Simple route for testing
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the Production System API",
    environment: process.env.NODE_ENV || "development",
    version: "1.0.0",
  });
});

// Health check endpoint for Railway
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

// ✅ Sync Database และรันเซิร์ฟเวอร์
const syncOptions =
  process.env.NODE_ENV === "production" ? {} : { alter: true };

sequelize
  .sync(syncOptions)
  .then(() => {
    console.log("✅ Database synchronized...");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Unable to sync database:", err.message);
  });

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
});
