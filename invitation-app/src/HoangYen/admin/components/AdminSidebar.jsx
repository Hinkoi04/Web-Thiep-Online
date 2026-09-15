import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function AdminSidebar({ isOpen = false, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("admin_token_hoangyen");
    navigate("/admin/login");
  };

  const isActive = (path) => location.pathname === path;

  const handleNavigate = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  const NavContent = () => (
    <>
      <div className="pt-6 sm:pt-8 px-6 pb-5 border-b border-[rgba(255,255,255,0.08)] flex items-center justify-between">
        <div>
          <div className="text-[0.65rem] tracking-[0.2em] uppercase text-gold-light opacity-60 mb-1">
            Admin Panel
          </div>
          <div className="font-cormorant text-xl text-gold-light tracking-[0.04em] leading-tight">
            Hoàng Yến · 2026
          </div>
        </div>

        {/* Nút đóng trên mobile drawer */}
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden text-[rgba(255,255,255,0.6)] hover:text-white p-1 text-2xl leading-none cursor-pointer"
            aria-label="Đóng menu"
          >
            ×
          </button>
        )}
      </div>

      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        <div className="text-[0.62rem] tracking-[0.2em] uppercase text-[rgba(255,255,255,0.3)] px-3 mb-2 mt-2 font-semibold">
          Quản lý Lời Chúc
        </div>
        <div
          onClick={() => handleNavigate("/admin")}
          className={`flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm no-underline transition-all duration-150 cursor-pointer ${
            isActive("/admin")
              ? "bg-gold-dim text-gold-light font-medium shadow-xs"
              : "text-[rgba(255,255,255,0.6)] hover:bg-[rgba(255,255,255,0.06)] hover:text-white"
          }`}
        >
          <span className="text-base w-5 text-center">💌</span>
          Bảng Lời Chúc
        </div>

        <div className="text-[0.62rem] tracking-[0.2em] uppercase text-[rgba(255,255,255,0.3)] px-3 mb-2 mt-5 font-semibold">
          Hệ thống
        </div>
        <div
          onClick={() => handleNavigate("/admin/trash")}
          className={`flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm no-underline transition-all duration-150 cursor-pointer ${
            isActive("/admin/trash")
              ? "bg-gold-dim text-gold-light font-medium shadow-xs"
              : "text-[rgba(255,255,255,0.6)] hover:bg-[rgba(255,255,255,0.06)] hover:text-white"
          }`}
        >
          <span className="text-base w-5 text-center">🗑️</span>
          Thùng Rác
        </div>

        <div className="text-[0.62rem] tracking-[0.2em] uppercase text-[rgba(255,255,255,0.3)] px-3 mb-2 mt-5 font-semibold">
          Xem trước
        </div>
        <div
          onClick={() => handleNavigate("/")}
          className="flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm text-[rgba(255,255,255,0.6)] hover:bg-[rgba(255,255,255,0.06)] hover:text-white no-underline transition-all duration-150 cursor-pointer"
        >
          <span className="text-base w-5 text-center">🎓</span>
          Xem Thiệp Mời
        </div>
      </nav>

      <div className="p-4 border-t border-[rgba(255,255,255,0.08)]">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full py-2.5 px-3 bg-transparent border border-[rgba(255,255,255,0.12)] rounded-lg text-[rgba(255,255,255,0.5)] text-xs tracking-[0.05em] cursor-pointer transition-all duration-150 hover:border-[#c0392b] hover:text-[#e74c3c] hover:bg-[rgba(192,57,43,0.1)]"
        >
          <span>→</span> Đăng Xuất
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-[240px] hidden md:flex bg-dark flex-col z-30 shadow-md">
        <NavContent />
      </aside>

      {/* Mobile Drawer (Slide-over) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={onClose}
          />
          {/* Drawer panel */}
          <aside className="relative w-[260px] max-w-[80vw] bg-dark flex flex-col h-full z-10 shadow-2xl animate-[slideRight_0.25s_ease-out]">
            <NavContent />
          </aside>
        </div>
      )}
    </>
  );
}
