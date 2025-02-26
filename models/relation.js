const User = require("./userModel");
const Project = require("./projectModel");
const Resource = require("./resourceModel");
const ProjectResource = require("./ProjectResourceModel");
const Budget = require("./budgetModel");
const Progress = require("./progressModel");

const defineRelationships = () => {
    // 🔹 User - Project (User สร้าง Project)
    User.hasMany(Project, { foreignKey: "created_by" });
    Project.belongsTo(User, { foreignKey: "created_by" });

    // 🔹 Project - Budget (Project มีหลาย Budget)
    Project.hasMany(Budget, { foreignKey: "project_id" });
    Budget.belongsTo(Project, { foreignKey: "project_id" });

    // 🔹 User - Budget (User เป็นคนใช้ Budget)
    User.hasMany(Budget, { foreignKey: "spent_by" });
    Budget.belongsTo(User, { foreignKey: "spent_by" });

    // 🔹 Project - Progress (Project มี Progress หลายรายการ)
    Project.hasMany(Progress, { foreignKey: "project_id" });
    Progress.belongsTo(Project, { foreignKey: "project_id" });

    // 🔹 User - Progress (User เป็นคนอัปเดต Progress)
    User.hasMany(Progress, { foreignKey: "updated_by" });
    Progress.belongsTo(User, { foreignKey: "updated_by" });

    // 🔹 Project - Resource (Many-to-Many ผ่าน ProjectResource)
    Project.belongsToMany(Resource, { through: ProjectResource, foreignKey: "project_id" });
    Resource.belongsToMany(Project, { through: ProjectResource, foreignKey: "resource_id" });

    // 🔹 User - ProjectResource (User เป็นคน Allocate Resource)
    User.hasMany(ProjectResource, { foreignKey: "allocated_by" });
    ProjectResource.belongsTo(User, { foreignKey: "allocated_by" });

    console.log("✅ Relationships have been defined successfully.");
};

module.exports = defineRelationships;
