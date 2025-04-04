const { v4: uuidv4 } = require("uuid");
const { sendAutoNotification } = require("../controllers/notificationController");
const ProjectResource = require("../models/ProjectResourceModel");
const Resource = require("../models/resourceModel");
const Project = require("../models/projectModel");
const User = require("../models/userModel");  // เพิ่มการ import User model
const { Op } = require("sequelize");


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
        const { limit = 10, offset = 0 } = req.query;

        const projectResources = await ProjectResource.findAll({
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        if (!projectResources || projectResources.length === 0) {
            return res.status(404).json({ message: "ไม่พบรายการการใช้ทรัพยากรในโครงการ" });
        }

        // map เพื่อดึง project_name, resource_name, unit และ allocated_by (ชื่อผู้ใช้)
        const enrichedResources = await Promise.all(projectResources.map(async (pr) => {
            // ✅ ดึงชื่อโครงการ
            const project = await Project.findByPk(pr.project_id);
            const project_name = project ? project.project_name : "ไม่พบชื่อโครงการ";

            // ✅ ดึงชื่อผู้ใช้จาก allocated_by
            const allocatedByUser = await User.findByPk(pr.allocated_by);
            const allocated_by_name = allocatedByUser ? allocatedByUser.username : "ไม่พบผู้จัดสรร";

            // ✅ ดึงชื่อทรัพยากรและ unit จาก resource array
            const enrichedResourceList = await Promise.all(pr.resource.map(async (resItem) => {
                const resource = await Resource.findByPk(resItem.resource_id);

                const resource_name = resource ? resource.resource_name : "ไม่พบชื่อทรัพยากร";
                const unit = resource ? resource.unit : "-";

                return {
                    ...resItem,
                    resource_name,
                    unit
                };
            }));

            return {
                id: pr.id,
                project_id: pr.project_id,
                project_name,
                resource: enrichedResourceList,
                allocated_by: allocated_by_name, // เปลี่ยนจาก user_id เป็น ชื่อผู้ใช้
                allocated_at: pr.allocated_at
            };
        }));

        res.status(200).json(enrichedResources);
    } catch (error) {
        console.error("❌ Error fetching enriched project resources:", error);
        res.status(500).json({ error: error.message });
    }
};

// ฟังก์ชันในการลบข้อมูลใน ProjectResource ตาม project_id หรือ resource_id
const deleteProjectResource = async (req, res) => {
    const { project_id, resource_id } = req.params;

    try {
        const projectResource = await ProjectResource.findOne({
            where: { project_id },
        });

        if (!projectResource) {
            return res.status(404).json({ message: "ไม่พบโปรเจกต์ที่ต้องการลบ" });
        }

        // ลบ resource_id ออกจาก array resource
        const updatedResources = projectResource.resource.filter(
            (resItem) => resItem.resource_id !== resource_id
        );

        // อัปเดตข้อมูลใน ProjectResource
        projectResource.resource = updatedResources;
        await projectResource.save();

        res.status(200).json({ message: "ลบทรัพยากรจากโปรเจกต์สำเร็จ" });
    } catch (error) {
        console.error("❌ Error deleting project resource:", error);
        res.status(500).json({ error: error.message });
    }
};


module.exports = { trackResourceUsage, getUsageByProject, sendAutoNotification, getAllProjectResources ,deleteProjectResource };
