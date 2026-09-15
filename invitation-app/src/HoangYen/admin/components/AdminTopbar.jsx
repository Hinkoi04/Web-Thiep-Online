import React from "react";

export default function AdminTopbar({
  title = "Danh Sách Lời Chúc · Hoàng Yến",
  onOpenSidebar,
}) {
  const now = new Date();
  const dateStr = now.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const timeStr = now.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-white border-b border-border-solid px-4 sm:px-6 md:px-9 h-16 flex items-center justify-between sticky top-0 z-40 shadow-xs">
      <div className="flex items-center gap-3 min-w-0">
        {/* Nút mở menu trên Mobile / Tablet */}
        <button
          type="button"
          onClick={onOpenSidebar}
          className="md:hidden p-2 -ml-1 text-dark hover:bg-cream rounded-lg text-lg flex items-center justify-center transition-colors cursor-pointer"
          title="Mở menu"
          aria-label="Mở menu"
        >
          ☰
        </button>

        <h1 className="font-cormorant text-lg sm:text-xl md:text-[1.5rem] font-semibold text-dark tracking-[0.02em] truncate">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className="text-[0.72rem] sm:text-[0.8rem] text-muted tracking-[0.03em] bg-cream sm:bg-transparent py-1 px-2.5 sm:p-0 rounded-full sm:rounded-none">
          <span className="hidden sm:inline">{dateStr} — </span>
          <span>{timeStr}</span>
        </span>
      </div>
    </div>
  );
}
