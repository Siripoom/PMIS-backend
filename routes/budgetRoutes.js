const express = require("express");
const { recordExpense, getBudgetSummary } = require("../controllers/budgetController");
const { authenticateToken } = require("../middlewares/authMiddleware");
const { logAction } = require("../middlewares/logMiddleware");

const router = express.Router();

// ✅ ให้ `logAction()` ทำงานหลังจาก `recordExpense`
router.post("/", authenticateToken, recordExpense, logAction("บันทึกค่าใช้จ่าย"));

// ✅ ให้ `logAction()` ทำงานหลังจาก `getBudgetSummary`
router.get("/:project_id", authenticateToken, getBudgetSummary, logAction("ดูสรุปงบประมาณที่ใช้ไป"));

module.exports = router;
