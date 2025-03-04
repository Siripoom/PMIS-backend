const express = require("express");
const { generateReport, getReports } = require("../controllers/reportController"); // ✅ ตรวจสอบว่ามีการ import getReports
const { logAction } = require("../middlewares/logMiddleware");

const router = express.Router();

router.post("/", logAction("สร้างรายงาน"),generateReport); // ✅ สร้างรายงาน
router.get("/", logAction("ดึงข้อมูลรายงาน"),getReports); // ✅ ดึงข้อมูลรายงาน

module.exports = router;
