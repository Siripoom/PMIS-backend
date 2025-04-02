const { v4: uuidv4 } = require("uuid");
const { sendAutoNotification } = require("../controllers/notificationController");
const ProjectResource = require("../models/ProjectResourceModel");
const Resource = require("../models/resourceModel");
const Project = require("../models/projectModel");

// ฟังก์ชันในการติดตามการใช้ทรัพยากร
const trackResourceUsage = async (req, res) => {
    try {
        const { project_id, resource_name, used_quantity, allocated_by } = req.body;

        // ตรวจสอบค่าที่ได้รับจาก frontend
        if (!project_id || !resource_name || !used_quantity || !allocated_by) {
            return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบทุกช่อง" });
        }

        // ตรวจสอบว่า used_quantity เป็นตัวเลขที่มากกว่าศูนย์
        if (used_quantity <= 0) {
            return res.status(400).json({ message: "Used quantity must be greater than 0" });
        }

        // ค้นหา resource_id จาก resource_name
        const resource = await Resource.findOne({ where: { resource_name } });
        if (!resource) {
            return res.status(404).json({ message: `ไม่พบทรัพยากรชื่อ '${resource_name}'` });
        }

        const resource_id = resource.resource_id;
        const allocation = { resource_id, used_quantity, allocated_at: new Date() };

        // ค้นหาว่ามี record สำหรับ project_id นี้อยู่หรือไม่
        let projectResource = await ProjectResource.findOne({ where: { project_id } });

        if (projectResource) {
            // ถ้ามี project_id อยู่แล้วให้เพิ่ม resource เข้าไปใน array
            let updatedResources = [...projectResource.resource, allocation];
            projectResource.resource = updatedResources;
            await projectResource.save();
        } else {
            // ถ้าไม่มี record ให้สร้างใหม่
            projectResource = await ProjectResource.create({
                project_id,
                resource: [allocation], // ✅ บันทึกเป็น Array
                allocated_by,
                allocated_at: new Date(),
            });
        }

        res.status(201).json({ message: "บันทึกการใช้งานทรัพยากรสำเร็จ", data: projectResource });
    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ error: error.message });
    }
};



// ฟังก์ชันดึงข้อมูลการใช้ทรัพยากรของโครงการตาม project_id
const getUsageByProject = async (req, res) => {
    try {
        const { project_id } = req.params;

        console.log("🔍 Checking project_id:", project_id);

        const usage = await ProjectResource.findAll({
            where: { project_id },
            include: [
                {
                    model: Resource,
                    attributes: ["resource_name"], // ดึง resource_name จาก Resource
                    required: true,  // เพิ่ม required: true เพื่อให้ระบบดึงข้อมูลเฉพาะที่มีความสัมพันธ์
                },
                {
                    model: Project,
                    attributes: ["project_name"], // ดึง project_name จาก Project
                    required: true,
                }
            ]
        });

        if (!usage || usage.length === 0) {
            return res.status(404).json({ message: "No resource usage found for this project" });
        }

        res.status(200).json(usage);
    } catch (error) {
        console.error("❌ Error fetching project resources:", error);
        res.status(500).json({ error: error.message });
    }
};

// ฟังก์ชันดึงข้อมูลทั้งหมดจาก ProjectResource พร้อมข้อมูลที่เชื่อมโยงจาก Resource และ Project
const getAllProjectResources = async (req, res) => {
    try {
        // รับค่า limit และ offset จาก query สำหรับ pagination
        const { limit = 10, offset = 0 } = req.query;

        const projectResources = await ProjectResource.findAll({
            
            limit: parseInt(limit),  // กำหนดการจำกัดจำนวนข้อมูล
            offset: parseInt(offset) // กำหนดค่า offset สำหรับ Pagination
        });

        if (!projectResources || projectResources.length === 0) {
            return res.status(404).json({ message: "No project resources found" });
        }

        res.status(200).json(projectResources);
    } catch (error) {
        console.error("❌ Error fetching all project resources:", error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = { trackResourceUsage, getUsageByProject, sendAutoNotification, getAllProjectResources };
