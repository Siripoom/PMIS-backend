const { Sequelize } = require("sequelize"); // ✅ ใช้สำหรับ Query Database
const { sendAutoNotification } = require("../controllers/notificationController");
const Project = require("../models/projectModel");
const User = require("../models/userModel");
const ProjectResource = require("../models/ProjectResourceModel"); // ✅ ใช้สำหรับการจัดการทรัพยากรของโครงการ


// ✅ Create Project
const createProject = async (req, res) => {
  try {
    const { project_name, description, status, budget, start_date, end_date, username } = req.body;

    // ✅ ตรวจสอบว่ามีการส่ง username มาหรือไม่
    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    // ✅ ค้นหา user_id จาก username
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // ✅ ตรวจสอบว่าชื่อโครงการนี้มีอยู่แล้วหรือไม่
    const existingProject = await Project.findOne({ where: { project_name } });
    if (existingProject) {
      return res.status(400).json({ error: "Project with this name already exists" });
    }

    // ✅ ตรวจสอบค่า budget
    const parsedBudget = Number(budget);
    if (isNaN(parsedBudget) || parsedBudget < 0) {
      return res.status(400).json({ error: "Invalid budget amount" });
    }

    const newProject = await Project.create({
      project_name,
      description,
      status,
      budget: parsedBudget,
      start_date: start_date ? new Date(start_date) : new Date(),
      end_date: end_date ? new Date(end_date) : null,
      created_by: user.user_id, // ✅ ใช้ user_id ของ username ที่เจอ
    });

    // ✅ ส่งการแจ้งเตือน
    sendAutoNotification(
      user.user_id,
      "โครงการใหม่ถูกสร้างขึ้น",
      `คุณได้สร้างโครงการ "${project_name}" สำเร็จแล้ว`,
      "info",
      `/projects/${newProject.project_id}`,
      "🚀"
    );

    // ✅ บันทึก Log ว่ามีการสร้างโครงการ
    /*await createLog(user.user_id, `สร้างโครงการใหม่: ${project_name}`, req);*/

    res.status(201).json({
      message: "Project created successfully",
      project: newProject,
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
      },
    });

  } catch (err) {
    console.error("❌ Error creating project:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
};



// ✅ Get All Projects
const getAllProjects = async (req, res) => {
  try {
    const { role, user_id } = req.query;  // ดึงค่า role และ user_id จาก query param

    let projects;

    if (role === "admin") {
      // Admin สามารถดูข้อมูลโครงการทั้งหมด
      projects = await Project.findAll();
    } else if (role === "manager") {
      // Manager สามารถดูโครงการที่ตัวเองเป็นเจ้าของ
      projects = await Project.findAll({ where: { created_by: user_id } });
    } else if (role === "user") {
      // User สามารถดูโครงการที่ตัวเองได้รับมอบหมาย
      projects = await Project.findAll({
        where: {
          assigned_to: user_id,  // หากโครงการมี field `assigned_to` ที่เก็บ user_id
        },
      });
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    res.status(200).json({ total: projects.length, projects });
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

    // ✅ ลบ resource ที่เชื่อมกับ project ก่อน
    await ProjectResource.destroy({ where: { project_id: req.params.id } });

    // ✅ จากนั้นค่อยลบ project
    await project.destroy();

    res.status(200).json({ message: "Project deleted successfully" });

  } catch (err) {
    console.error("❌ Error deleting project:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
};

module.exports = { createProject, getAllProjects, getProjectById, updateProject, deleteProject };