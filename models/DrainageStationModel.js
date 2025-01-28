const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

const DrainageStation = sequelize.define(
  "DrainageStation",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("ถนน", "ถนนในอุโมง"),
      allowNull: false,
    },
  },
  {
    tableName: "DrainageStations",
    timestamps: true, // ใช้ createdAt และ updatedAt
    paranoid: true, // ใช้ soft delete
  }
);

module.exports = DrainageStation;
