const express = require("express");
const { recordExpense, getBudgetSummary, deleteBudget } = require("../controllers/budgetController");
// 🚫 ลบ middleware `authenticateToken` ชั่วคราว
// const { authenticateToken } = require("../middlewares/authMiddleware");
const { logAction } = require("../middlewares/logMiddleware");

const router = express.Router();

// ✅ ลองทดสอบ โดยลบ `authenticateToken` ออก
router.post("/", /* authenticateToken, */ recordExpense /*logAction("บันทึกค่าใช้จ่าย")*/);

// ✅ ลบ `authenticateToken` ออก เพื่อดึงข้อมูลงบประมาณโดยไม่ใช้ Token
router.get("/:project_id", /* authenticateToken, */ getBudgetSummary /*logAction("ดูสรุปงบประมาณที่ใช้ไป")*/);

router.delete("/:budget_id", deleteBudget);

module.exports = router;
