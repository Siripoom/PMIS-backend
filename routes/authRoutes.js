const express = require('express');
const { register, login, getMe, resetPassword } = require('../controllers/authController'); 
const { authenticateToken } = require("../middlewares/authMiddleware");
const { logAction } = require("../middlewares/logMiddleware");

const router = express.Router();

router.post('/register', register);

// ✅ แก้ไข /login ให้ `logAction()` ทำงานหลังจาก `login()`
router.post('/login', async (req, res, next) => {
    await login(req, res);  // ✅ login ทำงานก่อน
    if (res.locals.user) {  // ✅ ตรวจสอบว่ามี user หลัง login สำเร็จ
        req.user = res.locals.user;  // ✅ ส่งข้อมูล user ไปยัง logAction
        next();
    }
}, logAction("User Logged In"));

router.get('/me', authenticateToken, getMe, logAction("User Accessed Profile"));

router.post('/reset-password', authenticateToken, resetPassword, logAction("User Reset Password")); 

module.exports = router;
