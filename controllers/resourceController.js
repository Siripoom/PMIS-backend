const { v4: uuidv4 } = require('uuid');
const Resource = require('../models/resourceModel');
const User = require('../models/userModel'); // ✅ นำเข้า userModel
const Project = require('../models/projectModel'); // ✅ นำเข้า projectModel

// ✅ เพิ่มทรัพยากรใหม่ (ค้นหา project_id และ user_id จากชื่อ)
const createResource = async (req, res) => {
    try {
        const { project_name, resource_name, quantity, unit, username } = req.body;

        const parsedQuantity = parseInt(quantity, 10);
        if (isNaN(parsedQuantity)) {
            return res.status(400).json({ message: "Quantity must be a number" });
        }

        // ✅ ตรวจสอบ project_name และดึง project_id ถ้ามี
        let project_id = null;
        if (project_name) {
            const project = await Project.findOne({ where: { project_name } });
            if (project) {
                project_id = project.project_id;
            } else {
                return res.status(404).json({ message: "Project not found" });
            }
        }

        // ✅ ตรวจสอบ username และดึง user_id ถ้ามี
        let user_id = null;
        if (username) {
            const user = await User.findOne({ where: { username } });
            if (user) {
                user_id = user.user_id;
            } else {
                return res.status(404).json({ message: "User not found" });
            }
        }

        // ✅ บันทึกทรัพยากรใหม่พร้อม project_id และ user_id
        const newResource = await Resource.create({
            resource_id: uuidv4(),
            project_id,
            resource_name,
            quantity: parsedQuantity,
            unit,
            user_id, // ✅ ใช้ user_id ถ้าพบ user
        });

        res.status(201).json({
            message: "Resource created successfully",
            data: {
                id: newResource.resource_id,
                project_id: newResource.project_id,
                resource_name: newResource.resource_name,
                quantity: newResource.quantity,
                unit: newResource.unit,
                user_id: newResource.user_id, // ✅ ส่ง user_id กลับไปด้วย
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// ดึงข้อมูลทรัพยากรทั้งหมด
const getAllResources = async (req, res) => {
    try {
      const { role, user_id } = req.query;  // ดึงค่า role และ user_id จาก query param
  
      let resources;
  
      if (role === "admin") {
        // Admin สามารถดูทรัพยากรทั้งหมด
        resources = await Resource.findAll();
      } else if (role === "manager") {
        // Manager สามารถดูทรัพยากรที่เกี่ยวข้องกับโครงการที่ตัวเองรับผิดชอบ
        resources = await Resource.findAll({
          where: {
            project_id: user_id,  // สามารถใช้ user_id หรือข้อมูลโครงการที่เกี่ยวข้อง
          },
        });
      } else if (role === "user") {
        // User สามารถดูทรัพยากรที่ตนเองขอใช้
        resources = await Resource.findAll({
          where: {
            allocated_by: user_id, // กรองทรัพยากรที่ผู้ใช้งานขอใช้
          },
        });
      } else {
        return res.status(400).json({ message: "Invalid role" });
      }
  
      res.status(200).json(resources);
    } catch (err) {
      console.error("❌ Error fetching resources:", err);
      res.status(500).json({ error: err.message || "Internal Server Error" });
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

        const parsedQuantity = parseInt(quantity, 10);
        if (isNaN(parsedQuantity)) {
            return res.status(400).json({ message: "Quantity must be a number" });
        }

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