const Progress = require("../models/progressModel");
const Project = require("../models/projectModel");

// ✅ บันทึกอัปเดตความคืบหน้าโครงการ
const addProgressUpdate = async (req, res) => {
  const { projectId, updateText, progressPercentage } = req.body;

  try {
    // ตรวจสอบว่าโครงการมีอยู่จริงหรือไม่
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // บันทึกความคืบหน้า
    const newProgress = await Progress.create({
      projectId,
      updateText,
      progressPercentage,
      updatedBy: req.user.id, // ใช้ ID ของผู้ใช้ที่ล็อกอิน
    });

    res.status(201).json({ message: "Progress update added", progress: newProgress });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ ดึงเปอร์เซ็นต์ความคืบหน้าโครงการ
const getProjectProgress = async (req, res) => {
  const { projectId } = req.params;

  try {
    // ตรวจสอบว่าโครงการมีอยู่จริงหรือไม่
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // ดึงข้อมูลความคืบหน้าล่าสุดของโครงการ
    const latestProgress = await Progress.findOne({
      where: { projectId },
      order: [["createdAt", "DESC"]], // เรียงลำดับจากอัปเดตล่าสุด
    });

    if (!latestProgress) {
      return res.status(404).json({ message: "No progress updates found" });
    }

    res.status(200).json({
      projectId,
      progressPercentage: latestProgress.progressPercentage,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { addProgressUpdate, getProjectProgress };
