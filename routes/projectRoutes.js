const express = require("express");
const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");
const { authenticateToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", authenticateToken, createProject); // ✅ สร้างโครงการ
router.get("/", authenticateToken, getAllProjects); // ✅ ดูโครงการทั้งหมด
router.get("/:id", authenticateToken, getProjectById); // ✅ ดูโครงการเดี่ยว
router.put("/:id", authenticateToken, updateProject); // ✅ แก้ไขโครงการ
router.delete("/:id", authenticateToken, deleteProject); // ✅ ลบโครงการ

module.exports = router;
