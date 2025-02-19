const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const { v4: uuidv4 } = require('uuid');

const ResourceUsage = sequelize.define('ResourceUsage', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: uuidv4,
        allowNull: false
    },
    project_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    resource_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    used_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    used_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'resource_usage',
    timestamps: false
});

module.exports = ResourceUsage;
