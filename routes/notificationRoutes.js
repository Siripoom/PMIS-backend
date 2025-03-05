const express = require("express");
const { createNotification, getUserNotifications, markAsRead } = require("../controllers/notificationController");
const { authenticateToken } = require("../middlewares/authMiddleware");
const { logAction } = require("../middlewares/logMiddleware");

const router = express.Router();

// ✅ เรียก `authenticateToken` ก่อน เพื่อให้ `req.user` มีค่า
router.post("/", authenticateToken, createNotification, logAction("สร้างการแจ้งเตือน"));
router.get("/:user_id", authenticateToken, getUserNotifications, logAction("ดึงรายการแจ้งเตือนของผู้ใช้"));
router.patch("/:notification_id/read", authenticateToken, markAsRead, logAction("เปลี่ยนสถานะการแจ้งเตือนเป็น อ่านแล้ว"));

module.exports = router;
