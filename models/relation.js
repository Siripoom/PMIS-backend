const User = require("./userModel");
const Project = require("./projectModel");
const Resource = require("./resourceModel");
const ProjectResource = require("./ProjectResourceModel");
const Budget = require("./budgetModel");
const Progress = require("./progressModel");
const Report = require("./reportModel");
const Notification = require("./notificationModel");

const defineRelationships = () => {
    // 🔹 User - Project (User creates Project)
    User.hasMany(Project, { foreignKey: "created_by" });
    Project.belongsTo(User, { foreignKey: "created_by" });

    // 🔹 Project - Budget (Project has many Budgets)
    Project.hasMany(Budget, { foreignKey: "project_id" });
    Budget.belongsTo(Project, { foreignKey: "project_id" });

    // 🔹 User - Budget (User uses Budget)
    User.hasMany(Budget, { foreignKey: "spent_by" });
    Budget.belongsTo(User, { foreignKey: "spent_by" });

    // 🔹 Project - Progress (Project has many Progress updates)
    Project.hasMany(Progress, { foreignKey: "project_id" });
    Progress.belongsTo(Project, { foreignKey: "project_id" });

    // 🔹 User - Progress (User updates Progress)
    User.hasMany(Progress, { foreignKey: "updated_by" });
    Progress.belongsTo(User, { foreignKey: "updated_by" });

    // 🔹 Project - Resource (Many-to-Many through ProjectResource)
    Project.belongsToMany(Resource, {
        through: ProjectResource,  // The junction table
        foreignKey: 'project_id',
        otherKey: 'resource_id',
    });

    Resource.belongsToMany(Project, {
        through: ProjectResource,  // The junction table
        foreignKey: 'resource_id',
        otherKey: 'project_id',
    });

    // 🔹 User - ProjectResource (User allocates Resource)
    User.hasMany(ProjectResource, { foreignKey: "allocated_by" });
    ProjectResource.belongsTo(User, { foreignKey: "allocated_by" });

    // 🔹 Project - Report (Project has many Reports)
    Project.hasMany(Report, { foreignKey: "project_id" });
    Report.belongsTo(Project, { foreignKey: "project_id" });

    // 🔹 User - Report (User generates Report)
    User.hasMany(Report, { foreignKey: "generated_by" });
    Report.belongsTo(User, { foreignKey: "generated_by" });

    // 🔹 User - Notification (User has many Notifications)
    User.hasMany(Notification, { foreignKey: "user_id" });
    Notification.belongsTo(User, { foreignKey: "user_id" });

    // 🔹 Project - ProjectResource (One-to-Many)
    Project.hasMany(ProjectResource, { foreignKey: "project_id" });
ProjectResource.belongsTo(Project, { foreignKey: "project_id" });

    console.log("✅ Relationships have been defined successfully.");
};

module.exports = defineRelationships;