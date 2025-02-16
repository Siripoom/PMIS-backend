const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
const { v4: uuidv4 } = require("uuid");

const Progress = sequelize.define("Progress", {
  update_id: {
    type: DataTypes.UUID,
    defaultValue: uuidv4(),
    primaryKey: true,
  },
  project_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "projects",
      key: "project_id",
    },
  },
  progress: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 100, // เปอร์เซ็นต์ต้องอยู่ในช่วง 0 - 100
    },
  },
  update_note: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  updated_by: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "users",
      key: "user_id",
    },
  },
}, {
  tableName: "progress",
  timestamps: true, // Sequelize จะสร้าง `createdAt` และ `updatedAt` อัตโนมัติ
});

module.exports = Progress;
