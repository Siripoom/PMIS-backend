const DrainageStation = require("../models/DrainageStationModel");

// Create new drainage station
exports.createStation = async (req, res) => {
  try {
    const { address, type } = req.body;

    const newStation = await DrainageStation.create({
      address,
      type,
    });

    res
      .status(201)
      .json({ message: "Station created successfully", station: newStation });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating station", error: error.message });
  }
};

// Get all drainage stations
exports.getAllStations = async (req, res) => {
  try {
    const stations = await DrainageStation.findAll();
    res.status(200).json({
      message: "successful",
      count: stations.length,
      stations: stations,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching stations", error: error.message });
  }
};

// Get a single drainage station by ID
exports.getStationById = async (req, res) => {
  try {
    const { id } = req.params;

    const station = await DrainageStation.findByPk(id);

    if (!station) return res.status(404).json({ message: "Station not found" });

    res.status(200).json({
      message: "successful",
      station: station,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching station", error: error.message });
  }
};

// Update a drainage station
exports.updateStation = async (req, res) => {
  try {
    const { id } = req.params;
    const { address, type } = req.body;

    const station = await DrainageStation.findByPk(id);

    if (!station) return res.status(404).json({ message: "Station not found" });

    station.address = address || station.address;
    station.type = type || station.type;

    await station.save();

    res
      .status(200)
      .json({ message: "Station updated successfully", station: station });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating station", error: error.message });
  }
};

// Delete a drainage station
// Soft Delete a drainage station
exports.deleteStation = async (req, res) => {
  try {
    const { id } = req.params;

    const station = await DrainageStation.findByPk(id);
    if (!station) return res.status(404).json({ message: "Station not found" });

    await station.destroy(); // Soft Delete
    res.status(200).json({ message: "Station deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting station", error: error.message });
  }
};

// Restore a deleted station
exports.restoreStation = async (req, res) => {
  try {
    const { id } = req.params;

    const station = await DrainageStation.findOne({
      where: { id },
      paranoid: false,
    });
    if (!station) return res.status(404).json({ message: "Station not found" });

    await station.restore(); // Restore Soft Deleted Data
    res.status(200).json({ message: "Station restored successfully", station });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error restoring station", error: error.message });
  }
};
