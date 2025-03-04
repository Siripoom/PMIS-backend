const express = require('express');
const { register, login, getMe, resetPassword } = require('../controllers/authController'); 
const { authenticateToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me',  authenticateToken,getMe);  //authenticateToken,
router.post('/reset-password', resetPassword); // ✅ รีเซ็ตรหัสผ่านผ่าน email

module.exports = router;
