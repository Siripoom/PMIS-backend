const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const { v4: uuidv4 } = require('uuid'); // v4 คือ UUID เวอร์ชัน 4


const Admin = sequelize.define('Admin', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4, // สร้าง UUID อัตโนมัติ
        allowNull: false
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('admin', 'user'),
        allowNull: false,
        defaultValue: 'user' // กำหนดค่าเริ่มต้นเป็น user
    }
}, {
    tableName: 'admin',
    timestamps: false
});

module.exports = Admin;
