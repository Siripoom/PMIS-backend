const express = require('express');
const { register, login, getMe, resetPassword, getAllUsers, updateUser, deleteUser } = require('../controllers/authController'); // ✅ เพิ่ม updateUser และ deleteUser
const { authenticateToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me',  authenticateToken,getMe);  //authenticateToken,
router.post('/reset-password', resetPassword); // ✅ รีเซ็ตรหัสผ่านผ่าน email
router.get('/users', getAllUsers); // ❌ ลบ authenticateToken ออก
router.put('/users/:user_id', updateUser);
router.delete('/users/:user_id', deleteUser);


module.exports = router;