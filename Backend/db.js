require("dotenv").config();
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) || 4000,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: true } : undefined,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true,
});

// Test kết nối khi khởi động
async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log("✅ Kết nối TiDB thành công!");
    conn.release();
  } catch (err) {
    console.error("❌ Lỗi kết nối TiDB:", err.message);
  }
}

testConnection();

module.exports = pool;
