import React, { useState, useEffect } from 'react';
import { initialWishes, weddingImages } from '../../data/weddingData';
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
  const { ref: footerRef, isInView: footerInView } = useInView({ threshold: 0.1 });
  const { ref: wishesRef, isInView: wishesInView } = useInView({ threshold: 0.1 });

  useEffect(() => {
    const fetchWishes = async () => {
      try {
        const res = await fetch(`${API_BASE}/thoa-hai`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
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
    } catch {}

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
    } catch {}
  };

  return (
    <div className="relative w-full px-5 py-8 bg-[#faf5ee] text-[#3d2c1e] select-none overflow-hidden">
      <div className="max-w-md mx-auto space-y-6 pt-1">
        {/* ── 1. RSVP HEADER NOTE ── */}
        <div
          ref={headerRef}
          className={`text-center space-y-2 th-reveal-init th-reveal-up ${
            headerInView ? 'th-reveal-active' : ''
          }`}
        >
          {/* Điểm hoa Hoa1 */}
          <img
            src="/thoahai/Hoa1.png"
            alt="hoa điểm xác nhận"
            className="w-11 h-auto mx-auto mb-1.5 opacity-90 drop-shadow-xs pointer-events-none select-none"
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
            className="flex items-center gap-2 p-3.5 rounded-2xl text-xs shadow-sm animate-fade-in"
            style={{
              background: 'rgba(225,203,180,0.3)',
              border: '1px solid #1a1a1a',
              color: '#1a1a1a',
            }}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#1a1a1a]" />
            <span>Cảm ơn bạn! Lời chúc đã được gửi thành công.</span>
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

        {/* ── 3. LIST OF WISHES (SỔ LƯU BÚT) ── */}
        <div
          ref={wishesRef}
          className={`space-y-3 pt-6 border-t border-[#d8c7b3]/70 th-reveal-init th-reveal-up ${
            wishesInView ? 'th-reveal-active' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <h4
              className="text-xs font-bold uppercase tracking-wider text-[#1a1a1a]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Lời Chúc Từ Bạn Bè ({wishes.length})
            </h4>
          </div>

          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1 th-no-scrollbar">
            {wishes.map((w) => (
              <div
                key={w.id}
                className="p-3 rounded-2xl border text-xs space-y-1"
                style={{
                  background: 'rgba(245, 238, 228, 0.65)',
                  borderColor: 'rgba(215, 195, 175, 0.6)',
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#1a1a1a]">{w.senderName}</span>
                  <span className="text-[10px] text-[#8d7560]">{w.timestamp}</span>
                </div>
                <p className="text-[#4a4039] leading-relaxed italic">{w.message}</p>
                <div className="flex items-center justify-between pt-1 text-[11px]">
                  {w.relation ? (
                    <span className="text-[10px] text-[#6d5a49]">{w.relation}</span>
                  ) : <span />}
                  <button
                    onClick={() => handleLike(w.id)}
                    className="flex items-center gap-1 text-[#1a1a1a] hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${likedIds.includes(w.id) ? 'fill-[#1a1a1a] text-[#1a1a1a]' : 'text-[#1a1a1a]'}`}
                    />
                    <span className="text-[10px] font-semibold">{w.likes}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 4. CLOSING PHOTO & MESSAGE (IMAGE 3 VERY BOTTOM) ── */}
        <div
          ref={footerRef}
          className={`pt-6 pb-4 text-center space-y-3 th-reveal-init th-reveal-up ${
            footerInView ? 'th-reveal-active' : ''
          }`}
        >
          {/* Couple Photo */}
          <div
            className="w-full max-w-[340px] mx-auto rounded-2xl overflow-hidden shadow-md"
            style={{ aspectRatio: '16/10', background: '#f0e8dc' }}
          >
            <img
              src={weddingImages.closingPhoto}
              alt="Hẹn gặp bạn trong ngày cưới Thanh Hải & Yến Thoa"
              className="w-full h-full object-cover object-center"
              loading="lazy"
            />
          </div>

          {/* Warm closing lines */}
          <div className="space-y-1 pt-2">
            <p
              className="text-xs sm:text-[13px] font-medium leading-relaxed"
              style={{ color: '#1a1a1a', fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Hẹn gặp bạn trong ngày đặc biệt nhất của chúng mình.
            </p>
            <p
              className="text-xs sm:text-[13px] italic leading-relaxed"
              style={{ color: '#4a4039', fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Sự hiện diện của bạn là niềm vinh hạnh của chúng mình!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
