const express = require("express");
const { createStation, getAllStations, getStationById, updateStation, deleteStation } = require("../controllers/stationController");

const router = express.Router();

router.post("/", createStation); // เพิ่มสถานี
router.get("/", getAllStations); // ดึงข้อมูล "ทั้งหมด"
router.get("/:id", getStationById); // ดึงข้อมูล "เฉพาะสถานี"
router.put("/:id", updateStation); // อัปเดตสถานี
router.delete("/:id", deleteStation); // ลบสถานี

module.exports = router;
