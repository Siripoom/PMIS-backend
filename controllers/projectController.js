const { Sequelize } = require("sequelize"); // ✅ ใช้สำหรับ Query Database
const Project = require("../models/projectModel");
const User = require("../models/userModel");

// ✅ Create Project
const createProject = async (req, res) => {
  try {
    const { project_name, description, status, budget, start_date, end_date, username } = req.body;

    // ✅ ตรวจสอบว่ามีการส่ง username มาหรือไม่
    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    // ✅ ค้นหา user_id จาก username ในฐานข้อมูล
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(404).json({ error: "User not found" }); // ❌ ถ้าไม่มี user ห้ามสร้างโครงการ
    }

    const created_by = user.user_id;

    // ✅ สร้างโครงการโดยใช้ user_id ของ username ที่เจอ
    const newProject = await Project.create({
      project_name,
      description,
      status,
      budget,
      start_date: start_date ? new Date(start_date) : new Date(),
      end_date: end_date ? new Date(end_date) : null,
      created_by, // ✅ ใช้ user_id ของ username ที่เจอ
    });

    res.status(201).json({
      message: "Project created successfully",
      project: newProject,
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
      }, // ✅ คืนค่าข้อมูล user ที่สร้างโครงการกลับไปด้วย
    });

  } catch (err) {
    console.error("❌ Error creating project:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
};



// ✅ Get All Projects
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAll();
    res.status(200).json({ total:projects.length,projects });
  } catch (err) {
    console.error("❌ Error fetching projects:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
};

// ✅ Get Project By ID
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
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

    // ✅ ป้องกันค่าว่าง
    if (project_name === "" || budget === "") {
      return res.status(400).json({ error: "Project name and budget cannot be empty" });
    }

    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    await project.update(req.body);
    res.status(200).json({ message: "Project updated successfully", project });

  } catch (err) {
    console.error("❌ Error updating project:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
};

// ✅ Delete Project
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    await project.destroy();
    res.status(200).json({ message: "Project deleted successfully" });

  } catch (err) {
    console.error("❌ Error deleting project:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
};

module.exports = { createProject, getAllProjects, getProjectById, updateProject, deleteProject };
