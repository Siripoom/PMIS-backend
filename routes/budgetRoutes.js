const express = require("express");
const budgetController = require("../controllers/budgetController");
// const { authenticateToken } = require("../middlewares/authMiddleware"); // ปิดไว้ชั่วคราวหากไม่ใช้ auth
const { logAction } = require("../middlewares/logMiddleware");

const router = express.Router();

// ✅ บันทึกการใช้จ่าย (POST)
router.post(
  "/",
  // authenticateToken,
  budgetController.recordExpense
  // logAction("บันทึกค่าใช้จ่าย")
);

// ✅ ดึงงบประมาณทั้งหมด (GET /api/budget)
router.get("/", budgetController.getAllBudgets);

// ✅ ดึงสรุปงบประมาณโครงการ (GET /api/budget/:project_id)
router.get(
  "/:project_id",
  // authenticateToken,
  budgetController.getBudgetSummary
  // logAction("ดูสรุปงบประมาณที่ใช้ไป")
);

// ✅ ลบงบประมาณ (DELETE /api/budget/:budget_id)
router.delete("/:budget_id", budgetController.deleteBudget);

module.exports = router;
