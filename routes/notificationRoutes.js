const express = require("express");
const { createNotification, getUserNotifications, markAsRead } = require("../controllers/notificationController");
const { logAction } = require("../middlewares/logMiddleware");

const router = express.Router();

// ✅ สร้างการแจ้งเตือน
router.post("/",  logAction("สร้างการแจ้งเตือน"),createNotification);

// ✅ ดึงรายการแจ้งเตือนของผู้ใช้
router.get("/:user_id",  logAction("ดึงรายการแจ้งเตือนของผู้ใช้"),getUserNotifications);

// ✅ เปลี่ยนสถานะการแจ้งเตือนเป็น "อ่านแล้ว"
router.patch("/:notification_id/read",  logAction("เปลี่ยนสถานะการแจ้งเตือนเป็น อ่านแล้ว"),markAsRead);

module.exports = router;
