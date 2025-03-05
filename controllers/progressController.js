const Progress = require("../models/progressModel");
const Project = require("../models/projectModel");
const { createLog } = require("../controllers/logController"); // ✅ Import createLog

// ✅ บันทึกอัปเดตความคืบหน้าโครงการ
const addProgressUpdate = async (req, res) => {
  const { project_id, update_note, progress } = req.body;

  try {
    const project = await Project.findByPk(project_id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const newProgress = await Progress.create({
      project_id,
      update_note,
      progress,
      updated_by: req.user.id, // ✅ ดึงจาก Token อัตโนมัติ
    });

    // ✅ บันทึก Log การอัปเดตความคืบหน้า
    await createLog(req.user.id, `บันทึกความคืบหน้าโครงการ ${project_id}: ${progress}%`, req);

    res.status(201).json({ message: "Progress update added", progress: newProgress });
  } catch (err) {
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

    if (!latestProgress) {
      return res.status(404).json({ message: "No progress updates found" });
    }

    // ✅ บันทึก Log การดึงความคืบหน้าโครงการ
    await createLog(req.user.id, `ดึงเปอร์เซ็นต์ความคืบหน้าของโครงการ ${projectId}`, req);

    res.status(200).json({
      projectId,
      progressPercentage: latestProgress.progress,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { addProgressUpdate, getProjectProgress };
