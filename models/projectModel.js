const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
const { v4: uuidv4 } = require("uuid");

const Project = sequelize.define("Project", {
  project_id: {
    type: DataTypes.UUID,
    defaultValue: uuidv4(),
    primaryKey: true,
  },
  project_name: {
    type: DataTypes.STRING(255),
    allowNull: false, // ✅ ถ้าไม่ส่งมาใน `POST` จะเกิด Validation Error
  },
  description: {
    type: DataTypes.TEXT,
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false, // ✅ ถ้าไม่ส่งมาจะเกิด Error
    defaultValue: new Date()
  },
  end_date: {
    type: DataTypes.DATE,
  },
  budget: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false, // ✅ ฟิลด์นี้ต้องถูกส่งมา
  },
  status: {
    type: DataTypes.ENUM("Planned", "In Progress", "Completed", "Delayed"),
    defaultValue: "Planned",
  },
  created_by: {
    type: DataTypes.UUID,
    allowNull: false, // ✅ ถ้าไม่ส่ง user_id จะเกิด Error
  },
}, {
  tableName: "projects",
  timestamps: true,
});


module.exports = Project;
