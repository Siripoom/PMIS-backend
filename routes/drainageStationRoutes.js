const express = require("express");
const router = express.Router();
const {
  createStation,
  getAllStations,
  getStationById,
  updateStation,
  deleteStation,
  restoreStation,
} = require("../controllers/DrainageStationController");

// Routes
router.post("/stations", createStation); // Create
router.get("/stations", getAllStations); // Read All
router.get("/stations/:id", getStationById); // Read One
router.put("/stations/:id", updateStation); // Update
router.delete("/stations/:id", deleteStation); // Delete
router.put("/stations/:id/restore", restoreStation); // Restore

module.exports = router;
