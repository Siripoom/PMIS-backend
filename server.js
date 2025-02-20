// Import modules
const express = require("express");
const dotenv = require("dotenv");
const sequelize = require("./config/dbConfig");
const authRoutes = require("./routes/authRoutes"); // ✅ นำเข้า authRoutes
const cors = require("cors");
const projectRoutes = require("./routes/projectRoutes");
const progressRoutes = require("./routes/progressRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const resourceUsageRoutes = require("./routes/resourceUsageRoutes");

// Load environment variables
dotenv.config();

// Create an Express app
const app = express();
const PORT = 3000;

app.use(cors());

// Middleware
app.use(express.json()); // ✅ รองรับ JSON Body

// ✅ ใช้ route /auth สำหรับ register และ login
app.use("/api/auth", authRoutes);

app.use("/api/projects", projectRoutes);

app.use("/api/progress", progressRoutes);

app.use("/api/resource", resourceRoutes);

app.use("/api/resource-usage", resourceUsageRoutes);

// Simple route for testing
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the Production System API" });
});

// ✅ Sync Database และรันเซิร์ฟเวอร์
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("✅ Database synchronized...");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Unable to sync database:", err.message);
  });
