import React, { useState, useEffect } from 'react';
import { initialWishes } from '../../data/weddingData';
import type { GuestWish } from '../../types';
import { Heart, Send, CheckCircle2 } from 'lucide-react';
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

  const { ref: headerRef, isInView: headerInView } = useInView({ threshold: 0.15 });
  const { ref: formRef, isInView: formInView } = useInView<HTMLFormElement>({ threshold: 0.15 });
  const { ref: wishesRef, isInView: wishesInView } = useInView({ threshold: 0.15 });

  // Fetch wishes from Backend API (with fallback to localStorage / initialWishes)
  useEffect(() => {
    const fetchWishes = async () => {
      try {
        const res = await fetch(`${API_BASE}/thoa-wd`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            const apiWishes: GuestWish[] = json.data.map((item: any) => ({
              id: item.id.toString(),
              senderName: item.guest_name || 'Khách quý',
              relation: item.attendance_status || 'Khách mời',
              message: item.message || '',
              likes: 1,
              timestamp: item.created_at ? new Date(item.created_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }) : 'Gần đây',
            }));
            setWishes(apiWishes);
            return;
          }
        }
      } catch (err) {
        console.warn('Backend unavailable, fallback to local wishes:', err);
      }

      // Fallback
      try {
        const saved = localStorage.getItem('wedding_wishes_thoawd');
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

  const handleSendWish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setSubmitting(true);
    const guestName = name.trim();
    const guestMsg = message.trim();

    const localWish: GuestWish = {
      id: Date.now().toString(),
      senderName: guestName,
      relation: 'Khách mời',
      message: guestMsg,
      likes: 1,
      timestamp: 'Vừa xong',
    };

    // Try posting to Backend
    try {
      const res = await fetch(`${API_BASE}/thoa-wd`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guest_name: guestName,
          message: guestMsg,
          attendance_status: 'Khách mời',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.data?.id) {
          localWish.id = data.data.id.toString();
        }
      }
    } catch (err) {
      console.warn('Sent offline, cached locally:', err);
    }

    const updated = [localWish, ...wishes];
    setWishes(updated);
    try {
      localStorage.setItem('wedding_wishes_thoawd', JSON.stringify(updated));
    } catch {
      // ignore
    }

    setName('');
    setMessage('');
    setSubmitting(false);
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 4000);
  };

  const handleLike = (id: string) => {
    const isLiked = likedIds.includes(id);
    const updatedLiked = isLiked
      ? likedIds.filter((item) => item !== id)
      : [...likedIds, id];
    setLikedIds(updatedLiked);

    const updatedWishes = wishes.map((w) => {
      if (w.id === id) {
        return { ...w, likes: isLiked ? Math.max(0, w.likes - 1) : w.likes + 1 };
      }
      return w;
    });

    setWishes(updatedWishes);
    try {
      localStorage.setItem('wedding_wishes_thoawd', JSON.stringify(updatedWishes));
    } catch {
      // ignore
    }
  };

  return (
    <div className="relative w-full min-h-full px-4 sm:px-5 py-6 bg-gradient-to-b from-[#faf6fe] via-[#f5ebfc] to-[#faf6fe] text-[#300f47]">
      <div className="max-w-md mx-auto space-y-6 pt-4">
        {/* Header */}
        <div 
          ref={headerRef} 
          className={`text-center space-y-1 reveal-init reveal-up ${headerInView ? 'reveal-active' : ''}`}
        >
          <span className="text-[11px] font-semibold tracking-[0.25em] text-[#7c4a9e] uppercase">
            SỔ LƯU BÚT
          </span>
          <h2 className="font-serif text-2xl font-semibold text-[#3b1554] tracking-wide">
            Gửi Lời Chúc Phúc
          </h2>
          <p className="text-xs text-slate-500 font-sans">
            Mỗi lời chúc là một món quà vô giá dành cho cặp đôi mới cưới
          </p>
          <div className="w-12 h-0.5 bg-[#a87ccb] mx-auto mt-2" />
        </div>

        {/* Success Alert */}
        {successToast && (
          <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs shadow-xs animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Cảm ơn bạn! Lời chúc tốt đẹp đã được gửi thành công.</span>
          </div>
        )}

        {/* Input Form: Chỉ Tên và Lời Chúc */}
        <form
          ref={formRef}
          onSubmit={handleSendWish}
          className={`bg-white rounded-2xl p-4 sm:p-5 border border-[#e2d3f2] shadow-sm space-y-3.5 text-xs reveal-init reveal-up ${
            formInView ? 'reveal-active' : ''
          }`}
        >
          <div>
            <label className="font-semibold text-slate-700 block mb-1.5">
              Tên của bạn <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập họ và tên hoặc danh xưng..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8c2ed] bg-[#fbf9fe] focus:outline-hidden focus:border-[#8b5eb5] focus:bg-white text-slate-800 text-xs transition-colors"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1.5">
              Lời chúc tốt đẹp nhất <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Gửi lời chúc mừng ngọt ngào đến Cô Dâu & Chú Rể..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8c2ed] bg-[#fbf9fe] focus:outline-hidden focus:border-[#8b5eb5] focus:bg-white text-slate-800 text-xs resize-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-[#4a1d6d] hover:bg-[#5c2487] text-white font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
          >
            <Send className="w-4 h-4 text-pink-300" />
            <span>{submitting ? 'Đang gửi...' : 'Gửi Lời Chúc Mừng'}</span>
          </button>
        </form>

        {/* Wishes List - Bong bóng hình viên thuốc cuộn liên tục lặp lại trong khung cố định (chứa ~5 cái) */}
        <div 
          ref={wishesRef}
          className={`space-y-2 pt-2 reveal-init reveal-up ${wishesInView ? 'reveal-active' : ''}`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500 px-2">
            <span className="font-semibold text-[#4a1d6d] tracking-wide">
              Bong bóng lời chúc ({wishes.length})
            </span>
            <span className="text-[11px] text-purple-400 font-serif italic">
              ✦ Cuộn lặp lại liên tục
            </span>
          </div>

          {/* KHUNG CỐ ĐỊNH CHỨA ~5 BONG BÓNG LỜI CHÚC CUỘN VÒNG LẶP */}
          <div className="relative h-[310px] sm:h-[330px] overflow-hidden rounded-2xl bg-[#faf6fe]/60 border border-[#e8dcef]/70 p-2">
            
            {/* Lớp gradient mờ ở đỉnh & đáy khung tạo hiệu ứng xuất hiện / biến mất êm dịu */}
            <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-[#faf6fe] to-transparent pointer-events-none z-10" />
            <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[#faf6fe] to-transparent pointer-events-none z-10" />

            {/* Dải bong bóng cuộn dọc liên tục (Infinite Loop) */}
            <div className="animate-marquee-vertical space-y-2.5 py-1">
              {/* Lặp 2 lần danh sách để tạo vòng lặp vô tận liền mạch */}
              {[...wishes, ...wishes].map((wish, index) => {
                const isLiked = likedIds.includes(wish.id);

                return (
                  <div
                    key={`${wish.id}-${index}`}
                    className="w-full rounded-full bg-white/85 backdrop-blur-md border border-white/95 shadow-[0_4px_16px_rgba(107,33,168,0.06)] p-2.5 sm:p-3 flex items-center justify-between gap-2.5 text-xs transition-transform hover:scale-[1.01]"
                  >
                    {/* Avatar Tròn & Nội Dung Lời Chúc Dạng Viên Thuốc */}
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#f3e7fb] to-[#e7d2f7] text-[#6b3594] font-bold flex items-center justify-center text-xs border border-white shadow-2xs">
                        {wish.senderName.charAt(0).toUpperCase()}
                      </div>
                      
                      <div className="min-w-0 flex-1 pr-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#3b1554] truncate text-xs">
                            {wish.senderName}
                          </span>
                          <span className="text-[9.5px] text-slate-400 shrink-0">
                            {wish.timestamp}
                          </span>
                        </div>
                        <p className="text-slate-700 font-sans truncate text-[11px] sm:text-xs leading-tight mt-0.5">
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
                          : 'bg-white/80 text-[#7c4a9e] border-[#e8dcef] hover:bg-purple-50'
                      }`}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          isLiked ? 'fill-rose-500 text-rose-500' : 'text-purple-400'
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
