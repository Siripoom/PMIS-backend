const { createLog } = require("../controllers/logController");

const logAction = (action) => {
  return async (req, res, next) => {
    console.log("📌 logAction Middleware ถูกเรียกใช้: ", action);
    console.log("📌 req.user: ", req.user);

    // 🔹 แก้ไขให้ req.user เป็น plain JSON
    const userId = req.user?.dataValues?.user_id || req.user?.id;

    if (userId) {
      await createLog(userId, action, req);
      console.log("✅ Log ถูกบันทึกในฐานข้อมูล");
    } else {
      console.warn("⚠️ ไม่มีข้อมูล req.user, Log ไม่ถูกบันทึก");
    }
    next();
  };
};

module.exports = { logAction };
