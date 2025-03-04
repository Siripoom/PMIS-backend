const express = require("express");
const { recordExpense, getBudgetSummary } = require("../controllers/budgetController");
const { authenticateToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/",  recordExpense); // ✅ บันทึกค่าใช้จ่าย
router.get("/:project_id",  getBudgetSummary); // ✅ ดูสรุปงบประมาณที่ใช้ไป

module.exports = router;
