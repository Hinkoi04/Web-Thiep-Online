import React from "react";

export default function AdminTopbar({ title, onOpenSidebar }) {
  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-pink-100 py-3.5 px-4 sm:py-4 sm:px-6 md:px-8 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger button */}
        <button
          onClick={onOpenSidebar}
          className="md:hidden flex flex-col justify-center items-center w-9 h-9 rounded-lg border border-pink-200 bg-pink-50/60 text-pink-700 hover:bg-pink-100/80 transition-colors p-1.5 cursor-pointer"
          aria-label="Mở menu"
        >
          <span className="w-5 h-0.5 bg-pink-700 rounded-full mb-1"></span>
          <span className="w-5 h-0.5 bg-pink-700 rounded-full mb-1"></span>
          <span className="w-5 h-0.5 bg-pink-700 rounded-full"></span>
        </button>

        <h1 className="text-base sm:text-lg md:text-xl font-bold text-[#4a2e3b] font-serif">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-2 bg-pink-50 border border-pink-200 py-1.5 px-3 rounded-full shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[11px] sm:text-xs text-pink-800 font-semibold font-sans">
            Thanh Tâm · Admin
          </span>
        </div>
      </div>
    </header>
  );
}
