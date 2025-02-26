const { Sequelize } = require("sequelize"); // ✅ ใช้สำหรับ Query Database
const Project = require("../models/projectModel");

// ✅ Create Project
const createProject = async (req, res) => {
  try {
    const { project_name, description, status, budget, start_date } = req.body;

    // ✅ ตรวจสอบค่าที่จำเป็น
    if (!project_name || !budget) {
      return res.status(400).json({ error: "Project name and budget are required" });
    }

    // ✅ ตรวจสอบว่ามี `req.user.id` หรือไม่
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized: Missing user ID" });
    }

    const newProject = await Project.create({
      project_name,
      description,
      status,
      budget,
      start_date: start_date ? new Date(start_date) : new Date(),
      created_by: req.user.id
    });

    res.status(201).json({
      message: "Project created successfully",
      project: newProject
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
    res.status(200).json({ projects });
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
