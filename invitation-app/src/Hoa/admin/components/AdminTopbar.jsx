import React from "react";

export default function AdminTopbar() {
  // Format dd/mm/yyyy - HH:MM
  const now = new Date();
  const dateStr = now.toLocaleDateString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric"
  });
  const timeStr = now.toLocaleTimeString("vi-VN", {
    hour: "2-digit", minute: "2-digit"
  });

  return (
    <div className="bg-white border-b border-border-solid px-9 h-16 flex items-center justify-between sticky top-0 z-50 max-[900px]:px-5">
      <h1 className="font-cormorant text-[1.5rem] text-dark tracking-[0.02em]">Danh Sách Lời Chúc</h1>
      <span className="text-[0.8rem] text-muted tracking-[0.05em]">{dateStr} — {timeStr}</span>
    </div>
  );
}
