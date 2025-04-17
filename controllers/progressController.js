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
  const { projectId } = req.params;

  try {
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const latestProgress = await Progress.findOne({
      where: { project_id: projectId },
      order: [["createdAt", "DESC"]],
    });

    // ✅ ตรวจสอบหากโครงการยังไม่มี Progress
    if (!latestProgress) {
      return res.status(200).json({
        projectId,
        progressPercentage: 0, // ✅ หากไม่มีความคืบหน้า ให้คืนค่าเป็น 0%
        message: "No progress updates found",
      });
    }

    // ✅ บันทึก Log การดึงความคืบหน้าโครงการ
    if (req.user && req.user.id) {
      await createLog(req.user.id, `ดึงเปอร์เซ็นต์ความคืบหน้าของโครงการ ${projectId}`, req);
    }

    res.status(200).json({
      projectId,
      progressPercentage: latestProgress.progress,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { addProgressUpdate, getProjectProgress, sendAutoNotification };
