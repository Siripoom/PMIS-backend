const express = require("express");
const { addProgressUpdate, getProjectProgress } = require("../controllers/progressController");
const { authenticateToken } = require("../middlewares/authMiddleware");
const { logAction } = require("../middlewares/logMiddleware");

const router = express.Router();

router.post("/",  authenticateToken,logAction("บันทึกความคืบหน้า"),addProgressUpdate); // ✅ บันทึกความคืบหน้า
router.get("/:projectId",  getProjectProgress); // ✅ ดึงเปอร์เซ็นต์ความคืบหน้า

module.exports = router;
