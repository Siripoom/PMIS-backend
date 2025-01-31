const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/adminModel');
const { v4: uuidv4 } = require('uuid'); // v4 คือ UUID เวอร์ชัน 4

require('dotenv').config();

// REGISTER API (เฉพาะ Admin เท่านั้น)
const register = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        // ตรวจสอบว่า Email มีอยู่แล้วหรือไม่
        const existingUser = await Admin.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // เข้ารหัสรหัสผ่าน
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // บันทึกข้อมูลผู้ใช้ (ลบ role ออก)
        const newUser = await Admin.create({
            id: uuidv4(), // สร้าง UUID
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: "User registered successfully",
            data: newUser
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// LOGIN API (เฉพาะ Admin เท่านั้น)
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // ตรวจสอบ Email
        const user = await Admin.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // ตรวจสอบรหัสผ่าน
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // สร้าง JWT Token (ลบ role ออก)
        const token = jwt.sign(
            { id: user.id, email: user.email }, // ไม่ต้องใส่ role
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({
            message: "Login successful",
            token
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getMe = async (req, res) => {
    try {
        console.log("🔍 ตรวจสอบ Token ID:", req.user.id); // ✅ Debug จุดที่ 1

        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Access Denied" });
        }

        // ดึงข้อมูลผู้ใช้จากฐานข้อมูล
        const user = await Admin.findOne({
            where: { id: req.user.id },
            attributes: ["id", "firstName", "lastName", "email", "role"]
        });

        console.log("✅ ดึงข้อมูลจากฐานข้อมูล:", user); // ✅ Debug จุดที่ 2

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "User details retrieved successfully",
            user
        });
    } catch (err) {
        console.error("❌ ERROR:", err.message); // ✅ Debug จุดที่ 3
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};

const resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        // ✅ ตรวจสอบว่า Email มีอยู่ในระบบหรือไม่
        const user = await Admin.findOne({ where: { email } }); // ไม่ต้องระบุ role

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // ✅ เข้ารหัสรหัสผ่านใหม่
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // ✅ อัปเดตรหัสผ่านใหม่ลงในฐานข้อมูล
        await user.update({ password: hashedPassword });

        res.json({ message: "Password reset successful!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { register, login, getMe, resetPassword }; // ส่งออก register, login, getMe