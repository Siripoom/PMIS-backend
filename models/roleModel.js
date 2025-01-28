const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Role = sequelize.define('Role', {
    Role_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Role_name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'Role',
    timestamps: false
});

module.exports = Role;
