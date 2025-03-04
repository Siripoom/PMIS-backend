const express = require('express');
const { trackResourceUsage, getUsageByProject } = require('../controllers/projectResourceController');
const { logAction } = require("../middlewares/logMiddleware");

const router = express.Router();

router.post('/', logAction("ติดตามการใช้ทรัพยาการของผู้ใช้"),trackResourceUsage);
router.get('/:project_id', logAction("ตืดตามทรัพยากรโปรเจค"),getUsageByProject);

module.exports = router;
