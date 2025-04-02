'use strict';

const express = require("express");
const Sequelize = require("sequelize");
const config = require("../config/config.json")["development"];

// ✅ เชื่อมต่อกับ PostgreSQL ผ่าน Sequelize
const sequelize = new Sequelize(config.database, config.username, config.password, config);

const db = {};

// ✅ นำเข้าโมเดลทั้งหมด
db.User = require("./userModel");
db.Project = require("./projectModel");
db.Report = require("./reportModel");
db.Budget = require("./budgetModel");
db.Progress = require("./progressModel");
db.Resource = require("./resourceModel");
db.ProjectResource = require("./ProjectResourceModel");
db.Notification = require("./notificationModel");

// ✅ กำหนดความสัมพันธ์
const defineRelationships = require("./relation");
defineRelationships();

// ✅ ซิงค์ฐานข้อมูลหลังจากกำหนดความสัมพันธ์
sequelize.sync({ alter: true }).then(() => {
    console.log("✅ Database schema updated!");
}).catch((err) => {
    console.error("❌ Error syncing database:", err);
});

// ✅ สร้าง Express App
const app = express();
app.use(express.json());

// ✅ นำเข้า Routes
const reportRoutes = require("./routes/reportRoutes");
app.use("/api/reports", reportRoutes);

// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

module.exports = db;
