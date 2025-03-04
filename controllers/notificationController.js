const Notification = require("../models/notificationModel");
const User = require("../models/userModel");

//ตรวจสอบสถานะของโครงการ การเพิ่มลบแก้ไขของโครงการก่อนแล้วค่อยส่งข้อความแจ้งเตือน

// ✅ 1. ฟังก์ชันสร้างการแจ้งเตือน (ไม่มีการส่งอีเมล)
const createNotification = async (req, res) => {
  const { user_id, message } = req.body;

  console.log(user_id, message);
  try {
    // ตรวจสอบว่ามีผู้ใช้หรือไม่
    const user = await User.findByPk(user_id);
    if (!user) return res.status(404).json({ message: "ไม่พบผู้ใช้งาน" });

    // สร้างการแจ้งเตือนในฐานข้อมูล
    const notification = await Notification.create({ user_id, message });

    res.status(201).json({ message: "✅ สร้างการแจ้งเตือนสำเร็จ", notification });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ 2. ฟังก์ชันดึงรายการแจ้งเตือนของผู้ใช้
const getUserNotifications = async (req, res) => {
  const { user_id } = req.params;

  try {
    const notifications = await Notification.findAll({ where: { user_id } });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ 3. ฟังก์ชันเปลี่ยนสถานะการแจ้งเตือนเป็น "อ่านแล้ว"
const markAsRead = async (req, res) => {
  const { notification_id } = req.params;

  try {
    const notification = await Notification.findByPk(notification_id);
    if (!notification) return res.status(404).json({ message: "ไม่พบการแจ้งเตือน" });

    notification.status = "Read";
    await notification.save();

    res.status(200).json({ message: "✅ อัปเดตสถานะเป็นอ่านแล้ว", notification });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createNotification, getUserNotifications, markAsRead };
