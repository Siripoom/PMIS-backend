const { v4: uuidv4 } = require('uuid');
const Resource = require('../models/resourceModel');

// เพิ่มทรัพยากรใหม่
const createResource = async (req, res) => {
    try {
        const { resource_name, quantity, unit } = req.body;
        const newResource = await Resource.create({
            resource_id: uuidv4(),
            resource_name,
            quantity,
            unit
        });
        res.status(201).json({ message: "Resource created successfully", data: newResource });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ดึงข้อมูลทรัพยากรทั้งหมด
const getAllResources = async (req, res) => {
    try {
        const resources = await Resource.findAll();
        res.status(200).json(resources);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ดึงข้อมูลทรัพยากรตาม ID
const getResourceById = async (req, res) => {
    try {
        const { id } = req.params;
        const resource = await Resource.findByPk(id);
        if (!resource) {
            return res.status(404).json({ message: "Resource not found" });
        }
        res.status(200).json(resource);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// อัปเดตทรัพยากร
const updateResource = async (req, res) => {
    try {
        const { id } = req.params;
        const { resource_name, quantity, unit } = req.body;

        const resource = await Resource.findByPk(id);
        if (!resource) {
            return res.status(404).json({ message: "Resource not found" });
        }

        await resource.update({ resource_name, quantity, unit });
        res.status(200).json({ message: "Resource updated successfully", data: resource });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ลบทรัพยากร
const deleteResource = async (req, res) => {
    try {
        const { id } = req.params;
        const resource = await Resource.findByPk(id);
        if (!resource) {
            return res.status(404).json({ message: "Resource not found" });
        }

        await resource.destroy();
        res.status(200).json({ message: "Resource deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createResource, getAllResources, getResourceById, updateResource, deleteResource };
