const express = require("express");
const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");
//const { authenticateToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/",  createProject); // ✅ สร้างโครงการ
router.get("/",  getAllProjects); // ✅ ดูโครงการทั้งหมด
router.get("/:id",  getProjectById); // ✅ ดูโครงการเดี่ยว
router.put("/:id",  updateProject); // ✅ แก้ไขโครงการ
router.delete("/:id",  deleteProject); // ✅ ลบโครงการ

module.exports = router;