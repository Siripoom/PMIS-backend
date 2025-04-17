const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

const ProjectResource = sequelize.define("ProjectResource", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    project_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "projects",
            key: "project_id"
        }
    },
    resource: { 
        type: DataTypes.JSONB,  // ✅ เปลี่ยนจาก resource_id เป็น JSONB Array
        allowNull: false,
        defaultValue: []
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
