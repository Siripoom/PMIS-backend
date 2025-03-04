const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const sequelize = require("./config/dbConfig");

// ✅ โหลด environment variables
dotenv.config();

// ✅ Import Models ที่นี่เพื่อให้ Sequelize โหลดก่อน sync
require("./models/projectModel");
require("./models/progressModel");
require("./models/ProjectResourceModel");
require("./models/resourceModel");
require("./models/userModel");
require("./models/reportModel");
require("./models/logModel"); 
require("./models/budgetModel");
require("./models/notificationModel");

// ✅ Import Routes
const authRoutes = require("./routes/authRoutes"); 
const projectRoutes = require("./routes/projectRoutes");
const progressRoutes = require("./routes/progressRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const projectResourceRoutes = require("./routes/projectResourceRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const reportRoutes = require("./routes/reportRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

// Load environment variables
dotenv.config();

// Create an Express app
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// ✅ Middleware
app.use(express.json()); 

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/resource", resourceRoutes);
app.use("/api/projectResourceRoutes", projectResourceRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/notifications", notificationRoutes);

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
