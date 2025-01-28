const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/adminModel');
require('dotenv').config();

// REGISTER API (เฉพาะ Admin เท่านั้น)
const register = async (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;

    try {
        if (role !== 'admin') {
            return res.status(403).json({ message: 'Only Admin can register!' });
        }

        // ตรวจสอบว่า Email มีอยู่แล้วหรือไม่
        const existingAdmin = await Admin.findOne({ where: { email } });
        if (existingAdmin) return res.status(400).json({ message: 'Email already exists' });

        // เข้ารหัสรหัสผ่าน
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // บันทึกข้อมูลผู้ใช้
        const newAdmin = await Admin.create({ firstName, lastName, email, password: hashedPassword, role });

        res.status(201).json({ message: 'Admin registered successfully', admin: newAdmin });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// LOGIN API (เฉพาะ Admin เท่านั้น)
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // ตรวจสอบ Email
        const admin = await Admin.findOne({ where: { email } });
        if (!admin || admin.role !== 'admin') {
            return res.status(403).json({ message: 'Access Denied! Only Admins can login' });
        }

        // ตรวจสอบรหัสผ่าน
        const validPassword = await bcrypt.compare(password, admin.password);
        if (!validPassword) return res.status(400).json({ message: 'Invalid email or password' });

        // สร้าง JWT Token
        const token = jwt.sign({ id: admin.id, email: admin.email, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: 'Admin Login successful', token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { register, login };