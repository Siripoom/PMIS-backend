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
    const { project_name, resource_name, used_quantity, allocated_by } = req.body;

    if (!project_name || !resource_name || !used_quantity || !allocated_by) {
      return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบทุกช่อง" });
    }

    if (used_quantity <= 0) {
      return res.status(400).json({ message: "Used quantity must be greater than 0" });
    }

    console.log("🔍 allocated_by:", allocated_by);
    
    const user = await User.findOne({ where: { username: allocated_by } });
    console.log("🧑‍💻 Fetched User:", user);

    if (!user) {
      return res.status(404).json({ message: `ไม่พบผู้ใช้งานชื่อ '${allocated_by}'` });
    }
    const allocated_by_id = user.user_id;

    const resource = await Resource.findOne({ where: { resource_name } });
    if (!resource) {
      return res.status(404).json({ message: `ไม่พบทรัพยากรชื่อ '${resource_name}'` });
    }

    const project = await Project.findOne({ where: { project_name } });
    if (!project) {
      return res.status(404).json({ message: `ไม่พบโครงการชื่อ '${project_name}'` });
    }

    const resource_id = resource.resource_id;
    const allocation = {
      resource_id,
      used_quantity,
      allocated_at: new Date()
    };

    let projectResource = await ProjectResource.findOne({ where: { project_id: project.project_id } });

    if (projectResource) {
      projectResource.resource = [...projectResource.resource, allocation];
      await projectResource.save();
    } else {
      projectResource = await ProjectResource.create({
        project_id: project.project_id,
        resource: [allocation],
        used_quantity,
        allocated_by: allocated_by_id,
        allocated_at: new Date()
      });
    }

    const responsePayload = {
      ...projectResource.toJSON(),
      allocated_by: user.username,
      project_name: project.project_name // Add project_name to the response
    };

    res.status(201).json({
      message: "บันทึกการใช้งานทรัพยากรสำเร็จ",
      data: responsePayload
    });

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
        offset: parseInt(offset),
      });
  
      if (!projectResources || projectResources.length === 0) {
        return res.status(404).json({ message: "ไม่พบรายการการใช้ทรัพยากรในโครงการ" });
      }
  
      const enrichedResources = await Promise.all(
        projectResources.map(async (pr) => {
            console.log("📌 project_id:", pr.project_id);
            console.log("👤 allocated_by user_id:", pr.allocated_by);
          // 🔍 ดึงข้อมูลโครงการ
          const project = await Project.findByPk(pr.project_id);
          const project_name = project ? project.project_name : "ไม่พบชื่อโครงการ";
      
          // 🔍 ดึงชื่อผู้ใช้จาก user_id
          const user = await User.findOne({ where: { user_id: pr.allocated_by } });
          const allocated_by_name = user ? user.username : "ไม่พบผู้ใช้";
          console.log("🧪 user_id ที่ค้นหา:", pr.allocated_by);
console.log("🔍 User ที่พบ:", user ? user.username : "ไม่พบ");

          console.log("📌 project_id:", pr.project_id);
console.log("👤 allocated_by user_id:", pr.allocated_by);
console.log("🧑‍💻 allocated_by name:", allocated_by_name);
      
          // 🔍 ดึงชื่อทรัพยากร + unit
          const enrichedResourceList = await Promise.all(
            pr.resource.map(async (resItem) => {
              const resource = await Resource.findByPk(resItem.resource_id);
              return {
                ...resItem,
                resource_name: resource ? resource.resource_name : "ไม่พบชื่อทรัพยากร",
                unit: resource ? resource.unit : "-",
              };
            })
          );
      
          return {
            id: pr.id,
            project_id: pr.project_id,
            project_name,
            resource: enrichedResourceList,
            allocated_by: allocated_by_name,  // 🔁 แสดงชื่อแทน ID
            allocated_at: pr.allocated_at,
          };
        })
      );
      
  
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
