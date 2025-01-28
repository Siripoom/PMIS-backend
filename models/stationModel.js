const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

const Station = sequelize.define("Station", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM("ถนน", "อุโมงค์"), // ใช้ภาษาไทยแทน
    allowNull: false,
  },
}, {
  tableName: "stations",
  timestamps: true,
});

module.exports = Station;
