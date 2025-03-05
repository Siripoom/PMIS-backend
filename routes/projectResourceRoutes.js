const express = require('express');
const { trackResourceUsage, getUsageByProject } = require('../controllers/projectResourceController');
const { authenticateToken } = require("../middlewares/authMiddleware");
const { logAction } = require("../middlewares/logMiddleware");

const router = express.Router();

// ✅ ให้ `logAction()` ทำงานหลังจาก `trackResourceUsage()`
router.post('/', authenticateToken, trackResourceUsage, logAction("ติดตามการใช้ทรัพยากรของผู้ใช้"));

// ✅ เพิ่ม `authenticateToken` ใน `getUsageByProject()`
router.get('/:project_id', authenticateToken, getUsageByProject, logAction("ติดตามทรัพยากรของโปรเจค"));

module.exports = router;
