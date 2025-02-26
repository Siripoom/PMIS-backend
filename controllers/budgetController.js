const Budget = require("../models/budgetModel");
const Project = require("../models/projectModel");

// ✅ บันทึกการใช้จ่าย
exports.recordExpense = async (req, res) => {
  try {
    const { project_id, amount, description, spent_by } = req.body;

    if (!project_id || !amount || !spent_by) {
      return res.status(400).json({ error: "ข้อมูลไม่ครบถ้วน" });
    }

    const expense = await Budget.create({ project_id, amount, description, spent_by });
    res.status(201).json({ message: "บันทึกการใช้จ่ายเรียบร้อย", data: expense });

  } catch (error) {
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

    const totalSpent = await Budget.sum("amount", { where: { project_id } });

    res.status(200).json({ project_id, total_spent: totalSpent || 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
