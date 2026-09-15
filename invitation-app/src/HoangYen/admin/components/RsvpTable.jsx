import React, { useState } from "react";

export default function RsvpTable({
  messages,
  onDelete,
  isTrash = false,
  onRestore,
  onForceDelete,
}) {
  const [viewMsg, setViewMsg] = useState(null);
  const total = messages.length;

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <h2 className="font-cormorant text-xl sm:text-[1.3rem] font-semibold text-dark tracking-[0.02em]">
          {isTrash ? "Lời Chúc Trong Thùng Rác" : "Khách Mời Đã Gửi Lời Chúc"}
        </h2>
        <span className="text-xs text-muted bg-cream-dark py-1 px-3 rounded-full tracking-[0.05em] self-start sm:self-auto font-medium">
          {total} lời chúc
        </span>
      </div>

      {/* ================= DESKTOP / TABLET TABLE VIEW ================= */}
      <div className="hidden md:block bg-white border border-border-solid rounded-xl overflow-hidden shadow-xs animate-[fadeUp_0.4s_ease_0.1s_both]">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-cream border-b border-border-solid">
                <th width="22%" className="py-3.5 px-5 text-left text-[0.65rem] tracking-[0.2em] uppercase text-muted font-semibold whitespace-nowrap">
                  Khách Mời
                </th>
                <th className="py-3.5 px-5 text-left text-[0.65rem] tracking-[0.2em] uppercase text-muted font-semibold whitespace-nowrap">
                  Lời Chúc
                </th>
                <th width="18%" className="py-3.5 px-5 text-left text-[0.65rem] tracking-[0.2em] uppercase text-muted font-semibold whitespace-nowrap">
                  Thời Gian
                </th>
                <th width="18%" className="py-3.5 px-5 text-left text-[0.65rem] tracking-[0.2em] uppercase text-muted font-semibold whitespace-nowrap">
                  Thao Tác
                </th>
              </tr>
            </thead>
            <tbody>
              {total > 0 ? (
                messages.map((row, i) => {
                  const firstChar = (row.guest_name || "?").charAt(0).toUpperCase();

                  const safeDateStr = (row.created_at || "").replace(" ", "T");
                  const dateObj = new Date(safeDateStr);

                  const dateStr = !isNaN(dateObj)
                    ? dateObj.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
                    : row.created_at;
                  const timeStr = !isNaN(dateObj)
                    ? dateObj.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
                    : "";

                  return (
                    <tr
                      key={row.id}
                      className="border-b border-border-solid transition-colors duration-150 hover:bg-[#fdfaf6] last:border-b-0"
                      style={{ animation: `fadeUp 0.3s ease ${i * 0.02}s both` }}
                    >
                      <td className="py-4 px-5 align-top">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-gold-light to-gold-dark rounded-full inline-flex items-center justify-center text-white font-semibold text-xs shrink-0 shadow-xs">
                            {firstChar}
                          </div>
                          <span className="font-medium text-dark text-sm">
                            {row.guest_name}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-5 align-top">
                        <span className="font-cormorant text-2xl text-gold-light leading-[0.5] align-[-0.3em] mr-0.5 opacity-70">
                          "
                        </span>
                        <span className="text-text-admin text-[0.95rem] leading-relaxed whitespace-pre-wrap break-words italic font-cormorant">
                          {row.message.length > 90 ? row.message.substring(0, 90) + "..." : row.message}
                        </span>
                      </td>
                      <td className="py-4 px-5 align-top">
                        <div className="inline-flex flex-col items-start gap-0.5">
                          <span className="text-xs font-medium text-dark">{dateStr}</span>
                          <span className="text-[0.7rem] text-muted">{timeStr}</span>
                        </div>
                      </td>
                      <td className="py-4 px-5 align-top">
                        <div className="flex items-center gap-2">
                          <button
                            className="inline-flex items-center gap-1 py-1.5 px-2.5 bg-transparent border border-border-solid rounded-md text-muted text-xs font-medium cursor-pointer transition-all duration-150 whitespace-nowrap hover:bg-[#f0f9ff] hover:border-[#bae6fd] hover:text-[#0284c7]"
                            onClick={() => setViewMsg(row)}
                            title="Xem chi tiết"
                          >
                            👁 Xem
                          </button>

                          {isTrash ? (
                            <>
                              <button
                                className="inline-flex items-center gap-1 py-1.5 px-2.5 bg-transparent border border-border-solid rounded-md text-muted text-xs font-medium cursor-pointer transition-all duration-150 whitespace-nowrap hover:bg-[#f0fff4] hover:border-[#c6f6d5] hover:text-[#276749]"
                                onClick={() => {
                                  if (window.confirm(`Khôi phục lời chúc của ${row.guest_name}?`)) {
                                    onRestore && onRestore(row.id);
                                  }
                                }}
                                title="Khôi phục lời chúc"
                              >
                                ♻️ Khôi phục
                              </button>
                              <button
                                className="inline-flex items-center gap-1 py-1.5 px-2.5 bg-transparent border border-border-solid rounded-md text-muted text-xs font-medium cursor-pointer transition-all duration-150 whitespace-nowrap hover:bg-red-light hover:border-[#fed7d7] hover:text-red"
                                onClick={() => {
                                  if (window.confirm(`XÓA VĨNH VIỄN lời chúc của ${row.guest_name}? (Không thể khôi phục)`)) {
                                    onForceDelete && onForceDelete(row.id);
                                  }
                                }}
                                title="Xóa vĩnh viễn"
                              >
                                💥 Xóa
                              </button>
                            </>
                          ) : (
                            <button
                              className="inline-flex items-center gap-1 py-1.5 px-2.5 bg-transparent border border-border-solid rounded-md text-muted text-xs font-medium cursor-pointer transition-all duration-150 whitespace-nowrap hover:bg-red-light hover:border-[#fed7d7] hover:text-red"
                              onClick={() => {
                                if (window.confirm(`Xóa lời chúc của ${row.guest_name}?`)) {
                                  onDelete && onDelete(row.id);
                                }
                              }}
                              title="Xóa lời chúc"
                            >
                              🗑 Xóa
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="py-16 px-5 text-center">
                    <div className="text-4xl mb-3 opacity-40">{isTrash ? "🗑️" : "📭"}</div>
                    <div className="font-cormorant text-xl text-muted mb-1">
                      {isTrash ? "Thùng rác trống" : "Chưa có lời chúc nào"}
                    </div>
                    <div className="text-xs text-[rgba(122,109,94,0.6)] tracking-[0.05em]">
                      {isTrash ? "Không có lời chúc nào bị xóa" : "Khách mời chưa gửi phản hồi"}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MOBILE CARD VIEW (< 768px) ================= */}
      <div className="block md:hidden space-y-3 animate-[fadeUp_0.4s_ease_0.1s_both]">
        {total > 0 ? (
          messages.map((row, i) => {
            const firstChar = (row.guest_name || "?").charAt(0).toUpperCase();
            const safeDateStr = (row.created_at || "").replace(" ", "T");
            const dateObj = new Date(safeDateStr);

            const dateStr = !isNaN(dateObj)
              ? dateObj.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
              : row.created_at;
            const timeStr = !isNaN(dateObj)
              ? dateObj.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
              : "";

            return (
              <div
                key={row.id}
                className="bg-white border border-border-solid rounded-xl p-4 shadow-xs"
                style={{ animation: `fadeUp 0.3s ease ${i * 0.03}s both` }}
              >
                {/* Header card: Avatar, Name, Date */}
                <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-border-solid/60">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 bg-gradient-to-br from-gold-light to-gold-dark rounded-full flex items-center justify-center text-white font-semibold text-xs shrink-0 shadow-xs">
                      {firstChar}
                    </div>
                    <span className="font-medium text-dark text-sm truncate">
                      {row.guest_name}
                    </span>
                  </div>
                  <span className="text-[0.7rem] text-muted bg-cream py-0.5 px-2 rounded font-mono shrink-0">
                    {dateStr} {timeStr}
                  </span>
                </div>

                {/* Message preview */}
                <div className="bg-[#fdfaf6] border border-[#e8d5a3]/30 rounded-lg p-3 mb-3">
                  <p className="font-cormorant text-base text-text-admin italic leading-relaxed whitespace-pre-wrap line-clamp-3">
                    "{row.message}"
                  </p>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    className="flex-1 inline-flex items-center justify-center gap-1 py-2 px-3 bg-white border border-border-solid rounded-lg text-muted text-xs font-medium cursor-pointer transition-colors hover:bg-[#f0f9ff] hover:text-[#0284c7]"
                    onClick={() => setViewMsg(row)}
                  >
                    👁 Xem
                  </button>

                  {isTrash ? (
                    <>
                      <button
                        className="flex-1 inline-flex items-center justify-center gap-1 py-2 px-3 bg-white border border-border-solid rounded-lg text-[#276749] text-xs font-medium cursor-pointer transition-colors hover:bg-[#f0fff4]"
                        onClick={() => {
                          if (window.confirm(`Khôi phục lời chúc của ${row.guest_name}?`)) {
                            onRestore && onRestore(row.id);
                          }
                        }}
                      >
                        ♻️ Khôi phục
                      </button>
                      <button
                        className="flex-1 inline-flex items-center justify-center gap-1 py-2 px-3 bg-white border border-border-solid rounded-lg text-red text-xs font-medium cursor-pointer transition-colors hover:bg-red-light"
                        onClick={() => {
                          if (window.confirm(`XÓA VĨNH VIỄN lời chúc của ${row.guest_name}?`)) {
                            onForceDelete && onForceDelete(row.id);
                          }
                        }}
                      >
                        💥 Xóa
                      </button>
                    </>
                  ) : (
                    <button
                      className="flex-1 inline-flex items-center justify-center gap-1 py-2 px-3 bg-white border border-border-solid rounded-lg text-red text-xs font-medium cursor-pointer transition-colors hover:bg-red-light"
                      onClick={() => {
                        if (window.confirm(`Xóa lời chúc của ${row.guest_name}?`)) {
                          onDelete && onDelete(row.id);
                        }
                      }}
                    >
                      🗑 Xóa
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white border border-border-solid rounded-xl p-8 text-center shadow-xs">
            <div className="text-3xl mb-2 opacity-40">{isTrash ? "🗑️" : "📭"}</div>
            <div className="font-cormorant text-lg text-muted mb-1">
              {isTrash ? "Thùng rác trống" : "Chưa có lời chúc nào"}
            </div>
            <div className="text-xs text-[rgba(122,109,94,0.6)]">
              {isTrash ? "Không có lời chúc nào bị xóa" : "Khách mời chưa gửi phản hồi"}
            </div>
          </div>
        )}
      </div>

      {/* ================= MODAL VIEW DETAIL ================= */}
      {viewMsg && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-xs p-3.5 sm:p-4"
          onClick={() => setViewMsg(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-[fadeUp_0.25s_ease-out] flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-border-solid flex justify-between items-center bg-[#faf8f5]">
              <h3 className="font-cormorant text-lg sm:text-xl font-semibold text-dark">
                Chi tiết lời chúc
              </h3>
              <button
                className="text-muted hover:text-dark text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors cursor-pointer"
                onClick={() => setViewMsg(null)}
                aria-label="Đóng"
              >
                ×
              </button>
            </div>

            <div className="p-5 sm:p-7 overflow-y-auto flex-1">
              <div className="flex items-center gap-3.5 mb-5">
                <div className="w-11 h-11 bg-gradient-to-br from-gold-light to-gold-dark rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-sm shrink-0">
                  {(viewMsg.guest_name || "?").charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-base font-semibold text-dark">{viewMsg.guest_name}</div>
                  <div className="text-xs text-muted mt-0.5">
                    {new Date((viewMsg.created_at || "").replace(" ", "T")).toLocaleString("vi-VN")}
                  </div>
                </div>
              </div>

              <div className="bg-[#fdfaf6] border border-[#e8d5a3]/40 rounded-xl p-4 sm:p-6 relative">
                <span className="absolute top-2 left-3 font-cormorant text-5xl text-gold-light opacity-20 leading-none">
                  "
                </span>
                <p className="relative font-cormorant text-lg sm:text-xl text-text-admin leading-relaxed italic whitespace-pre-wrap z-10 max-h-[300px] overflow-y-auto pr-2">
                  {viewMsg.message}
                </p>
                <span className="absolute bottom-[-1.2rem] right-3 font-cormorant text-5xl text-gold-light opacity-20 leading-none rotate-180">
                  "
                </span>
              </div>
            </div>

            <div className="px-5 py-3.5 border-t border-border-solid bg-gray-50 flex justify-end">
              <button
                className="w-full sm:w-auto px-6 py-2 text-xs sm:text-sm font-medium text-dark bg-white border border-border-solid rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => setViewMsg(null)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
