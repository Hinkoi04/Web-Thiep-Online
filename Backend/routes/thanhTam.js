const express = require("express");
const router = express.Router();
const pool = require("../db");
const verifyToken = require("../middleware/auth");

// Tự động kiểm tra / tạo bảng thanh_tam nếu chưa có
async function ensureTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS thanh_tam (
        id int(11) NOT NULL AUTO_INCREMENT,
        guest_name varchar(100) DEFAULT NULL,
        message mediumtext DEFAULT NULL,
        attendance_status varchar(50) DEFAULT NULL,
        is_deleted tinyint(1) DEFAULT 0,
        created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
  } catch (err) {
    console.error("❌ Lỗi kiểm tra bảng thanh_tam:", err.message);
  }
}

// =============================================
// GET /api/thanh-tam — Lấy danh sách lời chúc (không bị xóa mềm)
// =============================================
router.get("/", async (req, res) => {
  await ensureTable();
  try {
    const [rows] = await pool.query(
      "SELECT id, guest_name, message, attendance_status, created_at FROM thanh_tam WHERE is_deleted = 0 ORDER BY created_at DESC LIMIT 100"
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("❌ Lỗi lấy lời chúc Thanh Tâm:", err.message);
    res.status(500).json({ success: false, error: "Lỗi server: " + err.message });
  }
});

// =============================================
// POST /api/thanh-tam — Gửi lời chúc mới
// =============================================
router.post("/", async (req, res) => {
  await ensureTable();
  const { guest_name, message, attendance_status } = req.body;

  if (!guest_name || !guest_name.trim() || !message || !message.trim()) {
    return res.status(400).json({
      success: false,
      error: "Vui lòng nhập đầy đủ tên và lời chúc!",
    });
  }

  try {
    // Lấy ID lớn nhất hiện tại, nếu chưa có thì bắt đầu từ 1
    const [[{ maxId }]] = await pool.query("SELECT MAX(id) as maxId FROM thanh_tam");
    const nextId = (maxId || 0) + 1;

    // Tính thời gian Việt Nam (UTC+7)
    const now = new Date();
    const vnTime = new Date(now.getTime() + (7 * 60 * 60 * 1000));
    const vnTimeStr = vnTime.toISOString().replace("T", " ").substring(0, 19);

    await pool.query(
      "INSERT INTO thanh_tam (id, guest_name, message, attendance_status, is_deleted, created_at) VALUES (?, ?, ?, ?, 0, ?)",
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
    console.error("❌ Lỗi gửi lời chúc Thanh Tâm:", err.message);
    res.status(500).json({ success: false, error: "Lỗi Database: " + err.message });
  }
});

// =============================================
// GET /api/thanh-tam/trash — Lấy danh sách thùng rác (Admin)
// =============================================
router.get("/trash", verifyToken, async (req, res) => {
  await ensureTable();
  try {
    const [rows] = await pool.query(
      "SELECT id, guest_name, message, attendance_status, created_at FROM thanh_tam WHERE is_deleted = 1 ORDER BY created_at DESC"
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("❌ Lỗi lấy thùng rác Thanh Tâm:", err.message);
    res.status(500).json({ success: false, error: "Lỗi server: " + err.message });
  }
});

// =============================================
// DELETE /api/thanh-tam/:id — XÓA MỀM lời chúc (Admin)
// =============================================
router.delete("/:id", verifyToken, async (req, res) => {
  await ensureTable();
  const { id } = req.params;
  try {
    const [result] = await pool.query("UPDATE thanh_tam SET is_deleted = 1 WHERE id = ?", [id]);
    if (result.affectedRows > 0) {
      res.json({ success: true, message: "Đã đưa vào thùng rác" });
    } else {
      res.status(404).json({ success: false, error: "Không tìm thấy lời chúc" });
    }
  } catch (err) {
    console.error("❌ Lỗi xóa mềm lời chúc Thanh Tâm:", err.message);
    res.status(500).json({ success: false, error: "Lỗi Database: " + err.message });
  }
});

// =============================================
// PUT /api/thanh-tam/restore/:id — KHÔI PHỤC lời chúc (Admin)
// =============================================
router.put("/restore/:id", verifyToken, async (req, res) => {
  await ensureTable();
  const { id } = req.params;
  try {
    const [result] = await pool.query("UPDATE thanh_tam SET is_deleted = 0 WHERE id = ?", [id]);
    if (result.affectedRows > 0) {
      res.json({ success: true, message: "Khôi phục thành công" });
    } else {
      res.status(404).json({ success: false, error: "Không tìm thấy lời chúc" });
    }
  } catch (err) {
    console.error("❌ Lỗi khôi phục lời chúc Thanh Tâm:", err.message);
    res.status(500).json({ success: false, error: "Lỗi Database: " + err.message });
  }
});

// =============================================
// DELETE /api/thanh-tam/force/:id — XÓA VĨNH VIỄN lời chúc (Admin)
// =============================================
router.delete("/force/:id", verifyToken, async (req, res) => {
  await ensureTable();
  const { id } = req.params;
  try {
    const [result] = await pool.query("DELETE FROM thanh_tam WHERE id = ?", [id]);
    if (result.affectedRows > 0) {
      res.json({ success: true, message: "Đã xóa vĩnh viễn" });
    } else {
      res.status(404).json({ success: false, error: "Không tìm thấy lời chúc" });
    }
  } catch (err) {
    console.error("❌ Lỗi xóa vĩnh viễn lời chúc Thanh Tâm:", err.message);
    res.status(500).json({ success: false, error: "Lỗi Database: " + err.message });
  }
});

module.exports = router;
