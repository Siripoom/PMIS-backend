const express = require('express');
const { trackResourceUsage, getUsageByProject, getAllProjectResources } = require('../controllers/projectResourceController');

const router = express.Router();

router.post('/', trackResourceUsage);
router.get('/:project_id', getUsageByProject);
router.get("/", getAllProjectResources); //

module.exports = router;