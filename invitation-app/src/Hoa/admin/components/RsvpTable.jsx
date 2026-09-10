import React, { useState } from "react";

export default function RsvpTable({ messages, onDelete, isTrash = false, onRestore, onForceDelete }) {
  const [viewMsg, setViewMsg] = useState(null);
  const total = messages.length;

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-cormorant text-[1.2rem] text-dark tracking-[0.02em]">Khách Mời Đã Phản Hồi</h2>
        <span className="text-[0.75rem] text-muted bg-cream-dark py-1 px-3 rounded-full tracking-[0.05em]">{total} lời chúc</span>
      </div>

      <div className="bg-white border border-border-solid rounded overflow-hidden animate-[fadeUp_0.5s_ease_0.15s_both]">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-cream border-b border-border-solid">
                <th width="20%" className="py-3.5 px-5 text-left text-[0.65rem] tracking-[0.2em] uppercase text-muted font-semibold whitespace-nowrap">Khách Mời</th>
                <th className="py-3.5 px-5 text-left text-[0.65rem] tracking-[0.2em] uppercase text-muted font-semibold whitespace-nowrap">Lời Chúc</th>
                <th width="14%" className="py-3.5 px-5 text-left text-[0.65rem] tracking-[0.2em] uppercase text-muted font-semibold whitespace-nowrap">Thời Gian</th>
                <th width="14%" className="py-3.5 px-5 text-left text-[0.65rem] tracking-[0.2em] uppercase text-muted font-semibold whitespace-nowrap">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {total > 0 ? (
                messages.map((row, i) => {
                  const firstChar = row.guest_name.charAt(0).toUpperCase();
                  
                  // Safari fix: Replace space with T for ISO format
                  const safeDateStr = (row.created_at || "").replace(' ', 'T');
                  const dateObj = new Date(safeDateStr);
                  
                  const dateStr = dateObj.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
                  const timeStr = dateObj.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

                  return (
                    <tr key={row.id} className="border-b border-border-solid transition-colors duration-150 hover:bg-[#fdfaf6] last:border-b-0" style={{ animation: `fadeUp 0.3s ease ${i * 0.03}s both` }}>
                      <td className="py-4.5 px-5 align-top">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-gradient-to-br from-gold-light to-gold-dark rounded-full inline-flex items-center justify-center text-white font-semibold text-[0.85rem] shrink-0">{firstChar}</div>
                          <span className="font-medium text-dark text-[0.95rem] whitespace-nowrap">{row.guest_name}</span>
                        </div>
                      </td>
                      <td className="py-4.5 px-5 align-top">
                        <span className="font-cormorant text-[2rem] text-gold-light leading-[0.5] align-[-0.4em] mr-0.5">"</span>
                        <span className="text-text-admin text-[1rem] leading-[1.65] whitespace-pre-wrap break-words italic font-cormorant">{row.message.length > 80 ? row.message.substring(0, 80) + "..." : row.message}</span>
                      </td>
                      <td className="py-4.5 px-5 align-top">
                        <div className="inline-flex flex-col items-start gap-0.5">
                          <span className="text-[0.85rem] font-medium">{dateStr}</span>
                          <span className="text-[0.75rem] text-muted">{timeStr}</span>
                        </div>
                      </td>
                      <td className="py-4.5 px-5 align-top">
                        <div className="flex items-center gap-2">
                          <button
                            className="inline-flex items-center gap-1.5 py-[7px] px-[10px] bg-transparent border border-border-solid rounded-[3px] text-muted text-[0.78rem] font-medium cursor-pointer transition-all duration-150 whitespace-nowrap hover:bg-[#f0f9ff] hover:border-[#bae6fd] hover:text-[#0284c7]"
                            onClick={() => setViewMsg(row)}
                            title="Xem chi tiết"
                          >
                            👁 Xem
                          </button>
                          
                          {isTrash ? (
                            <>
                              <button
                                className="inline-flex items-center gap-1.5 py-[7px] px-[10px] bg-transparent border border-border-solid rounded-[3px] text-muted text-[0.78rem] font-medium cursor-pointer transition-all duration-150 whitespace-nowrap hover:bg-[#f0fff4] hover:border-[#c6f6d5] hover:text-[#276749]"
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
                                className="inline-flex items-center gap-1.5 py-[7px] px-[10px] bg-transparent border border-border-solid rounded-[3px] text-muted text-[0.78rem] font-medium cursor-pointer transition-all duration-150 whitespace-nowrap hover:bg-red-light hover:border-[#fed7d7] hover:text-red"
                                onClick={() => {
                                  if (window.confirm(`XÓA VĨNH VIỄN lời chúc của ${row.guest_name}? (Không thể khôi phục)`)) {
                                    onForceDelete && onForceDelete(row.id);
                                  }
                                }}
                                title="Xóa vĩnh viễn"
                              >
                                💥 Xóa luôn
                              </button>
                            </>
                          ) : (
                            <button
                              className="inline-flex items-center gap-1.5 py-[7px] px-[10px] bg-transparent border border-border-solid rounded-[3px] text-muted text-[0.78rem] font-medium cursor-pointer transition-all duration-150 whitespace-nowrap hover:bg-red-light hover:border-[#fed7d7] hover:text-red"
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
                  <td colSpan="4" className="py-4.5 px-5 align-top">
                    <div className="py-20 px-5 text-center">
                      <div className="text-[3rem] mb-4 opacity-40">📭</div>
                      <div className="font-cormorant text-[1.4rem] text-muted mb-1.5">Chưa có lời chúc nào</div>
                      <div className="text-[0.8rem] text-[rgba(122,109,94,0.6)] tracking-[0.05em]">Khách mời chưa gửi phản hồi</div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal View Detail */}
      {viewMsg && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity p-4" onClick={() => setViewMsg(null)}>
          <div 
            className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-[fadeUp_0.3s_ease_out]"
            onClick={e => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-border-solid flex justify-between items-center bg-[#faf8f5]">
              <h3 className="font-cormorant text-[1.3rem] font-semibold text-dark">Chi tiết lời chúc</h3>
              <button 
                className="text-muted hover:text-dark text-xl leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors cursor-pointer"
                onClick={() => setViewMsg(null)}
              >
                ×
              </button>
            </div>
            
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-gold-light to-gold-dark rounded-full flex items-center justify-center text-white font-semibold text-xl shadow-md shrink-0">
                  {viewMsg.guest_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-[1.1rem] font-medium text-dark">{viewMsg.guest_name}</div>
                  <div className="text-[0.8rem] text-muted mt-0.5">
                    {new Date((viewMsg.created_at || "").replace(' ', 'T')).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })} — {new Date((viewMsg.created_at || "").replace(' ', 'T')).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })}
                  </div>
                </div>
              </div>
              
              <div className="bg-[#fdfaf6] border border-[#e8d5a3]/30 rounded-lg p-5 md:p-6 relative">
                <span className="absolute top-2 left-3 font-cormorant text-[4rem] text-gold-light opacity-20 leading-none">"</span>
                <p className="relative font-cormorant text-[1.2rem] text-text-admin leading-relaxed italic whitespace-pre-wrap z-10 max-h-[300px] overflow-y-auto pr-2">
                  {viewMsg.message}
                </p>
                <span className="absolute bottom-[-1.5rem] right-3 font-cormorant text-[4rem] text-gold-light opacity-20 leading-none rotate-180">"</span>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-border-solid bg-gray-50 flex justify-end gap-3">
              <button 
                className="px-6 py-2 text-[0.85rem] font-medium text-muted bg-white border border-border-solid rounded cursor-pointer hover:bg-gray-50 hover:text-dark transition-colors"
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
