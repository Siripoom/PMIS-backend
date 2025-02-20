const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
const { v4: uuidv4 } = require("uuid");

const ProjectResource = sequelize.define("ProjectResource", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: uuidv4(),
        allowNull: false
    },
    project_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    resource_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    used_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    allocated_by: {
        type: DataTypes.UUID,
        allowNull: false
    },
    allocated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: "project_resources",
    timestamps: false
});

module.exports = ProjectResource;
