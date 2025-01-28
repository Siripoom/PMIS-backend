const express = require("express");
const router = express.Router();
const { register, login, me } = require("../controllers/AuthController");
const authMiddleware = require("../middlewares/authMiddleware");

// Auth routes
router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, me);

module.exports = router;
