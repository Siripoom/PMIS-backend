const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
const { v4: uuidv4 } = require("uuid");

const Progress = sequelize.define("Progress", {
  id: {
    type: DataTypes.UUID,
    defaultValue: uuidv4(),
    primaryKey: true,
  },
  projectId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "projects",
      key: "id",
    },
  },
  updateText: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  progressPercentage: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 100, // ต้องอยู่ในช่วง 0 - 100
    },
  },
  updatedBy: {
    type: DataTypes.UUID,
    allowNull: false,
  },
}, {
  tableName: "progress_updates",
  timestamps: true, // เพิ่ม createdAt, updatedAt
});

module.exports = Progress;
