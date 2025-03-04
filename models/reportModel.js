const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

const Report = sequelize.define(
  "Report",
  {
    report_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    project_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    generated_by: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    format: {
      type: DataTypes.ENUM("PDF", "Excel"),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "reports",
    timestamps: false,
  }
);

module.exports = Report;
