const { v4: uuidv4 } = require('uuid');
const Resource = require('../models/resourceModel');
const { createLog } = require("../controllers/logController");

// ✅ เพิ่มทรัพยากรใหม่
const createResource = async (req, res) => {
    try {
        const { resource_name, quantity, unit } = req.body;

        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: "Unauthorized: User information is missing" });
        }

        const newResource = await Resource.create({
            resource_id: uuidv4(),
            resource_name,
            quantity,
            unit
        });

        // ✅ บันทึก Log การสร้างทรัพยากร
        await createLog(req.user.id, `สร้างทรัพยากร ${newResource.resource_name}`, req);

        res.status(201).json({ message: "Resource created successfully", data: newResource });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ ดึงข้อมูลทรัพยากรทั้งหมด
const getAllResources = async (req, res) => {
    try {
        const resources = await Resource.findAll();

        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: "Unauthorized: User information is missing" });
        }

        // ✅ บันทึก Log การเข้าถึงทรัพยากรทั้งหมด
        await createLog(req.user.id, "ดึงข้อมูลทรัพยากรทั้งหมด", req);

        res.status(200).json(resources);
    } catch (error) {
        console.error("❌ Error fetching resources:", error);
        res.status(500).json({ error: error.message });
    }
};

// ✅ ดึงข้อมูลทรัพยากรตาม ID
const getResourceById = async (req, res) => {
    try {
        const { id } = req.params;
        const resource = await Resource.findByPk(id);

        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: "Unauthorized: User information is missing" });
        }

        if (!resource) {
            return res.status(404).json({ message: "Resource not found" });
        }

        // ✅ บันทึก Log การเข้าถึงทรัพยากรตาม ID
        await createLog(req.user.id, `ดึงข้อมูลทรัพยากร: ${resource.resource_name}`, req);

        res.status(200).json(resource);
    } catch (error) {
        console.error("❌ Error fetching resource by ID:", error);
        res.status(500).json({ error: error.message });
    }
};

// ✅ อัปเดตทรัพยากร
const updateResource = async (req, res) => {
    try {
        const { id } = req.params;
        const { resource_name, quantity, unit } = req.body;

        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: "Unauthorized: User information is missing" });
        }

        const resource = await Resource.findByPk(id);
        if (!resource) {
            return res.status(404).json({ message: "Resource not found" });
        }

        await resource.update({ resource_name, quantity, unit });

        // ✅ บันทึก Log การอัปเดตทรัพยากร
        await createLog(req.user.id, `อัพเดตทรัพยากร ${resource.resource_name}`, req);

        res.status(200).json({ message: "Resource updated successfully", data: resource });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ ลบทรัพยากร
const deleteResource = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: "Unauthorized: User information is missing" });
        }

        const resource = await Resource.findByPk(id);
        if (!resource) {
            return res.status(404).json({ message: "Resource not found" });
        }

        await resource.destroy();

        // ✅ บันทึก Log การลบทรัพยากร
        await createLog(req.user.id, `ลบทรัพยากร ${resource.resource_name}`, req);

        res.status(200).json({ message: "Resource deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createResource, getAllResources, getResourceById, updateResource, deleteResource };
