const express = require("express");
const { logAction } = require("../middlewares/logMiddleware");
const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");
const { authenticateToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/",  authenticateToken,logAction("สร้างโครงการ"), createProject); // ✅ สร้างโครงการ
router.get("/",  authenticateToken,logAction("ดูโครงการทั้งหมด"), getAllProjects); // ✅ ดูโครงการทั้งหมด
router.get("/:id",  authenticateToken,logAction("ดูโครงการเดี่ยว"), getProjectById); // ✅ ดูโครงการเดี่ยว
router.put("/:id",  authenticateToken,logAction("แก้ไขโครงการ"), updateProject); // ✅ แก้ไขโครงการ
router.delete("/:id",  authenticateToken,logAction("ลบโครงการ"), deleteProject); // ✅ ลบโครงการ

module.exports = router;
