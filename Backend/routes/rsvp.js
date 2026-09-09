const express = require("express");
const router = express.Router();
const pool = require("../db");
const verifyToken = require("../middleware/auth");

// =============================================
// GET /api/rsvp — Lấy danh sách lời chúc (không bị xóa mềm)
// =============================================
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, guest_name, message, attendance_status, created_at FROM rsvp_messages WHERE is_deleted = 0 ORDER BY created_at DESC LIMIT 50"
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("❌ Lỗi lấy RSVP:", err.message);
    res.status(500).json({ success: false, error: "Lỗi server" });
  }
});

// =============================================
// POST /api/rsvp — Gửi lời chúc mới
// =============================================
router.post("/", async (req, res) => {
  const { guest_name, message, attendance_status } = req.body;

  if (!guest_name || !guest_name.trim() || !message || !message.trim()) {
    return res.status(400).json({
      success: false,
      error: "Vui lòng nhập đầy đủ tên và lời chúc!",
    });
  }

  try {
    // Lấy ID lớn nhất hiện tại, nếu chưa có thì bắt đầu từ 1
    const [[{ maxId }]] = await pool.query("SELECT MAX(id) as maxId FROM rsvp_messages");
    const nextId = (maxId || 0) + 1;

    // Tính thời gian Việt Nam (UTC+7)
    const now = new Date();
    const vnTime = new Date(now.getTime() + (7 * 60 * 60 * 1000));
    // Format thành YYYY-MM-DD HH:mm:ss
    const vnTimeStr = vnTime.toISOString().replace('T', ' ').substring(0, 19);

    const [result] = await pool.query(
      "INSERT INTO rsvp_messages (id, guest_name, message, attendance_status, created_at) VALUES (?, ?, ?, ?, ?)",
      [nextId, guest_name.trim(), message.trim(), attendance_status || null, vnTimeStr]
    );
    res.json({
      success: true,
      data: {
        id: nextId,
        guest_name: guest_name.trim(),
        message: message.trim(),
        attendance_status: attendance_status || null,
        created_at: vnTimeStr,
      },
    });
  } catch (err) {
    console.error("❌ Lỗi gửi RSVP:", err.message);
    res.status(500).json({ success: false, error: "Lỗi Database: " + err.message });
  }
});

// =============================================
// GET /api/rsvp/trash — Lấy danh sách lời chúc TRONG THÙNG RÁC (cần Admin)
// =============================================
router.get("/trash", verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, guest_name, message, attendance_status, created_at FROM rsvp_messages WHERE is_deleted = 1 ORDER BY created_at DESC"
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("❌ Lỗi lấy thùng rác:", err.message);
    res.status(500).json({ success: false, error: "Lỗi server" });
  }
});

// =============================================
// DELETE /api/rsvp/:id — XÓA MỀM lời chúc (cần Admin)
// =============================================
router.delete("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query("UPDATE rsvp_messages SET is_deleted = 1 WHERE id = ?", [id]);
    if (result.affectedRows > 0) {
      res.json({ success: true, message: "Đã đưa vào thùng rác" });
    } else {
      res.status(404).json({ success: false, error: "Không tìm thấy lời chúc" });
    }
  } catch (err) {
    console.error("❌ Lỗi xóa mềm RSVP:", err.message);
    res.status(500).json({ success: false, error: "Lỗi Database: " + err.message });
  }
});

// =============================================
// PUT /api/rsvp/restore/:id — KHÔI PHỤC lời chúc (cần Admin)
// =============================================
router.put("/restore/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query("UPDATE rsvp_messages SET is_deleted = 0 WHERE id = ?", [id]);
    if (result.affectedRows > 0) {
      res.json({ success: true, message: "Khôi phục thành công" });
    } else {
      res.status(404).json({ success: false, error: "Không tìm thấy lời chúc" });
    }
  } catch (err) {
    console.error("❌ Lỗi khôi phục RSVP:", err.message);
    res.status(500).json({ success: false, error: "Lỗi Database: " + err.message });
  }
});

// =============================================
// DELETE /api/rsvp/force/:id — XÓA VĨNH VIỄN lời chúc (cần Admin)
// =============================================
router.delete("/force/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query("DELETE FROM rsvp_messages WHERE id = ?", [id]);
    if (result.affectedRows > 0) {
      res.json({ success: true, message: "Đã xóa vĩnh viễn" });
    } else {
      res.status(404).json({ success: false, error: "Không tìm thấy lời chúc" });
    }
  } catch (err) {
    console.error("❌ Lỗi xóa vĩnh viễn RSVP:", err.message);
    res.status(500).json({ success: false, error: "Lỗi Database: " + err.message });
  }
});

module.exports = router;
