const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/auth");

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "123";
const JWT_SECRET = process.env.JWT_SECRET || "super_secret_wedding_key_2026";

// =============================================
// POST /api/admin/login
// =============================================
router.post("/login", (req, res) => {
  const { password } = req.body;

  if (password === ADMIN_PASSWORD) {
    const token = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "1d" });
    res.json({ success: true, token });
  } else {
    res.status(401).json({ success: false, error: "Mật khẩu không chính xác!" });
  }
});

// =============================================
// GET /api/admin/check
// =============================================
router.get("/check", verifyToken, (req, res) => {
  res.json({ success: true, message: "Valid token" });
});

module.exports = router;
