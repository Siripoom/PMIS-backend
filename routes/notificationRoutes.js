const express = require("express");
const { createNotification, getUserNotifications, markAsRead } = require("../controllers/notificationController");

const router = express.Router();

// ✅ สร้างการแจ้งเตือน
router.post("/",  createNotification);

// ✅ ดึงรายการแจ้งเตือนของผู้ใช้
router.get("/:user_id",  getUserNotifications);

// ✅ เปลี่ยนสถานะการแจ้งเตือนเป็น "อ่านแล้ว"
router.patch("/:notification_id/read",  markAsRead);

module.exports = router;
