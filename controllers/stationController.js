const Station = require("../models/stationModel");

const createStation = async (req, res) => {
  const { name, type } = req.body;
  try {
    const newStation = await Station.create({ name, type });
    res.status(201).json({ data: newStation }); 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllStations = async (req, res) => {
  try {
    const stations = await Station.findAll();
    res.status(200).json({ data: stations }); 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getStationById = async (req, res) => {
  const { id } = req.params;
  try {
    const station = await Station.findByPk(id);
    if (!station) return res.status(404).json({ message: "ไม่พบสถานี" });

    res.status(200).json({ data: station });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateStation = async (req, res) => {
  const { id } = req.params;
  const { name, type } = req.body;
  try {
    const station = await Station.findByPk(id);
    if (!station) return res.status(404).json({ message: "ไม่พบสถานี" });

    station.name = name || station.name;
    station.type = type || station.type;
    await station.save();
    
    res.status(200).json({ data: station }); 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteStation = async (req, res) => {
  const { id } = req.params;
  try {
    const station = await Station.findByPk(id);
    if (!station) return res.status(404).json({ message: "ไม่พบสถานี" });

    await station.destroy();
    res.status(200).json({ message: "ลบสถานีสำเร็จ" }); 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createStation, getAllStations, getStationById, updateStation, deleteStation };
