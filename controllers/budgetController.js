const Budget = require("../models/budgetModel");
const Project = require("../models/projectModel");
const { createLog } = require("../controllers/logController");
const { sendAutoNotification } = require("../controllers/notificationController");
const { Op } = require("sequelize");

// ✅ บันทึกการใช้จ่าย
exports.recordExpense = async (req, res) => {
  try {
    const { project_name, budget_total, budget_spent, budget_remaining, spent_by } = req.body;

    // ✅ ตรวจสอบค่าที่ต้องมีและแปลงเป็นตัวเลข
    if (
      !project_name ||
      isNaN(Number(budget_total)) ||
      isNaN(Number(budget_spent)) ||
      isNaN(Number(budget_remaining)) ||
      !spent_by
    ) {
      return res.status(400).json({ error: "กรุณาระบุข้อมูลให้ครบถ้วน และตรวจสอบว่าตัวเลขถูกต้อง" });
    }

    // ✅ ค้นหาโครงการตามชื่อ
    const project = await Project.findOne({ where: { project_name } });

    if (!project) {
      return res.status(404).json({ message: "ไม่พบโครงการนี้ในระบบ" });
    }

    console.log(`📌 พบโครงการ: ${project.project_name}, ID: ${project.project_id}`);

    // ✅ บันทึกค่าใช้จ่ายลงฐานข้อมูล
    const expense = await Budget.create({
      project_id: project.project_id,
      amount: Number(budget_spent),
      description: `ใช้จ่าย ${budget_spent} บาท จากงบประมาณรวม ${budget_total} บาท`,
      spent_by,
    });

    if (!expense) {
      return res.status(500).json({ error: "เกิดข้อผิดพลาดในการบันทึกค่าใช้จ่าย" });
    }

    // ✅ แจ้งเตือนเมื่อมีการใช้จ่ายงบประมาณ
    sendAutoNotification(
      spent_by,
      "อัปเดตงบประมาณ",
      `มีการใช้จ่าย ${budget_spent} บาท ในโครงการ ${project_name}`,
      "warning",
      `/projects/${project.project_id}/budget`, // ✅ ปรับเส้นทางให้ถูกต้อง
      "💰"
    );

    // ✅ บันทึก Log การใช้จ่าย
    if (req.user && req.user.id) {
      await createLog(req.user.id, `ใช้จ่าย ${budget_spent} บาท ในโครงการ ${project.project_name}`, req);
    }

    // ✅ ส่งข้อมูลกลับ
    res.status(201).json({
      message: "บันทึกค่าใช้จ่ายสำเร็จ",
      data: {
        project_id: project.project_id,
        project_name: project.project_name,
        budget_total: Number(budget_total),
        budget_spent: Number(budget_spent),
        budget_remaining: Number(budget_remaining),
        spent_by,
      },
    });

  } catch (error) {
    console.error("❌ Error recording expense:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ ดึงงบประมาณทั้งหมดในระบบ
exports.getAllBudgets = async (req, res) => {
  try {
    const allBudgets = await Budget.findAll({
      include: [
        {
          model: Project,
          attributes: ["project_id", "project_name"],
        },
      ],
      order: [["spent_at", "DESC"]],
    });

    // ✅ บันทึก Log การเข้าถึงข้อมูล
    if (req.user && req.user.id) {
      await createLog(req.user.id, "ดูรายการงบประมาณทั้งหมด", req);
    }

    res.status(200).json({
      message: "ดึงข้อมูลงบประมาณทั้งหมดสำเร็จ",
      data: allBudgets,
    });
  } catch (error) {
    console.error("❌ Error fetching all budgets:", error);
    res.status(500).json({ error: error.message });
  }
};


// ✅ สรุปงบประมาณที่ใช้ไป
exports.getBudgetSummary = async (req, res) => {
  try {
    const { project_id } = req.params;

    if (!project_id) {
      return res.status(400).json({ error: "กรุณาระบุ project_id" });
    }

    // 🔹 ดึงงบประมาณทั้งหมดที่จัดสรรให้โครงการ
    const budgetTotal = await Budget.sum("amount", { where: { project_id, description: "งบประมาณเริ่มต้น" } }) || 0;

    // 🔹 คำนวณค่าใช้จ่ายทั้งหมดที่ใช้ไป
    const totalSpent = await Budget.sum("amount", { where: { project_id, description: { [Op.not]: "งบประมาณเริ่มต้น" } } }) || 0;

    // 🔹 คำนวณงบประมาณคงเหลือ
    const budgetRemaining = budgetTotal - totalSpent;

    // 🔹 ดึงรายละเอียดค่าใช้จ่ายทั้งหมด
    const expenses = await Budget.findAll({
      where: { project_id },
      attributes: ["budget_id", "amount", "description", "spent_by", "spent_at"],
      order: [["spent_at", "DESC"]],
    });

    // ✅ บันทึก Log การดูสรุปงบประมาณ
    if (req.user && req.user.id) {
      await createLog(req.user.id, `ดูสรุปงบประมาณของโครงการ ${project_id}`, req);
    }

    res.status(200).json({
      project_id,
      budget_total: budgetTotal,
      total_spent: totalSpent,
      budget_remaining: budgetRemaining,
      expenses,
    });

  } catch (error) {
    console.error("❌ Error fetching budget summary:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ ลบงบประมาณตาม budget_id
exports.deleteBudget = async (req, res) => {
  try {
    const { budget_id } = req.params;

    if (!budget_id) {
      return res.status(400).json({ error: "กรุณาระบุ budget_id" });
    }

    const budget = await Budget.findByPk(budget_id);
    if (!budget) {
      return res.status(404).json({ error: "ไม่พบนงบประมาณที่ต้องการลบ" });
    }

    // ✅ ลบค่าใช้จ่ายทั้งหมดก่อนลบงบประมาณ
    await Budget.destroy({ where: { project_id: budget.project_id } });

    // ✅ ลบงบประมาณ
    await budget.destroy();

    res.status(200).json({ message: "ลบงบประมาณและค่าใช้จ่ายสำเร็จ" });

  } catch (error) {
    console.error("❌ Error deleting budget:", error);
    res.status(500).json({ error: error.message });
  }
};
