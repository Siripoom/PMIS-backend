const express = require('express');
const { createResource, getAllResources, getResourceById, updateResource, deleteResource } = require('../controllers/resourceController');
const { logAction } = require("../middlewares/logMiddleware");

const router = express.Router();

// ตรวจสอบว่าใช้ "/" แทน "/resources"
router.post('/', logAction("สร้างทรัพยากร"),createResource);
router.get('/', logAction("ดึงข้อมูลทรัพยากรทั้งหมด"),getAllResources);
router.get('/:id', logAction("ดึงข้อมูลทรัพยากรตาม ID"),getResourceById);
router.put('/:id', logAction("อัพเดตทรัพยากร"),updateResource);
router.delete('/:id', logAction("ลบทรัพยากร"),deleteResource);

module.exports = router;
