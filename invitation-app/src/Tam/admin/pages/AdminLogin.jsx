import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!password.trim()) {
      setErrorMsg("Vui lòng nhập mật khẩu quản trị.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch(`${API_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (data.success && data.token) {
        localStorage.setItem("admin_token_tam", data.token);
        navigate("/admin");
      } else {
        setErrorMsg(data.error || "Mật khẩu không đúng.");
      }
    } catch (err) {
      setErrorMsg("Không thể kết nối đến máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2a131e] via-[#1a0f14] to-[#12080d] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-pink-200 p-6 sm:p-8 max-w-md w-full shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-pink-100 border-2 border-pink-300 rounded-full flex items-center justify-center mx-auto mb-3 text-3xl shadow-sm">
            🎓
          </div>
          <p className="text-xs uppercase tracking-[0.25em] text-pink-700 font-bold font-sans">
            Trang Quản Trị
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#4a2e3b] font-serif mt-1">
            Thanh Tâm · 2026
          </h1>
          <p className="text-xs text-gray-500 font-sans mt-1">
            Nhập mật khẩu để quản lý lời chúc và sổ lưu bút
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 py-2.5 px-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm rounded-lg font-sans">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1 font-sans">
              Mật khẩu Admin
            </label>
            <input
              type="password"
              placeholder="Nhập mật khẩu (mặc định: 123)..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full py-2.5 px-4 rounded-xl border border-pink-300 font-sans text-sm focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-xl text-sm font-bold font-sans tracking-wide shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? "Đang xác thực..." : "Đăng Nhập Quản Trị ✦"}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <a
            href="/Tam/"
            className="text-xs text-pink-600 hover:text-pink-800 font-sans font-semibold inline-flex items-center gap-1"
          >
            ← Quay lại trang thiệp mời
          </a>
        </div>
      </div>
    </div>
  );
}
