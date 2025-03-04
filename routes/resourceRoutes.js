const express = require('express');
const { createResource, getAllResources, getResourceById, updateResource, deleteResource } = require('../controllers/resourceController');
const { logAction } = require("../middlewares/logMiddleware");
const { authenticateToken } = require("../middlewares/authMiddleware");

const router = express.Router();

// ✅ เรียก `authenticateToken` ก่อนเพื่อให้ `req.user` มีค่า
router.post('/', authenticateToken, createResource, logAction("สร้างทรัพยากร"));
router.get('/', authenticateToken, getAllResources, logAction("ดึงข้อมูลทรัพยากรทั้งหมด"));
router.get('/:id', authenticateToken, getResourceById, logAction("ดึงข้อมูลทรัพยากรตาม ID"));
router.put('/:id', authenticateToken, updateResource, logAction("อัพเดตทรัพยากร"));
router.delete('/:id', authenticateToken, deleteResource, logAction("ลบทรัพยากร"));

module.exports = router;
