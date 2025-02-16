const express = require('express');
const { register, login, getMe, resetPassword } = require('../controllers/authController'); // ✅ ตรวจสอบว่ามี resetPassword
const { authenticateToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateToken, getMe);
router.post('/reset-password', resetPassword); // ✅ ตรวจสอบว่ามีเส้นนี้

module.exports = router;
