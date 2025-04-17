const express = require("express");
const { addProgressUpdate, getProjectProgress } = require("../controllers/progressController");
const { authenticateToken } = require("../middlewares/authMiddleware");
const { logAction } = require("../middlewares/logMiddleware");

const router = express.Router();

// ✅ บันทึกความคืบหน้าโครงการ
router.post("/", /*authenticateToken,*/ addProgressUpdate/*, logAction("บันทึกความคืบหน้า")*/);

// ✅ ดึงเปอร์เซ็นต์ความคืบหน้าโครงการ
router.get("/:projectId"/*, authenticateToken*/, getProjectProgress/*, logAction("ดึงเปอร์เซ็นต์ความคืบหน้า")*/);

module.exports = router;
