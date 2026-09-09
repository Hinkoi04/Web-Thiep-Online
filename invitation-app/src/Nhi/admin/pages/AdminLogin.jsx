import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        localStorage.setItem("admin_token", data.token);
        navigate("/admin");
      } else {
        setError(data.error || "Mật khẩu không chính xác!");
      }
    } catch (err) {
      setError("Lỗi kết nối đến máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-cream font-sans text-text-admin flex-col">
      {/* Background patterns */}
      <div className="fixed inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 60% at 20% 10%, rgba(184,150,90,0.08) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 80% 90%, rgba(184,150,90,0.06) 0%, transparent 60%)" }}></div>
      
      <div className="relative bg-white border border-border-admin rounded-sm py-14 px-12 w-full max-w-[400px] shadow-[0_20px_60px_rgba(26,18,8,0.08),0_4px_16px_rgba(26,18,8,0.04)] z-10 animate-[fadeUp_0.6s_ease_both]">
        {/* Top Gold Line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60px] h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent"></div>
        
        <div className="w-14 h-14 bg-gradient-to-br from-gold-light to-gold-dark rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
          🔐
        </div>
        <h1 className="font-cormorant text-[1.8rem] font-semibold text-dark text-center tracking-[0.02em] mb-1.5">Quản Trị</h1>
        <p className="text-center text-[0.8rem] text-muted tracking-[0.12em] uppercase mb-9">Khu Vực Quản Lý Lời Chúc</p>

        {error && <div className="flex items-center gap-3 py-3.5 px-5 rounded bg-red-light border border-[#fed7d7] text-red text-sm mb-7">⚠ {error}</div>}

        <form onSubmit={handleLogin}>
          <div className="relative mb-5">
            <label className="block text-[0.7rem] tracking-[0.15em] uppercase text-muted mb-2 font-medium" htmlFor="pwd">Mật khẩu</label>
            <input
              className="w-full py-3.5 px-4 bg-cream border border-border-admin rounded-sm text-[0.95rem] text-dark outline-none transition-all duration-200 focus:border-gold focus:ring-[3px] focus:ring-gold-dim"
              type="password"
              id="pwd"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
            />
          </div>
          <button className="w-full p-3.5 bg-gradient-to-br from-gold-light to-gold-dark text-white border-none rounded-sm text-[0.8rem] font-medium tracking-[0.15em] uppercase cursor-pointer transition-all duration-200 mt-2 hover:opacity-90 hover:-translate-y-[1px] active:translate-y-0" type="submit" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng Nhập →"}
          </button>
        </form>

        <div className="text-center mt-7 text-border-admin text-[1.2rem] tracking-[0.5em]">
          · · ·
        </div>
      </div>
    </div>
  );
}
