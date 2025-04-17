const Log = require("../models/logModel");

const createLog = async (user_id, action, req) => {
    try {
      console.log(`📌 กำลังบันทึก Log: ${action} สำหรับ user_id: ${user_id}`);
      await Log.create({
        user_id,
        action,
        ip_address: req.ip,
        user_agent: req.headers["user-agent"],
      });
      console.log("✅ Log บันทึกสำเร็จ");
    } catch (error) {
      console.error("❌ Error logging action:", error);
    }
  };
  

module.exports = { createLog };
