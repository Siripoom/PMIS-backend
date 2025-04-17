const express = require('express');
const { trackResourceUsage, getUsageByProject, getAllProjectResources ,deleteProjectResource } = require('../controllers/projectResourceController');


const router = express.Router();

router.post('/', trackResourceUsage);
router.get('/:project_id', getUsageByProject);
router.get("/", getAllProjectResources); //
// ใน routes/projectResourceRoutes.js
router.delete("/:project_id/:resource_id", deleteProjectResource);

module.exports = router;