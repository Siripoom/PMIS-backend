const express = require("express");
const { addProgressUpdate, getProjectProgress } = require("../controllers/progressController");
const { authenticateToken } = require("../middlewares/authMiddleware");
const { logAction } = require("../middlewares/logMiddleware");

const router = express.Router();

// ✅ ให้ `logAction()` ทำงานหลังจาก `addProgressUpdate()`
router.post("/", authenticateToken, addProgressUpdate, logAction("บันทึกความคืบหน้า")); 

// ✅ เพิ่ม `authenticateToken` ใน `getProjectProgress()`
router.get("/:projectId", authenticateToken, getProjectProgress, logAction("ดึงเปอร์เซ็นต์ความคืบหน้า"));

module.exports = router;
