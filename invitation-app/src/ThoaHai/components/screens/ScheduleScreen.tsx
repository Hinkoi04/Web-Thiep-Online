import React from 'react';
import { useInView } from '../../hooks/useInView';

export const ScheduleScreen: React.FC = () => {
  const { ref: timelineRef, isInView: timelineInView } = useInView({ threshold: 0.1 });

  return (
    <div className="relative w-full px-5 py-10 bg-[#faf5ee] text-[#3d2c1e] select-none overflow-hidden">
      {/* ── TOP RIGHT FLORAL ACCENT (HOA5) ── */}
      <div className="absolute top-2 right-1 w-16 sm:w-20 pointer-events-none z-10 opacity-90 drop-shadow-xs">
        <img
          src="/thoahai/Hoa5.png"
          alt="hoa điểm lịch trình"
          className="w-full h-auto object-contain"
        />
      </div>

      {/* ── TIMELINE SECTION (IMAGE 2 WAVY PATH) ── */}
      <div
        ref={timelineRef}
        className={`relative pt-4 pb-6 th-reveal-init th-reveal-up ${timelineInView ? 'th-reveal-active' : ''}`}
      >
        {/* Timeline Title in Pinyon Script font */}
        <div className="text-center mb-8 relative z-20">
          <h3
            className="text-4xl sm:text-5xl font-normal"
            style={{ color: '#1a1a1a', fontFamily: "'Pinyon Script', cursive" }}
          >
            Timeline
          </h3>
          <p className="text-[11px] text-[#4a4039] tracking-widest uppercase font-semibold mt-1">
            Lịch Trình Hôn Lễ
          </p>
        </div>

        {/* 3-Step Staircase Timeline Diagram (BẬC THANG GỒM 3 BẬC) */}
        <div className="relative max-w-[340px] mx-auto min-h-[430px]">
          {/* SVG 3-Step Staircase Path connecting the 3 milestone landings */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 340 430"
            fill="none"
          >
            {/* The elegant 3-step staircase path */}
            <path
              d="M 20 112 L 125 112 Q 138 112 138 125 L 138 222 Q 138 235 151 235 L 225 235 Q 238 235 238 248 L 238 342 Q 238 355 251 355 L 325 355"
              stroke="#1a1a1a"
              strokeWidth="1.6"
              strokeLinecap="round"
              opacity="0.65"
            />

            {/* Subtle architectural staircase guide lines */}
            <path
              d="M 20 117 L 125 117 M 138 125 L 138 222 M 151 240 L 225 240 M 238 248 L 238 342 M 251 360 L 325 360"
              stroke="#bda893"
              strokeWidth="1"
              strokeDasharray="2 3"
              opacity="0.5"
            />

            {/* Step 1 Node: (75, 112) */}
            <circle cx="75" cy="112" r="3.5" fill="#1a1a1a" />
            <circle cx="75" cy="112" r="7" stroke="#1a1a1a" strokeWidth="1" opacity="0.3" />

            {/* Step 2 Node: (185, 235) */}
            <circle cx="185" cy="235" r="3.5" fill="#1a1a1a" />
            <circle cx="185" cy="235" r="7" stroke="#1a1a1a" strokeWidth="1" opacity="0.3" />

            {/* Step 3 Node: (280, 355) */}
            <circle cx="280" cy="355" r="3.5" fill="#1a1a1a" />
            <circle cx="280" cy="355" r="7" stroke="#1a1a1a" strokeWidth="1" opacity="0.3" />
          </svg>

          {/* ── MỐC 1: 09:00 RƯỚC DÂU (HIỆN RA ĐẦU TIÊN) ── */}
          <div
            className={`absolute flex flex-col items-center transition-all duration-[2400ms] cubic-bezier(0.16, 1, 0.3, 1) ${
              timelineInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
            }`}
            style={{
              top: '20px',
              left: '10px',
              width: '135px',
              transitionDelay: timelineInView ? '200ms' : '0ms',
            }}
          >
            <span
              className="text-sm font-bold tracking-wider"
              style={{ color: '#1a1a1a', fontFamily: "'Playfair Display', serif" }}
            >
              09:00
            </span>
            <span
              className="text-[11px] font-semibold tracking-widest uppercase mt-0.5"
              style={{ color: '#1a1a1a', fontFamily: "'Playfair Display', serif" }}
            >
              RƯỚC DÂU
            </span>
            {/* Bouquet Icon */}
            <div className="mt-1.5 w-8 h-8 flex items-center justify-center text-[#1a1a1a]">
              <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current" fill="none" strokeWidth="1.5">
                <path d="M12 2a4 4 0 0 0-4 4c0 1.5.8 2.8 2 3.5L8 22h8l-2-12.5c1.2-.7 2-2 2-3.5a4 4 0 0 0-4-4z" />
                <path d="M9 6a3 3 0 0 1 6 0" />
                <path d="M8 14h8" />
                <path d="M9 18h6" />
              </svg>
            </div>
          </div>

          {/* ── MỐC 2: 10:30 LÀM LỄ (HIỆN RA SAU BẬC 1 ĐÚNG 1S) ── */}
          <div
            className={`absolute flex flex-col items-center transition-all duration-[2400ms] cubic-bezier(0.16, 1, 0.3, 1) ${
              timelineInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
            }`}
            style={{
              top: '142px',
              left: '115px',
              width: '140px',
              transitionDelay: timelineInView ? '1200ms' : '0ms',
            }}
          >
            <span
              className="text-sm font-bold tracking-wider"
              style={{ color: '#1a1a1a', fontFamily: "'Playfair Display', serif" }}
            >
              10:30
            </span>
            <span
              className="text-[11px] font-semibold tracking-widest uppercase mt-0.5"
              style={{ color: '#1a1a1a', fontFamily: "'Playfair Display', serif" }}
            >
              LÀM LỄ
            </span>
            {/* Rings Icon with Heart */}
            <div className="mt-1.5 w-10 h-8 flex items-center justify-center text-[#1a1a1a]">
              <svg viewBox="0 0 28 24" className="w-6 h-5.5 stroke-current" fill="none" strokeWidth="1.5">
                <circle cx="10" cy="14" r="5.5" />
                <circle cx="18" cy="14" r="5.5" />
                <path d="M14 6 C13 4, 11 4, 11 6 C11 7.5, 14 9, 14 9 C14 9, 17 7.5, 17 6 C17 4, 15 4, 14 6 Z" fill="#1a1a1a" stroke="none" />
              </svg>
            </div>
          </div>

          {/* ── MỐC 3: 11:00 KHAI TIỆC & GIAO LƯU (HIỆN RA SAU BẬC 2 ĐÚNG 1S, CĂN CHUẨN TÂM TRỤC) ── */}
          <div
            className={`absolute flex flex-col items-center text-center transition-all duration-[2400ms] cubic-bezier(0.16, 1, 0.3, 1) ${
              timelineInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
            }`}
            style={{
              top: '260px',
              left: '210px',
              width: '140px',
              transitionDelay: timelineInView ? '2200ms' : '0ms',
            }}
          >
            <span
              className="text-sm font-bold tracking-wider"
              style={{ color: '#1a1a1a', fontFamily: "'Playfair Display', serif" }}
            >
              11:00
            </span>
            <span
              className="text-[10.5px] sm:text-[11px] font-semibold tracking-widest uppercase mt-0.5 leading-snug"
              style={{ color: '#1a1a1a', fontFamily: "'Playfair Display', serif" }}
            >
              KHAI TIỆC &amp;<br />GIAO LƯU
            </span>
            {/* Clinking glasses & celebration Icon */}
            <div className="mt-1.5 w-10 h-8 flex items-center justify-center text-[#1a1a1a]">
              <svg viewBox="0 0 28 24" className="w-6 h-5.5 stroke-current" fill="none" strokeWidth="1.4">
                <path d="M7 4 L11 9 C11 11.2 9 13 6.5 13 C4 13 2 11.2 2 9 L6 4 Z" />
                <path d="M6.5 13 L6.5 19 M3.5 19 L9.5 19" />
                <path d="M19 4 L15 9 C15 11.2 17 13 19.5 13 C22 13 24 11.2 24 9 L20 4 Z" />
                <path d="M19.5 13 L19.5 19 M16.5 19 L22.5 19" />
                <circle cx="13" cy="5" r="0.8" fill="#1a1a1a" />
                <path d="M13 3 L13 7 M11 5 L15 5" strokeWidth="1" />
              </svg>
            </div>
          </div>
        </div>

        {/* Điểm hoa Hoa2 ở chân lịch trình */}
        <div className="flex justify-center pt-6 pb-2">
          <img
            src="/thoahai/Hoa2.png"
            alt="hoa điểm chân lịch trình"
            className="w-24 h-auto object-contain opacity-80 pointer-events-none select-none"
          />
        </div>
      </div>
    </div>
  );
};
