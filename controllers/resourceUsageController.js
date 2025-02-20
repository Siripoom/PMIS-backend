const { v4: uuidv4 } = require('uuid');
const ResourceUsage = require('../models/resourceUsageModel');

const trackResourceUsage = async (req, res) => {
    try {
        const { project_id, resource_id, used_quantity } = req.body;

        const usage = await ResourceUsage.create({
            id: uuidv4(),
            project_id,
            resource_id,
            used_quantity
        });
        res.status(201).json({ message: "Resource usage tracked", data: usage });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUsageByProject = async (req, res) => {
    try {
        const { project_id } = req.params;
        const usage = await ResourceUsage.findAll({ where: { project_id } });

        if (!usage.length) {
            return res.status(404).json({ message: "No usage data found for this project" });
        }

        res.status(200).json(usage);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { trackResourceUsage, getUsageByProject };
