const express = require("express");
const { generateReport, getReports } = require("../controllers/reportController"); // ✅ ตรวจสอบว่ามีการ import getReports

const router = express.Router();

router.post("/", generateReport); // ✅ สร้างรายงาน
router.get("/", getReports); // ✅ ดึงข้อมูลรายงาน

module.exports = router;
