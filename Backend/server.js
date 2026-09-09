require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 3001;

// =============================================
// MIDDLEWARE
// =============================================
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =============================================
// ROUTES
// =============================================
const rsvpRoutes = require("./routes/rsvp");
const adminRoutes = require("./routes/admin");

app.use("/api/rsvp", rsvpRoutes);
app.use("/api/admin", adminRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// =============================================
// TỰ ĐỘNG TẠO BẢNG NẾU CHƯA CÓ
// =============================================
async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS rsvp_messages (
        id int(11) NOT NULL AUTO_INCREMENT,
        guest_name varchar(100) DEFAULT NULL,
        message mediumtext DEFAULT NULL,
        attendance_status varchar(50) DEFAULT NULL,
        created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("✅ Bảng rsvp_messages đã sẵn sàng");
  } catch (err) {
    console.error("❌ Lỗi tạo bảng:", err.message);
  }
}

// =============================================
// KHỞI ĐỘNG SERVER
// =============================================
app.listen(PORT, async () => {
  console.log(`\n🚀 Backend đang chạy tại: http://localhost:${PORT}`);
  console.log(`📡 CORS cho phép: ${process.env.CORS_ORIGIN || "http://localhost:5173"}`);
  console.log(`🔗 API Endpoints:`);
  console.log(`   GET  /api/rsvp    — Lấy danh sách lời chúc`);
  console.log(`   POST /api/rsvp    — Gửi lời chúc mới`);
  console.log(`   GET  /api/health  — Health check\n`);
  await initDB();
});
