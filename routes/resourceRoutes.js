const express = require('express');
const { createResource, getAllResources, getResourceById, updateResource, deleteResource } = require('../controllers/resourceController');

const router = express.Router();

// ตรวจสอบว่าใช้ "/" แทน "/resources"
router.post('/', createResource);
router.get('/', getAllResources);
router.get('/:id', getResourceById);
router.put('/:id', updateResource);
router.delete('/:id', deleteResource);

module.exports = router;