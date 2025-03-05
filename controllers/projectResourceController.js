const { v4: uuidv4 } = require('uuid');
const ProjectResource = require('../models/ProjectResourceModel');
const { createLog } = require("../controllers/logController"); // ✅ Import createLog

// ✅ ติดตามการใช้ทรัพยากร
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

        // ✅ บันทึก Log การติดตามการใช้ทรัพยากร
        await createLog(req.user.id, `ติดตามการใช้ทรัพยากร: ${used_quantity} หน่วย ในโครงการ ${project_id}`, req);

        res.status(201).json({ message: "Resource usage tracked", data: usage });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ ดึงรายการการใช้ทรัพยากรของโครงการ
const getUsageByProject = async (req, res) => {
    try {
        const { project_id } = req.params;
        const usage = await ProjectResource.findAll({
            where: { project_id }
        });

        if (usage.length === 0) {
            return res.status(404).json({ message: "No resource usage found for this project" });
        }

        // ✅ บันทึก Log การดึงข้อมูลการใช้ทรัพยากรของโครงการ
        await createLog(req.user.id, `ดึงรายการการใช้ทรัพยากรของโครงการ ${project_id}`, req);

        res.status(200).json(usage);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { trackResourceUsage, getUsageByProject };
