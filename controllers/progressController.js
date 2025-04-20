const Progress = require("../models/progressModel");
const Project = require("../models/projectModel");
const { createLog } = require("../controllers/logController"); // ✅ Import createLog
const { sendAutoNotification } = require("../controllers/notificationController"); // ✅ Import sendAutoNotification

// ✅ บันทึกอัปเดตความคืบหน้าโครงการ
const addProgressUpdate = async (req, res) => {
  const { project_id, update_note, progress } = req.body;

  try {
    const progressValue = Number(progress);
    if (isNaN(progressValue) || progressValue < 0 || progressValue > 100) {
      return res.status(400).json({ message: "ค่าความคืบหน้าต้องเป็นตัวเลขระหว่าง 0-100" });
    }

    const project = await Project.findByPk(project_id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // ✅ ปรับให้ updated_by เป็น UUID หรือ NULL
    const updatedBy = req.user && req.user.id ? req.user.id : null;

    const newProgress = await Progress.create({
      project_id,
      update_note,
      progress: progressValue,
      updated_by: updatedBy, // ✅ ป้องกันการส่ง "system" แทน UUID
    });

    res.status(201).json({ message: "Progress update added", progress: newProgress });

  } catch (err) {
    console.error("❌ Error updating project progress:", err);
    res.status(500).json({ error: err.message });
  }
};


// ✅ ดึงเปอร์เซ็นต์ความคืบหน้าโครงการ
const getProjectProgress = async (req, res) => {
  try {
    const { role, user_id, projectId } = req.query; // ดึงค่า role, user_id, projectId จาก query param

    let projectProgress;

    if (role === "admin") {
      // Admin สามารถดูความคืบหน้าทุกโครงการ
      projectProgress = await Progress.findAll({
        where: { project_id: projectId },
      });
    } else if (role === "manager") {
      // Manager ดูความคืบหน้าของโครงการที่ตนเองรับผิดชอบ
      projectProgress = await Progress.findAll({
        where: { project_id: projectId, updated_by: user_id },
      });
    } else if (role === "user") {
      // User ดูความคืบหน้าของโครงการที่ตนเองเกี่ยวข้อง
      projectProgress = await Progress.findAll({
        where: { project_id: projectId, updated_by: user_id },
      });
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    res.status(200).json({ projectProgress });
  } catch (err) {
    console.error("❌ Error fetching project progress:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
};

module.exports = { addProgressUpdate, getProjectProgress, sendAutoNotification };
