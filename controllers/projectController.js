const { Sequelize } = require("sequelize");
const Project = require("../models/projectModel");
const User = require("../models/userModel");
const { createLog } = require("../controllers/logController");

// ✅ Create Project
const createProject = async (req, res) => {
  try {
    const { project_name, description, status, budget, start_date, end_date } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized: User information is missing" });
    }

    // ✅ สร้างโครงการ
    const newProject = await Project.create({
      project_name,
      description,
      status,
      budget,
      start_date: start_date ? new Date(start_date) : new Date(),
      end_date: end_date ? new Date(end_date) : null,
      created_by: req.user.id, // ✅ ใช้ user_id จาก req.user
    });

    // ✅ บันทึก Log การสร้างโครงการ
    await createLog(req.user.id, `สร้างโครงการ ${newProject.project_name}`, req);

    res.status(201).json({
      message: "Project created successfully",
      project: newProject,
    });

  } catch (err) {
    console.error("❌ Error creating project:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
};

// ✅ ฟังก์ชันดึงข้อมูลทุกโครงการ
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAll();
    
    // ✅ บันทึก Log การเรียกดูโครงการทั้งหมด
    await createLog(req.user.id, "ดูโครงการทั้งหมด", req);

    res.status(200).json({ total: projects.length, projects });
  } catch (err) {
    console.error("❌ Error fetching projects:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
};

// ✅ ฟังก์ชันดึงข้อมูลโครงการตาม ID
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // ✅ บันทึก Log การเข้าถึงโครงการ
    await createLog(req.user.id, `ดูโครงการ ${project.project_name}`, req);

    res.status(200).json({ project });
  } catch (err) {
    console.error("❌ Error fetching project:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
};

// ✅ Update Project
const updateProject = async (req, res) => {
  try {
    const { project_name, budget } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized: User information is missing" });
    }

    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    await project.update(req.body);

    // ✅ บันทึก Log การแก้ไขโครงการ
    await createLog(req.user.id, `แก้ไขโครงการ ${project.project_name}`, req);

    res.status(200).json({ message: "Project updated successfully", project });

  } catch (err) {
    console.error("❌ Error updating project:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
};

// ✅ Delete Project
const deleteProject = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized: User information is missing" });
    }

    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    await project.destroy();

    // ✅ บันทึก Log การลบโครงการ
    await createLog(req.user.id, `ลบโครงการ ${project.project_name}`, req);

    res.status(200).json({ message: "Project deleted successfully" });

  } catch (err) {
    console.error("❌ Error deleting project:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
};

module.exports = { createProject, getAllProjects, getProjectById, updateProject, deleteProject };
