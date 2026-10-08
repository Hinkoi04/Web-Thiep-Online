import React, { useState, useEffect } from 'react';
import type { WeddingInfo } from '../../types';
import { weddingEvents } from '../../data/weddingData';
import { MapPin, Heart } from 'lucide-react';
import { useInView } from '../../hooks/useInView';

interface InvitationDetailsScreenProps {
  weddingInfo: WeddingInfo;
  onGoToSchedule: () => void;
  onGoToGuestbook?: () => void;
}

export const InvitationDetailsScreen: React.FC<InvitationDetailsScreenProps> = ({
  weddingInfo,
  onGoToSchedule,
}) => {
  const event = weddingEvents[0];
  const { ref: headerRef, isInView: headerInView } = useInView({ threshold: 0.1 });
  const { ref: quoteCardRef, isInView: quoteCardInView } = useInView({ threshold: 0.15 });
  const { ref: dateCardRef, isInView: dateCardInView } = useInView({ threshold: 0.1 });
  const { ref: venueRef, isInView: venueInView } = useInView({ threshold: 0.1 });
  const { ref: guestRef, isInView: guestInView } = useInView({ threshold: 0.1 });

  // ── TYPEWRITER EFFECT GIỐNG THOAWD ──
  const fullQuote =
    '"Hôn nhân là bến đỗ bình yên, nơi tình yêu được đơm hoa kết trái. Trong ngày vui trọng đại của cuộc đời, sự hiện diện và lời chúc phúc của quý khách là niềm vinh hạnh to lớn đối với chúng tôi."';
  const [typedQuote, setTypedQuote] = useState('');
  const [isQuoteTyping, setIsQuoteTyping] = useState(false);

  useEffect(() => {
    if (!quoteCardInView) return;
    setIsQuoteTyping(true);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTypedQuote(fullQuote.slice(0, i));
      if (i >= fullQuote.length) {
        clearInterval(interval);
        setIsQuoteTyping(false);
      }
    }, 48);
    return () => clearInterval(interval);
  }, [quoteCardInView, fullQuote]);

  return (
    <div className="relative w-full px-5 py-9 bg-[#faf5ee] text-[#3d2c1e] text-center select-none overflow-hidden">
      {/* ── 1. COUPLE NAMES WITH SLIDE-IN ANIMATION FROM TWO SIDES (LỜI MỜI TRANG TRỌNG) ── */}
      <div
        ref={headerRef}
        className="relative pt-2 pb-4 overflow-hidden"
      >
        {/* Điểm hoa Hoa4 ở góc trên bên phải */}
        <img
          src="/thoahai/Hoa4.png"
          alt="hoa điểm"
          className="absolute -top-2 -right-2 w-14 h-auto pointer-events-none select-none opacity-85 z-10 drop-shadow-xs"
        />

        {/* Lời mời trang trọng hiện lên trước */}
        <span
          className={`text-[11px] font-semibold tracking-[0.25em] text-[#4a4039] uppercase block mb-1 transition-all duration-[1600ms] cubic-bezier(0.16,1,0.3,1) ${
            headerInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-3 scale-95'
          }`}
        >
          LỜI MỜI TRANG TRỌNG
        </span>

        {/* Tên cô dâu chú rể di chuyển chậm từ 2 bên vào */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 py-2 overflow-hidden">
          {/* Tên Chú Rể di chuyển chậm từ bên trái vào */}
          <span
            className={`text-3xl sm:text-4xl font-normal transition-all duration-[3200ms] cubic-bezier(0.16,1,0.3,1) inline-block ${
              headerInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-32'
            }`}
            style={{
              color: '#1a1a1a',
              fontFamily: "'Pinyon Script', cursive",
              transitionDelay: headerInView ? '200ms' : '0ms',
            }}
          >
            {weddingInfo.groomName}
          </span>

          {/* Dấu & ở giữa */}
          <span
            className={`text-3xl sm:text-4xl italic transition-all duration-[2400ms] cubic-bezier(0.16,1,0.3,1) inline-block px-1 ${
              headerInView ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
            }`}
            style={{
              color: '#8c7355',
              fontFamily: "'Pinyon Script', cursive",
              transitionDelay: headerInView ? '450ms' : '0ms',
            }}
          >
            &amp;
          </span>

          {/* Tên Cô Dâu di chuyển chậm từ bên phải vào */}
          <span
            className={`text-3xl sm:text-4xl font-normal transition-all duration-[3200ms] cubic-bezier(0.16,1,0.3,1) inline-block ${
              headerInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-32'
            }`}
            style={{
              color: '#1a1a1a',
              fontFamily: "'Pinyon Script', cursive",
              transitionDelay: headerInView ? '200ms' : '0ms',
            }}
          >
            {weddingInfo.brideName}
          </span>
        </div>

        {/* Thin vertical separator line */}
        <div
          className={`flex justify-center my-3 transition-all duration-[1600ms] ${
            headerInView ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'
          }`}
          style={{ transitionDelay: headerInView ? '700ms' : '0ms' }}
        >
          <div className="w-[1px] h-8 bg-[#1a1a1a]/20" />
        </div>
      </div>

      {/* ── 2. ĐOẠN TRIẾT LÝ MỞ ĐẦU (HIỆU ỨNG ĐÁNH MÁY TYPEWRITER THOAWD) ── */}
      <div
        ref={quoteCardRef}
        className={`max-w-xs sm:max-w-sm mx-auto p-4 rounded-2xl border text-center transition-all duration-[1800ms] ${quoteCardInView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        style={{
          background: 'rgba(225, 203, 180, 0.18)',
          borderColor: 'rgba(225, 203, 180, 0.65)',
        }}
      >
        <p
          className="text-xs sm:text-[13px] leading-relaxed italic"
          style={{ color: '#4a4039', fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {typedQuote}
          {isQuoteTyping && (
            <span className="inline-block w-[1.5px] h-[1em] bg-[#1a1a1a] animate-pulse ml-0.5 align-middle" />
          )}
        </p>
      </div>

      {/* ── 3. CEREMONY TIME & DATE BLOCK (NGÀY 29 · 10 · 2026 - KHUNG HIỆN RA TRƯỚC RỒI NGÀY THÁNG NĂM MỚI HIỆN LÊN) ── */}
      <div
        ref={dateCardRef}
        className={`max-w-xs mx-auto mt-6 p-4 sm:p-5 rounded-2xl border border-[#d8c7b3] bg-[#f5ede3]/50 shadow-2xs space-y-3 transition-all duration-[2000ms] cubic-bezier(0.16, 1, 0.3, 1) ${
          dateCardInView ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-8'
        }`}
      >
        {/* Điểm hoa Hoa3 trên khối ngày giờ (hiện lên sau khung) */}
        <div
          className={`flex justify-center items-center transition-all duration-[2000ms] cubic-bezier(0.16, 1, 0.3, 1) ${
            dateCardInView ? 'opacity-90 scale-100' : 'opacity-0 scale-75'
          }`}
          style={{ transitionDelay: dateCardInView ? '300ms' : '0ms' }}
        >
          <img
            src="/thoahai/Hoa3.png"
            alt="hoa điểm"
            className="w-10 h-auto object-contain pointer-events-none select-none drop-shadow-xs"
          />
        </div>

        {/* Time (hiện lên) */}
        <p
          className={`text-xs sm:text-sm font-semibold tracking-[0.22em] uppercase transition-all duration-[2200ms] cubic-bezier(0.16, 1, 0.3, 1) ${
            dateCardInView ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'
          }`}
          style={{
            color: '#1a1a1a',
            fontFamily: "'Playfair Display', serif",
            transitionDelay: dateCardInView ? '600ms' : '0ms',
          }}
        >
          {event?.timePrefix || 'VÀO LÚC 10:30 - 11:00 THỨ NĂM'}
        </p>

        {/* Date Row with lines above & below: THÁNG 10 · 29 · NĂM 2026 */}
        <div
          className={`border-y border-[#1a1a1a]/20 py-2.5 flex items-center justify-center gap-3 transition-all duration-[2000ms] ${
            dateCardInView ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionDelay: dateCardInView ? '850ms' : '0ms' }}
        >
          {/* THÁNG 10 (chạy từ trái vào) */}
          <span
            className={`text-xs sm:text-sm font-semibold tracking-[0.18em] uppercase flex-1 text-right transition-all duration-[2400ms] cubic-bezier(0.16, 1, 0.3, 1) ${
              dateCardInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6'
            }`}
            style={{
              color: '#1a1a1a',
              fontFamily: "'Playfair Display', serif",
              transitionDelay: dateCardInView ? '1050ms' : '0ms',
            }}
          >
            {event?.monthText || 'THÁNG 10'}
          </span>

          {/* Ngày 29 (phóng to ở giữa) */}
          <span
            className={`text-4xl sm:text-5xl font-light tracking-tight leading-none px-2 select-none transition-all duration-[2400ms] cubic-bezier(0.16, 1, 0.3, 1) ${
              dateCardInView ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
            }`}
            style={{
              color: '#1a1a1a',
              fontFamily: "'Playfair Display', serif",
              transitionDelay: dateCardInView ? '1250ms' : '0ms',
            }}
          >
            {event?.day || '29'}
          </span>

          {/* NĂM 2026 (chạy từ phải vào) */}
          <span
            className={`text-xs sm:text-sm font-semibold tracking-[0.18em] uppercase flex-1 text-left transition-all duration-[2400ms] cubic-bezier(0.16, 1, 0.3, 1) ${
              dateCardInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6'
            }`}
            style={{
              color: '#1a1a1a',
              fontFamily: "'Playfair Display', serif",
              transitionDelay: dateCardInView ? '1450ms' : '0ms',
            }}
          >
            {event?.yearText || 'NĂM 2026'}
          </span>
        </div>

        {/* Lunar Date (hiện lên sau cùng) */}
        <p
          className={`text-xs italic text-[#6d5a49] transition-all duration-[2200ms] cubic-bezier(0.16, 1, 0.3, 1) ${
            dateCardInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
          style={{ transitionDelay: dateCardInView ? '1700ms' : '0ms' }}
        >
          {event?.lunarText || '(Tức ngày 20 tháng 09 năm Bính Ngọ)'}
        </p>
      </div>

      {/* ── 4. VENUE & MAP BUTTON (ĐỊA ĐIỂM TỔ CHỨC) ── */}
      <div
        ref={venueRef}
        className={`max-w-xs mx-auto mt-7 space-y-2 th-reveal-init th-reveal-up ${venueInView ? 'th-reveal-active' : ''
          }`}
      >
        <p className="text-[11px] text-[#4a4039] uppercase tracking-wider font-semibold">Địa điểm tổ chức:</p>
        <h3
          className="text-lg sm:text-xl font-bold tracking-[0.16em] uppercase"
          style={{ color: '#1a1a1a', fontFamily: "'Playfair Display', serif" }}
        >
          {event?.locationName || 'ĐỊA ĐIỂM TỔ CHỨC'}
        </h3>
        <p className="text-xs sm:text-[13px] text-[#4a4039] leading-relaxed px-2 font-sans">
          {event?.address || 'Xã An Phú, Tỉnh Quảng Ngãi'}
        </p>

        {/* Xem chỉ đường Button (Maps) */}
        <div className="pt-2.5">
          <a
            href={event?.mapUrl || 'https://maps.google.com/?q=15.13671811751521,108.89633230162609'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border border-[#1a1a1a] text-[#1a1a1a] text-xs font-semibold tracking-widest uppercase transition-all duration-300 hover:bg-[#1a1a1a] hover:text-white cursor-pointer shadow-xs active:scale-95"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>XEM CHỈ ĐƯỜNG</span>
          </a>
        </div>
      </div>

      {/* ── 5. PERSONALIZED RECIPIENT CARD (THÂN MỜI VỚI HIỆU ỨNG BAY 2 BÊN) ── */}
      {weddingInfo.guestName && (
        <div
          ref={guestRef}
          className="max-w-xs sm:max-w-sm mx-auto mt-8 p-5 rounded-2xl border text-center space-y-1.5 overflow-hidden"
          style={{
            background: 'rgba(225, 203, 180, 0.22)',
            borderColor: 'rgba(225, 203, 180, 0.65)',
          }}
        >
          {/* Tiêu đề bay từ bên trái vào chậm rãi */}
          <span
            className={`text-[10px] uppercase tracking-[0.25em] font-semibold block text-[#4a4039] transition-all duration-[2400ms] cubic-bezier(0.16,1,0.3,1) ${guestInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
              }`}
          >
            Trân trọng kính mời
          </span>

          {/* Tên khách mời bay từ bên phải vào chậm rãi */}
          <span
            className={`text-3xl font-normal block py-1 text-[#1a1a1a] transition-all duration-[2600ms] cubic-bezier(0.16,1,0.3,1) delay-200 ${guestInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
              }`}
            style={{ fontFamily: "'Pinyon Script', cursive" }}
          >
            {weddingInfo.guestName}
          </span>

          {/* Dòng thân mật bay từ bên trái vào chậm rãi */}
          <p
            className={`text-xs text-[#6d5a49] leading-relaxed transition-all duration-[2500ms] cubic-bezier(0.16,1,0.3,1) delay-400 ${guestInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
              }`}
          >
            Tới dự bữa cơm thân mật chung vui cùng gia đình chúng tôi
          </p>

          {/* Chữ ký 2 bên Chú Rể & Cô Dâu */}
          <div className="pt-2 flex items-center justify-center gap-2.5 overflow-hidden text-[#1a1a1a]">
            <span
              className={`text-2xl transition-all duration-[2600ms] cubic-bezier(0.16,1,0.3,1) delay-600 inline-block ${guestInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                }`}
              style={{ fontFamily: "'Pinyon Script', cursive" }}
            >
              {weddingInfo.groomName}
            </span>
            <span
              className={`transition-all duration-[1800ms] delay-800 inline-block ${guestInView ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                }`}
            >
              <Heart className="w-3.5 h-3.5 fill-[#1a1a1a] text-[#1a1a1a]" />
            </span>
            <span
              className={`text-2xl transition-all duration-[2600ms] cubic-bezier(0.16,1,0.3,1) delay-600 inline-block ${guestInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
                }`}
              style={{ fontFamily: "'Pinyon Script', cursive" }}
            >
              {weddingInfo.brideName}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
