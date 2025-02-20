const { Sequelize } = require("sequelize"); // ✅ เพิ่มบรรทัดนี้
const Project = require("../models/projectModel");


// ✅ Create Project
const createProject = async (req, res) => {
  const { project_name, description, status, budget, start_date } = req.body;

  try {
    const newProject = await Project.create({
      project_name,
      description,
      status,
      budget,
      start_date: start_date ? new Date(start_date) : new Date(), // ✅ ให้ใช้วันที่ปัจจุบัน
      created_by: req.user.id // ✅ ใช้ user_id จาก Token ที่ล็อกอิน
    });

    res.status(201).json({
      message: "Project created successfully",
      project: newProject
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✅ Get All Projects
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAll();
    res.status(200).json({ projects });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get Project By ID
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json({ project });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update Project
const updateProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    await project.update(req.body);
    res.status(200).json({ message: "Project updated successfully", project });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete Project
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    await project.destroy();
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createProject, getAllProjects, getProjectById, updateProject, deleteProject };
