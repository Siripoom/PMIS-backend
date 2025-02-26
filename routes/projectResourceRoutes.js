const express = require('express');
const { trackResourceUsage, getUsageByProject } = require('../controllers/projectResourceController');

const router = express.Router();

router.post('/', trackResourceUsage);
router.get('/:project_id', getUsageByProject);

module.exports = router;
