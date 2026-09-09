import React from "react";
import { useNavigate } from "react-router-dom";

export default function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    navigate("/admin/login");
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[240px] max-[900px]:w-[200px] max-[640px]:hidden bg-dark flex flex-col z-[100]">
      <div className="pt-8 px-7 pb-6 border-b border-[rgba(255,255,255,0.06)]">
        <div className="font-cormorant text-[1.25rem] text-gold-light tracking-[0.04em] leading-[1.3]">Quản lý lời Chúc</div>
      </div>

      <nav className="flex-1 py-5 px-4">
        <div className="text-[0.62rem] tracking-[0.2em] uppercase text-[rgba(255,255,255,0.25)] px-3 mb-2 mt-4">Quản lý</div>
        <div
          onClick={() => navigate("/admin")}
          className={`flex items-center gap-3 py-2.5 px-3 rounded text-[0.875rem] no-underline transition-all duration-150 cursor-pointer ${window.location.pathname === '/admin' ? 'bg-gold-dim text-gold-light' : 'text-[rgba(255,255,255,0.55)] hover:bg-[rgba(255,255,255,0.05)] hover:text-[rgba(255,255,255,0.85)]'}`}
        >
          <span className="text-[1rem] w-5 text-center">💌</span>
          Lời Chúc
        </div>

        <div className="text-[0.62rem] tracking-[0.2em] uppercase text-[rgba(255,255,255,0.25)] px-3 mb-2 mt-4">Hệ thống</div>
        <div
          onClick={() => navigate("/admin/trash")}
          className={`flex items-center gap-3 py-2.5 px-3 rounded text-[0.875rem] no-underline transition-all duration-150 cursor-pointer ${window.location.pathname === '/admin/trash' ? 'bg-gold-dim text-gold-light' : 'text-[rgba(255,255,255,0.55)] hover:bg-[rgba(255,255,255,0.05)] hover:text-[rgba(255,255,255,0.85)]'}`}
        >
          <span className="text-[1rem] w-5 text-center">🗑️</span>
          Thùng Rác
        </div>
      </nav>

      <div className="p-4 border-t border-[rgba(255,255,255,0.06)]">
        <button onClick={handleLogout} className="flex items-center gap-2.5 w-full py-2.5 px-3 bg-transparent border border-[rgba(255,255,255,0.1)] rounded text-[rgba(255,255,255,0.4)] text-[0.8rem] tracking-[0.05em] cursor-pointer transition-all duration-150 hover:border-[#c0392b] hover:text-[#e74c3c] hover:bg-[rgba(192,57,43,0.08)]">
          <span>→</span> Đăng Xuất
        </button>
      </div>
    </aside>
  );
}
