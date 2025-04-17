const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Notification = require("../models/notificationModel");  // เพิ่มการ import Notification model
const { v4: uuidv4 } = require("uuid");



require("dotenv").config();

// REGISTER API
const register = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      user_id: uuidv4(),
      username,
      email,
      password: hashedPassword,
      role, // ✅ ใช้ค่าที่ส่งมาโดยตรง
    });

    res.status(201).json({
      message: "User registered successfully",
      data: {
        id: newUser.user_id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// LOGIN API
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: user.user_id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.locals.user = user;  // ✅ เก็บ user ใน res.locals
        res.json({
            message: "Login successful",
            username: user.username,
            id: user.user_id,
            email: user.email,
            role: user.role,
            token,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// ✅ GET ME (ดึงข้อมูลผู้ใช้จาก Token)
const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ RESET PASSWORD (เปลี่ยนรหัสผ่าน)
const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] }, // ✅ ซ่อน password
      order: [["created_at", "DESC"]], // ✅ เรียงตามวันที่สร้าง
    });

    res.status(200).json({
      message: "Retrieved all users successfully",
      data: users,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ ฟังก์ชันดึงข้อมูลผู้ใช้จาก user_id
const getUserByUsername = async (req, res) => {
  const { username } = req.params;  // รับค่า username จาก params

  try {
    // ดึงข้อมูลผู้ใช้จากฐานข้อมูลตาม username
    const user = await User.findOne({
      where: { username },  // ค้นหาผู้ใช้โดยใช้ username
      attributes: { exclude: ["password"] },  // ซ่อนรหัสผ่าน
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ส่งข้อมูลผู้ใช้กลับ
    res.status(200).json({
      message: "User data retrieved successfully",
      data: user,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// ✅ อัปเดตข้อมูลผู้ใช้
const updateUser = async (req, res) => {
  const { user_id } = req.params;
  const { username, fullname, email, role, password } = req.body;

  try {
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ อัปเดตเฉพาะข้อมูลที่ส่งมา (ถ้ามี)
    if (username) user.username = username;
    if (email) user.email = email;
    if (role) user.role = role;

    // ✅ หากมีการเปลี่ยนรหัสผ่าน ให้เข้ารหัสก่อน
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    res.status(200).json({
      message: "User updated successfully",
      data: {
        id: user.user_id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ ลบผู้ใช้
const deleteUser = async (req, res) => {
  const { user_id } = req.params;

  try {
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ลบข้อมูลที่เกี่ยวข้องใน Notification
    await Notification.destroy({ where: { user_id } });

    // ลบผู้ใช้
    await user.destroy();

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// ✅ Export ฟังก์ชันใหม่
module.exports = { register, login, getMe, resetPassword, getAllUsers, updateUser, deleteUser ,getUserByUsername };

