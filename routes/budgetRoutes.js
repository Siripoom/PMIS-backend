const express = require("express");
const { recordExpense, getBudgetSummary } = require("../controllers/budgetController");
const { authenticateToken } = require("../middlewares/authMiddleware");
const { logAction } = require("../middlewares/logMiddleware");

const router = express.Router();

router.post("/",  logAction("บันทึกค่าใช้จ่าย"),recordExpense); // ✅ บันทึกค่าใช้จ่าย
router.get("/:project_id",  logAction("ดูสรุปงบประมาณที่ใช้ไป"),getBudgetSummary); // ✅ ดูสรุปงบประมาณที่ใช้ไป

module.exports = router;
