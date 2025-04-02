const { v4: uuidv4 } = require("uuid"); // ✅ ใช้ uuidv4
const Notification = require("../models/notificationModel");
const User = require("../models/userModel");
const { createLog } = require("../controllers/logController");
const { Op } = require("sequelize");

// ✅ ฟังก์ชันสร้างการแจ้งเตือน (แก้ไขให้ `notification_id` ใช้ UUID v4)
const createNotification = async (req, res) => {
  try {
    const { user_id, title, message, type, action_url, icon } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: "❌ ต้องระบุ user_id" });
    }

    const user = await User.findByPk(user_id);
    if (!user) return res.status(404).json({ message: "❌ ไม่พบผู้ใช้งาน" });

    const notification = await Notification.create({
      notification_id: uuidv4(), // ✅ ใช้ UUID v4
      user_id,
      title,
      message,
      type,
      action_url,
      icon,
      status: "Unread",
    });

    if (req.user && req.user.id) {
      await createLog(req.user.id, `สร้างการแจ้งเตือน: ${title}`, req);
    }

    res.status(201).json({ message: "✅ สร้างการแจ้งเตือนสำเร็จ", notification });
  } catch (error) {
    console.error("❌ Error creating notification:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ ฟังก์ชันดึงรายการแจ้งเตือนของผู้ใช้
const getUserNotifications = async (req, res) => {
  try {
    const { user_id } = req.params;

    // ✅ ตรวจสอบว่า user_id เป็น UUID หรือไม่
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(user_id)) {
      return res.status(400).json({ message: "❌ user_id ต้องเป็น UUID เท่านั้น" });
    }

    // ดึงการแจ้งเตือนของผู้ใช้
    const notifications = await Notification.findAll({
      where: { user_id },
      order: [["created_at", "DESC"]],
    });

    // ดึงชื่อของผู้ใช้จาก user_id
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: "❌ ไม่พบผู้ใช้งาน" });
    }

    // เพิ่มชื่อของผู้ใช้ไปในแต่ละการแจ้งเตือน
    const notificationsWithUserName = notifications.map(notification => ({
      ...notification.toJSON(),
      user_name: user.name, // เพิ่มชื่อผู้ใช้
    }));

    res.status(200).json({ message: "✅ ดึงการแจ้งเตือนของผู้ใช้สำเร็จ", notifications: notificationsWithUserName });
  } catch (error) {
    console.error("❌ Error fetching user notifications:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ ฟังก์ชันเปลี่ยนสถานะการแจ้งเตือนเป็น "อ่านแล้ว"
const markAsRead = async (req, res) => {
  try {
    const { notification_id } = req.params;

    if (!notification_id) {
      return res.status(400).json({ message: "❌ ต้องระบุ notification_id" });
    }

    const notification = await Notification.findByPk(notification_id);
    if (!notification) return res.status(404).json({ message: "❌ ไม่พบการแจ้งเตือน" });

    notification.status = "Read";
    await notification.save();

    if (req.user && req.user.id) {
      await createLog(req.user.id, "เปลี่ยนสถานะการแจ้งเตือนเป็น อ่านแล้ว", req);
    }

    res.status(200).json({ message: "✅ อัปเดตสถานะเป็นอ่านแล้ว", notification });
  } catch (error) {
    console.error("❌ Error marking notification as read:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ ฟังก์ชันลบการแจ้งเตือน
const deleteNotification = async (req, res) => {
  try {
    const { notification_id } = req.params;

    if (!notification_id) {
      return res.status(400).json({ message: "❌ ต้องระบุ notification_id" });
    }

    const notification = await Notification.findByPk(notification_id);
    if (!notification) return res.status(404).json({ message: "❌ ไม่พบการแจ้งเตือน" });

    await notification.destroy();

    if (req.user && req.user.id) {
      await createLog(req.user.id, "ลบการแจ้งเตือน", req);
    }

    res.status(200).json({ message: "✅ ลบการแจ้งเตือนสำเร็จ" });
  } catch (error) {
    console.error("❌ Error deleting notification:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ ฟังก์ชันสร้างการแจ้งเตือนอัตโนมัติจาก Controller อื่น ๆ
const sendAutoNotification = async (user_id, title, message, type, action_url, icon) => {
  try {
    // ถ้าไม่มี user_id ให้ใช้ UUID เริ่มต้น
    const target_user_id = user_id || "00000000-0000-0000-0000-000000000000";

    const notification = await Notification.create({
      notification_id: uuidv4(), // ✅ ใช้ UUID v4
      user_id: target_user_id,
      title,
      message,
      type,
      action_url,
      icon,
      status: "Unread",
    });

    console.log("✅ Notification Sent:", notification);
  } catch (error) {
    console.error("❌ Error sending notification:", error);
  }
};

const getAllNotifications = async (req, res) => {
  try {
    // ดึงการแจ้งเตือนทั้งหมดจากฐานข้อมูล
    const notifications = await Notification.findAll({
      order: [["created_at", "DESC"]], // เรียงตามเวลาล่าสุด
    });

    // เพิ่มชื่อของผู้ใช้ไปในแต่ละการแจ้งเตือน
    const notificationsWithUserName = await Promise.all(
      notifications.map(async (notification) => {
        // ตรวจสอบว่า user_id เป็น UUID หรือไม่
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(notification.user_id)) {
          console.log(`❌ Invalid user_id: ${notification.user_id}`);
          return {
            ...notification.toJSON(),
            user_name: "ไม่พบชื่อผู้ใช้", // หาก user_id ไม่ถูกต้อง
          };
        }

        // ดึงข้อมูลผู้ใช้จากฐานข้อมูลตาม user_id
        const user = await User.findByPk(notification.user_id);
        console.log("User Data:", user);  // เพิ่มการตรวจสอบข้อมูล user

        if (!user) {
          console.log(`❌ User not found for user_id: ${notification.user_id}`);
          return {
            ...notification.toJSON(),
            user_name: "ไม่พบชื่อผู้ใช้", // หากไม่พบผู้ใช้
          };
        }

        // ส่งคืนข้อมูลการแจ้งเตือนพร้อมชื่อผู้ใช้
        return {
          ...notification.toJSON(),
          user_name: user.username, // เปลี่ยนจาก user.name เป็น user.username
        };
      })
    );

    // ส่งข้อมูลการแจ้งเตือนที่มีชื่อผู้ใช้ไปยัง client
    res.status(200).json({ message: "✅ ดึงข้อมูลการแจ้งเตือนสำเร็จ", notifications: notificationsWithUserName });
  } catch (error) {
    console.error("❌ Error fetching notifications:", error);
    res.status(500).json({ error: error.message });
  }
};




module.exports = { createNotification, getUserNotifications, markAsRead, deleteNotification, sendAutoNotification, getAllNotifications };
