const { v4: uuidv4 } = require('uuid');
const ProjectResource = require('../models/ProjectResourceModel');

const trackResourceUsage = async (req, res) => {
    try {
        const { project_id, resource_id, used_quantity, allocated_by } = req.body;

        const usage = await ProjectResource.create({
            project_id,
            resource_id,
            used_quantity,
            allocated_by,
            allocated_at: new Date() // ✅ ใช้ timestamp ตามที่ออกแบบ
        });

        res.status(201).json({ message: "Resource usage tracked", data: usage });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUsageByProject = async (req, res) => {
    try {
        const { project_id } = req.params;
        const usage = await ProjectResource.findAll({
            where: { project_id }
        });

        if (usage.length === 0) {
            return res.status(404).json({ message: "No resource usage found for this project" });
        }

        res.status(200).json(usage);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { trackResourceUsage, getUsageByProject };
