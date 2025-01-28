const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const Admin = require('./adminModel'); // FK reference

const Station = sequelize.define('Station', {
    Station_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Station_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Officer_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Admin,
            key: 'Admin_id'
        }
    }
}, {
    tableName: 'Station',
    timestamps: false
});

module.exports = Station;
