import React, { useState, useEffect } from 'react';
import { initialWishes } from '../../data/weddingData';
import type { GuestWish } from '../../types';
import { Heart, CheckCircle2 } from 'lucide-react';
import { useInView } from '../../hooks/useInView';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface GuestbookScreenProps {
  guestName?: string;
}

export const GuestbookScreen: React.FC<GuestbookScreenProps> = ({ guestName }) => {
  const isGenericGuest = !guestName || guestName === 'Anh/ Chị & Người thương';
  const [wishes, setWishes] = useState<GuestWish[]>([]);
  const [name, setName] = useState(() => (!isGenericGuest ? guestName : ''));
  const [message, setMessage] = useState('');
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  useEffect(() => {
    if (guestName && guestName !== 'Anh/ Chị & Người thương' && !name) {
      setName(guestName);
    }
  }, [guestName]);

  const { ref: headerRef, isInView: headerInView } = useInView({ threshold: 0.1 });
  const { ref: formRef, isInView: formInView } = useInView<HTMLFormElement>({ threshold: 0.1 });
  const { ref: wishesRef, isInView: wishesInView } = useInView({ threshold: 0.1 });

  useEffect(() => {
    const fetchWishes = async () => {
      try {
        const res = await fetch(`${API_BASE}/thoa-hai`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            const apiWishes: GuestWish[] = json.data.map((item: any) => ({
              id: item.id.toString(),
              senderName: item.guest_name || 'Khách quý',
              relation: item.attendance_status || 'Khách mời',
              message: item.message || '',
              likes: 1,
              timestamp: item.created_at
                ? new Date(item.created_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
                : 'Gần đây',
            }));
            setWishes(apiWishes);
            return;
          }
        }
      } catch (err) {
        console.warn('Backend unavailable, fallback to local wishes:', err);
      }
      try {
        const saved = localStorage.getItem('wedding_wishes_thoahai');
        if (saved) {
          setWishes(JSON.parse(saved));
        } else {
          setWishes(initialWishes);
        }
      } catch {
        setWishes(initialWishes);
      }
    };
    fetchWishes();
  }, []);

  const handleSendRsvp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    const guestNameVal = name.trim();
    const guestMsg = message.trim() || 'Chúc mừng hai bạn trăm năm hạnh phúc!';

    const localWish: GuestWish = {
      id: Date.now().toString(),
      senderName: guestNameVal,
      relation: 'Khách mời',
      message: guestMsg,
      likes: 1,
      timestamp: 'Vừa xong',
    };

    try {
      const res = await fetch(`${API_BASE}/thoa-hai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guest_name: guestNameVal,
          message: guestMsg,
          attendance_status: 'Khách mời',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.data?.id) localWish.id = data.data.id.toString();
      }
    } catch (err) {
      console.warn('Sent offline:', err);
    }

    const updated = [localWish, ...wishes];
    setWishes(updated);
    try {
      localStorage.setItem('wedding_wishes_thoahai', JSON.stringify(updated));
    } catch { }

    setMessage('');
    setSubmitting(false);
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 5000);
  };

  const handleLike = (id: string) => {
    const isLiked = likedIds.includes(id);
    const updatedLiked = isLiked ? likedIds.filter((item) => item !== id) : [...likedIds, id];
    setLikedIds(updatedLiked);
    const updatedWishes = wishes.map((w) => {
      if (w.id === id) return { ...w, likes: isLiked ? Math.max(0, w.likes - 1) : w.likes + 1 };
      return w;
    });
    setWishes(updatedWishes);
    try {
      localStorage.setItem('wedding_wishes_thoahai', JSON.stringify(updatedWishes));
    } catch { }
  };

  return (
    <div className="relative w-full bg-[#faf5ee] text-[#3d2c1e] select-none overflow-hidden">
      <div className="max-w-md mx-auto px-5 pt-8 pb-6 space-y-6">
        {/* ── 1. RSVP HEADER NOTE ── */}
        <div
          ref={headerRef}
          className={`text-center space-y-2 th-reveal-init th-reveal-up ${headerInView ? 'th-reveal-active' : ''
            }`}
        >
          {/* Điểm hoa Hoa1 */}
          <img
            src="/thoahai/Hoa15.png"
            alt="hoa điểm xác nhận"
            className="w-15 h-auto mx-auto mb-1.5 opacity-90 drop-shadow-xs pointer-events-none select-none"
          />

          <p
            className="text-xs sm:text-[13px] leading-relaxed max-w-xs mx-auto italic font-medium"
            style={{ color: '#1a1a1a', fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Vui lòng xác nhận sự tham dự của bạn để chúng mình chuẩn bị đón tiếp một cách chu đáo nhất.
          </p>
          <p
            className="text-xs sm:text-[13px] italic font-semibold"
            style={{ color: '#4a4039', fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Trân trọng cảm ơn!
          </p>
        </div>

        {/* Success Toast */}
        {successToast && (
          <div
            className="flex items-start gap-3 p-4 rounded-2xl shadow-md"
            style={{
              background: 'linear-gradient(135deg, rgba(225,203,180,0.55) 0%, rgba(250,245,238,0.9) 100%)',
              border: '1.5px solid #c4a882',
              color: '#1a1a1a',
              animation: 'th-toastIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both',
            }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
              style={{ background: '#1a1a1a' }}
            >
              <CheckCircle2 className="w-4 h-4 text-[#e1cbb4]" />
            </div>
            <div className="space-y-0.5">
              <p
                className="text-sm font-bold"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Cảm ơn bạn thật nhiều! 🌸
              </p>
              <p className="text-xs text-[#4a4039] leading-relaxed">
                Lời chúc của bạn đã được gửi thành công đến Hoàng Hải & Yến Thoa.
              </p>
            </div>
          </div>
        )}

        {/* ── 2. RSVP FORM (CHỈ CẦN TÊN & LỜI CHÚC) ── */}
        <form
          ref={formRef}
          onSubmit={handleSendRsvp}
          className={`space-y-3 th-reveal-init th-reveal-up ${formInView ? 'th-reveal-active' : ''}`}
        >
          {/* Field 1: Tên của bạn */}
          <div>
            <input
              type="text"
              required
              placeholder="Tên của bạn"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-full border border-[#d8c7b3] bg-[#fbf9f5] text-xs sm:text-sm text-[#1a1a1a] placeholder-[#8d7560] focus:outline-none focus:border-[#1a1a1a] focus:ring-1 focus:ring-[#1a1a1a] shadow-2xs transition-all"
            />
          </div>

          {/* Field 2: Gửi lời chúc đến cô dâu chú rể */}
          <div>
            <textarea
              rows={3}
              placeholder="Gửi lời chúc đến cô dâu chú rể"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-[#d8c7b3] bg-[#fbf9f5] text-xs sm:text-sm text-[#1a1a1a] placeholder-[#8d7560] focus:outline-none focus:border-[#1a1a1a] focus:ring-1 focus:ring-[#1a1a1a] shadow-2xs transition-all resize-none"
            />
          </div>

          {/* Submit Button: GỬI LỜI CHÚC (nền trong suốt) */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-full font-bold text-xs sm:text-sm tracking-[0.2em] uppercase text-[#1a1a1a] border border-[#1a1a1a] bg-transparent backdrop-blur-xs transition-all duration-300 hover:bg-[#1a1a1a]/10 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 shadow-2xs"
              style={{
                fontFamily: "'Playfair Display', serif",
              }}
            >
              <span>{submitting ? 'ĐANG GỬI...' : 'GỬI LỜI CHÚC'}</span>
            </button>
          </div>
        </form>

        {/* ── 3. LIST OF WISHES (BONG BÓNG LỜI CHÚC DẠNG VIÊN THUỐC CUỘN VÒNG LẶP LIÊN TỤC GIỐNG THOAWD) ── */}
        <div
          ref={wishesRef}
          className={`space-y-2.5 pt-4 border-t border-[#d8c7b3]/70 th-reveal-init th-reveal-up ${
            wishesInView ? 'th-reveal-active' : ''
          }`}
        >
          <div className="flex items-center justify-between text-xs px-1">
            <span
              className="font-bold text-xs uppercase tracking-wider text-[#1a1a1a]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Lời Chúc Từ Bạn Bè ({wishes.length})
            </span>
            <span className="text-[11px] text-[#8d7560] font-serif italic">
              ✦ Cuộn lặp lại liên tục
            </span>
          </div>

          {/* KHUNG CỐ ĐỊNH CHỨA BONG BÓNG LỜI CHÚC CUỘN VÒNG LẶP */}
          <div className="relative h-[310px] sm:h-[330px] overflow-hidden rounded-2xl bg-[#f8f3ec]/70 border border-[#d8c7b3]/70 p-2.5 shadow-2xs">
            {/* Lớp gradient mờ ở đỉnh & đáy khung tạo hiệu ứng xuất hiện / biến mất êm dịu */}
            <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-[#faf5ee] to-transparent pointer-events-none z-10" />
            <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[#faf5ee] to-transparent pointer-events-none z-10" />

            {/* Dải bong bóng cuộn dọc liên tục (Infinite Loop) */}
            <div className="animate-marquee-vertical space-y-2.5 py-1">
              {(wishes.length < 4
                ? [...wishes, ...wishes, ...wishes, ...wishes]
                : [...wishes, ...wishes]
              ).map((wish, index) => {
                const isLiked = likedIds.includes(wish.id);

                return (
                  <div
                    key={`${wish.id}-${index}`}
                    className="w-full rounded-full bg-white/90 backdrop-blur-md border border-[#e1cbb4]/60 shadow-[0_4px_16px_rgba(61,44,30,0.05)] p-2.5 sm:p-3 flex items-center justify-between gap-2.5 text-xs transition-transform hover:scale-[1.01]"
                  >
                    {/* Avatar Tròn & Nội Dung Lời Chúc Dạng Viên Thuốc */}
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#f3e8db] to-[#e4ceb6] text-[#3d2c1e] font-bold flex items-center justify-center text-xs border border-white shadow-2xs">
                        {wish.senderName.charAt(0).toUpperCase()}
                      </div>

                      <div className="min-w-0 flex-1 pr-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#1a1a1a] truncate text-xs">
                            {wish.senderName}
                          </span>
                          <span className="text-[9.5px] text-[#8d7560] shrink-0">
                            {wish.timestamp}
                          </span>
                        </div>
                        <p className="text-[#4a4039] font-sans truncate text-[11px] sm:text-xs leading-tight mt-0.5 italic">
                          "{wish.message}"
                        </p>
                      </div>
                    </div>

                    {/* Nút Thả Tim */}
                    <button
                      type="button"
                      onClick={() => handleLike(wish.id)}
                      className={`shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer border ${
                        isLiked
                          ? 'bg-rose-50/90 text-rose-600 border-rose-200'
                          : 'bg-white/80 text-[#6d5a49] border-[#d8c7b3]/70 hover:bg-[#faf5ee]'
                      }`}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          isLiked ? 'fill-rose-500 text-rose-500' : 'text-[#8d7560]'
                        }`}
                      />
                      <span>{wish.likes}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
