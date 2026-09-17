import React, { useState } from "react";

export default function RsvpTable({
  messages,
  onDelete,
  isTrash = false,
  onRestore,
  onForceDelete,
}) {
  const [viewMsg, setViewMsg] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = messages.filter((m) => {
    const term = searchTerm.toLowerCase();
    return (
      (m.guest_name || "").toLowerCase().includes(term) ||
      (m.message || "").toLowerCase().includes(term)
    );
  });

  const total = filtered.length;

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <h2 className="font-serif text-lg sm:text-xl font-bold text-[#4a2e3b]">
            {isTrash ? "Lời Chúc Trong Thùng Rác" : "Khách Mời Đã Gửi Lời Chúc"}
          </h2>
          <span className="text-xs text-pink-700 bg-pink-100 py-0.5 px-2.5 rounded-full font-sans font-semibold">
            {total} lời chúc
          </span>
        </div>

        {/* Search input */}
        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="🔍 Tìm theo tên hoặc nội dung..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 px-3 text-xs sm:text-sm rounded-lg border border-pink-200 bg-white font-sans focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-200"
          />
        </div>
      </div>

      {/* ================= DESKTOP TABLE VIEW ================= */}
      <div className="hidden md:block bg-white border border-pink-200/80 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-pink-50/60 border-b border-pink-200/80">
                <th width="22%" className="py-3.5 px-5 text-left text-[0.68rem] tracking-wider uppercase text-pink-800 font-sans font-bold whitespace-nowrap">
                  Khách Mời
                </th>
                <th className="py-3.5 px-5 text-left text-[0.68rem] tracking-wider uppercase text-pink-800 font-sans font-bold whitespace-nowrap">
                  Lời Chúc
                </th>
                <th width="18%" className="py-3.5 px-5 text-left text-[0.68rem] tracking-wider uppercase text-pink-800 font-sans font-bold whitespace-nowrap">
                  Thời Gian
                </th>
                <th width="20%" className="py-3.5 px-5 text-left text-[0.68rem] tracking-wider uppercase text-pink-800 font-sans font-bold whitespace-nowrap">
                  Thao Tác
                </th>
              </tr>
            </thead>
            <tbody>
              {total > 0 ? (
                filtered.map((row) => {
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
                      className="border-b border-pink-100 hover:bg-pink-50/30 transition-colors"
                    >
                      <td className="py-4 px-5 align-top">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full inline-flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-xs">
                            {firstChar}
                          </div>
                          <span className="font-semibold text-gray-800 text-sm font-sans">
                            {row.guest_name}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-5 align-top">
                        <span className="text-gray-700 text-sm italic font-serif leading-relaxed line-clamp-2">
                          "{row.message}"
                        </span>
                      </td>
                      <td className="py-4 px-5 align-top font-sans">
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-gray-700">{dateStr}</span>
                          <span className="text-[11px] text-gray-500">{timeStr}</span>
                        </div>
                      </td>
                      <td className="py-4 px-5 align-top font-sans">
                        <div className="flex items-center gap-2">
                          <button
                            className="inline-flex items-center gap-1 py-1.5 px-2.5 bg-pink-50 border border-pink-200 rounded-md text-pink-700 text-xs font-semibold hover:bg-pink-100 cursor-pointer transition-colors"
                            onClick={() => setViewMsg(row)}
                            title="Xem chi tiết"
                          >
                            👁 Xem
                          </button>

                          {isTrash ? (
                            <>
                              <button
                                className="inline-flex items-center gap-1 py-1.5 px-2.5 bg-emerald-50 border border-emerald-200 rounded-md text-emerald-700 text-xs font-semibold hover:bg-emerald-100 cursor-pointer transition-colors"
                                onClick={() => onRestore(row.id)}
                                title="Khôi phục"
                              >
                                ↩ Khôi phục
                              </button>
                              <button
                                className="inline-flex items-center gap-1 py-1.5 px-2.5 bg-rose-50 border border-rose-200 rounded-md text-rose-700 text-xs font-semibold hover:bg-rose-100 cursor-pointer transition-colors"
                                onClick={() => onForceDelete(row.id)}
                                title="Xóa vĩnh viễn"
                              >
                                ✕ Xóa hẳn
                              </button>
                            </>
                          ) : (
                            <button
                              className="inline-flex items-center gap-1 py-1.5 px-2.5 bg-rose-50 border border-rose-200 rounded-md text-rose-700 text-xs font-semibold hover:bg-rose-100 cursor-pointer transition-colors"
                              onClick={() => onDelete(row.id)}
                              title="Chuyển vào thùng rác"
                            >
                              🗑️ Xóa
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="py-12 text-center text-gray-500 text-sm font-sans">
                    {searchTerm ? "Không tìm thấy lời chúc phù hợp." : "Chưa có lời chúc nào trong danh sách."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MOBILE CARDS VIEW ================= */}
      <div className="md:hidden space-y-3">
        {total > 0 ? (
          filtered.map((row) => {
            const firstChar = (row.guest_name || "?").charAt(0).toUpperCase();
            const safeDateStr = (row.created_at || "").replace(" ", "T");
            const dateObj = new Date(safeDateStr);
            const dateStr = !isNaN(dateObj)
              ? dateObj.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
              : row.created_at;

            return (
              <div key={row.id} className="bg-white border border-pink-200/80 rounded-xl p-4 shadow-2xs">
                <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-pink-100">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full inline-flex items-center justify-center text-white font-bold text-xs shrink-0">
                      {firstChar}
                    </div>
                    <span className="font-bold text-gray-800 text-sm font-sans">{row.guest_name}</span>
                  </div>
                  <span className="text-[11px] text-gray-500 font-sans">{dateStr}</span>
                </div>

                <p className="text-xs text-gray-700 italic font-serif leading-relaxed line-clamp-3 mb-3">
                  "{row.message}"
                </p>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-pink-100 font-sans">
                  <button
                    className="py-1.5 px-3 bg-pink-50 border border-pink-200 rounded text-pink-700 text-xs font-semibold"
                    onClick={() => setViewMsg(row)}
                  >
                    👁 Xem
                  </button>
                  {isTrash ? (
                    <>
                      <button
                        className="py-1.5 px-3 bg-emerald-50 border border-emerald-200 rounded text-emerald-700 text-xs font-semibold"
                        onClick={() => onRestore(row.id)}
                      >
                        ↩ Khôi phục
                      </button>
                      <button
                        className="py-1.5 px-3 bg-rose-50 border border-rose-200 rounded text-rose-700 text-xs font-semibold"
                        onClick={() => onForceDelete(row.id)}
                      >
                        ✕ Xóa hẳn
                      </button>
                    </>
                  ) : (
                    <button
                      className="py-1.5 px-3 bg-rose-50 border border-rose-200 rounded text-rose-700 text-xs font-semibold"
                      onClick={() => onDelete(row.id)}
                    >
                      🗑️ Xóa
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white border border-pink-200 rounded-xl p-8 text-center text-gray-500 text-xs font-sans">
            {searchTerm ? "Không tìm thấy lời chúc phù hợp." : "Chưa có lời chúc nào."}
          </div>
        )}
      </div>

      {/* ================= MODAL XEM CHI TIẾT ================= */}
      {viewMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-pink-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-pink-100 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
                  {(viewMsg.guest_name || "?").charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-[#4a2e3b] text-base font-sans">{viewMsg.guest_name}</h3>
                  <p className="text-xs text-gray-500 font-sans">{viewMsg.created_at}</p>
                </div>
              </div>
              <button
                onClick={() => setViewMsg(null)}
                className="text-gray-400 hover:text-gray-600 p-1 text-2xl leading-none cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="bg-pink-50/60 border border-pink-200/70 rounded-xl p-4 mb-5">
              <p className="text-sm sm:text-base text-[#4a2e3b] font-serif italic leading-relaxed whitespace-pre-wrap">
                "{viewMsg.message}"
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setViewMsg(null)}
                className="py-2 px-5 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-xs sm:text-sm font-semibold font-sans cursor-pointer transition-colors"
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
