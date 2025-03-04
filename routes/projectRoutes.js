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

router.post("/",  authenticateToken,createProject,logAction("สร้างโครงการ")); // ✅ สร้างโครงการ
router.get("/",  logAction("ดูโครงการทั้งหมด"),getAllProjects); // ✅ ดูโครงการทั้งหมด
router.get("/:id",  getAllProjects,logAction("ดูโครงการเดี่ยว")); // ✅ ดูโครงการเดี่ยว
router.put("/:id",  logAction("แก้ไขโครงการ"),updateProject); // ✅ แก้ไขโครงการ
router.delete("/:id",  logAction("ลบโครงการ"),deleteProject); // ✅ ลบโครงการ

module.exports = router;
