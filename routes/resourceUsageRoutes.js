const express = require('express');
const { trackResourceUsage, getUsageByProject } = require('../controllers/resourceUsageController');

const router = express.Router();

router.post('/usage', trackResourceUsage);
router.get('/usage/:project_id', getUsageByProject);

module.exports = router;
