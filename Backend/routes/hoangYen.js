const express = require("express");
const router = express.Router();
const pool = require("../db");
const verifyToken = require("../middleware/auth");

// =============================================
// GET /api/hoang-yen — Lấy danh sách lời chúc (không bị xóa mềm)
// =============================================
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, guest_name, message, attendance_status, created_at FROM hoang_yen WHERE is_deleted = 0 ORDER BY created_at DESC LIMIT 100"
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("❌ Lỗi lấy lời chúc Hoàng Yến:", err.message);
    res.status(500).json({ success: false, error: "Lỗi server: " + err.message });
  }
});

// =============================================
// POST /api/hoang-yen — Gửi lời chúc mới
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
    const [[{ maxId }]] = await pool.query("SELECT MAX(id) as maxId FROM hoang_yen");
    const nextId = (maxId || 0) + 1;

    // Tính thời gian Việt Nam (UTC+7)
    const now = new Date();
    const vnTime = new Date(now.getTime() + (7 * 60 * 60 * 1000));
    const vnTimeStr = vnTime.toISOString().replace("T", " ").substring(0, 19);

    await pool.query(
      "INSERT INTO hoang_yen (id, guest_name, message, attendance_status, is_deleted, created_at) VALUES (?, ?, ?, ?, 0, ?)",
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
    console.error("❌ Lỗi gửi lời chúc Hoàng Yến:", err.message);
    res.status(500).json({ success: false, error: "Lỗi Database: " + err.message });
  }
});

// =============================================
// GET /api/hoang-yen/trash — Lấy danh sách thùng rác (Admin)
// =============================================
router.get("/trash", verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, guest_name, message, attendance_status, created_at FROM hoang_yen WHERE is_deleted = 1 ORDER BY created_at DESC"
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("❌ Lỗi lấy thùng rác Hoàng Yến:", err.message);
    res.status(500).json({ success: false, error: "Lỗi server: " + err.message });
  }
});

// =============================================
// DELETE /api/hoang-yen/:id — XÓA MỀM lời chúc (Admin)
// =============================================
router.delete("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query("UPDATE hoang_yen SET is_deleted = 1 WHERE id = ?", [id]);
    if (result.affectedRows > 0) {
      res.json({ success: true, message: "Đã đưa vào thùng rác" });
    } else {
      res.status(404).json({ success: false, error: "Không tìm thấy lời chúc" });
    }
  } catch (err) {
    console.error("❌ Lỗi xóa mềm lời chúc Hoàng Yến:", err.message);
    res.status(500).json({ success: false, error: "Lỗi Database: " + err.message });
  }
});

// =============================================
// PUT /api/hoang-yen/restore/:id — KHÔI PHỤC lời chúc (Admin)
// =============================================
router.put("/restore/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query("UPDATE hoang_yen SET is_deleted = 0 WHERE id = ?", [id]);
    if (result.affectedRows > 0) {
      res.json({ success: true, message: "Khôi phục thành công" });
    } else {
      res.status(404).json({ success: false, error: "Không tìm thấy lời chúc" });
    }
  } catch (err) {
    console.error("❌ Lỗi khôi phục lời chúc Hoàng Yến:", err.message);
    res.status(500).json({ success: false, error: "Lỗi Database: " + err.message });
  }
});

// =============================================
// DELETE /api/hoang-yen/force/:id — XÓA VĨNH VIỄN lời chúc (Admin)
// =============================================
router.delete("/force/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query("DELETE FROM hoang_yen WHERE id = ?", [id]);
    if (result.affectedRows > 0) {
      res.json({ success: true, message: "Đã xóa vĩnh viễn" });
    } else {
      res.status(404).json({ success: false, error: "Không tìm thấy lời chúc" });
    }
  } catch (err) {
    console.error("❌ Lỗi xóa vĩnh viễn lời chúc Hoàng Yến:", err.message);
    res.status(500).json({ success: false, error: "Lỗi Database: " + err.message });
  }
});

module.exports = router;
