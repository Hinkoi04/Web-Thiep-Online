import React from 'react';
import { useInView } from '../../hooks/useInView';

export const ScheduleScreen: React.FC = () => {
  const { ref: timelineRef, isInView: timelineInView } = useInView({ threshold: 0.1 });

  return (
    <div className="relative w-full px-5 pt-10 pb-0 bg-[#faf5ee] text-[#3d2c1e] select-none overflow-hidden">
      {/* ── TOP RIGHT FLORAL ACCENT (HOA5) ── */}
      <div className="absolute top-2 right-1 w-16 sm:w-20 pointer-events-none z-10 opacity-90 drop-shadow-xs">
        <img
          src="/thoahai/Hoa16.png"
          alt="hoa điểm lịch trình"
          className="w-full h-auto object-contain"
        />
      </div>

      {/* ── TIMELINE SECTION (IMAGE 2 WAVY PATH) ── */}
      <div
        ref={timelineRef}
        className={`relative pt-4 pb-0 th-reveal-init th-reveal-up ${timelineInView ? 'th-reveal-active' : ''}`}
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

        {/* Timeline Path Image & Milestones */}
        <div className="relative max-w-[360px] mx-auto h-[480px]">
          {/* Ảnh timeline cong chữ S hiện từ trên xuống dưới trong 4s (chậm thêm 2s) */}
          <div
            className="absolute inset-0 flex justify-center items-center pointer-events-none"
            style={{
              clipPath: timelineInView ? 'inset(0% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)',
              transition: 'clip-path 6000ms cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <img
              src="/thoahai/timeline.png"
              alt="Lịch trình hôn lễ"
              className="h-[460px] w-auto object-contain select-none pointer-events-none"
            />
          </div>

          {/* ── MỐC 1: 09:00 RƯỚC DÂU (Hiển thị sau khi đường vẽ hiện xong 1s: 4000ms + 1000ms = 5000ms) ── */}
          <div
            className={`absolute flex flex-col items-start text-left transition-all duration-[900ms] cubic-bezier(0.16, 1, 0.3, 1) ${timelineInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
              }`}
            style={{
              top: '16%',
              transform: 'translateY(-50%)',
              left: 'calc(50% + 72px)',
              right: '4px',
              transitionDelay: timelineInView ? '3000ms' : '0ms',
            }}
          >
            <div className="flex items-center gap-1.5">
              <span
                className="text-base font-bold tracking-wider"
                style={{ color: '#7b2c2d', fontFamily: "'Playfair Display', serif" }}
              >
                09:00
              </span>
              <div className="w-5 h-5 flex items-center justify-center text-[#7b2c2d]">
                <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current" fill="none" strokeWidth="1.6">
                  <path d="M12 2a4 4 0 0 0-4 4c0 1.5.8 2.8 2 3.5L8 22h8l-2-12.5c1.2-.7 2-2 2-3.5a4 4 0 0 0-4-4z" />
                  <path d="M9 6a3 3 0 0 1 6 0" />
                  <path d="M8 14h8" />
                  <path d="M9 18h6" />
                </svg>
              </div>
            </div>
            <span
              className="text-xs font-semibold tracking-widest uppercase mt-0.5"
              style={{ color: '#1a1a1a', fontFamily: "'Playfair Display', serif" }}
            >
              RƯỚC DÂU
            </span>
          </div>

          {/* ── MỐC 2: 10:30 LÀM LỄ (Hiển thị sau khi đường vẽ hiện xong 1s: 5000ms) ── */}
          <div
            className={`absolute flex flex-col items-end text-right transition-all duration-[900ms] cubic-bezier(0.16, 1, 0.3, 1) ${timelineInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
              }`}
            style={{
              top: '56%',
              transform: 'translateY(-50%)',
              right: 'calc(50% + 72px)',
              left: '4px',
              transitionDelay: timelineInView ? '3500ms' : '0ms',
            }}
          >
            <div className="flex items-center justify-end gap-1.5">
              <div className="w-5 h-5 flex items-center justify-center text-[#7b2c2d]">
                <svg viewBox="0 0 28 24" className="w-4.5 h-4.5 stroke-current" fill="none" strokeWidth="1.6">
                  <circle cx="10" cy="14" r="5.5" />
                  <circle cx="18" cy="14" r="5.5" />
                  <path d="M14 6 C13 4, 11 4, 11 6 C11 7.5, 14 9, 14 9 C14 9, 17 7.5, 17 6 C17 4, 15 4, 14 6 Z" fill="#7b2c2d" stroke="none" />
                </svg>
              </div>
              <span
                className="text-base font-bold tracking-wider"
                style={{ color: '#7b2c2d', fontFamily: "'Playfair Display', serif" }}
              >
                10:30
              </span>
            </div>
            <span
              className="text-xs font-semibold tracking-widest uppercase mt-0.5"
              style={{ color: '#1a1a1a', fontFamily: "'Playfair Display', serif" }}
            >
              LÀM LỄ
            </span>
          </div>

          {/* ── MỐC 3: 11:00 KHAI TIỆC & GIAO LƯU (Hiển thị sau khi đường vẽ hiện xong 1s: 5000ms) ── */}
          <div
            className={`absolute flex flex-col items-start text-left transition-all duration-[900ms] cubic-bezier(0.16, 1, 0.3, 1) ${timelineInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
              }`}
            style={{
              top: '81.5%',
              transform: 'translateY(-50%)',
              left: 'calc(50% + 64px)',
              right: '4px',
              transitionDelay: timelineInView ? '4000ms' : '0ms',
            }}
          >
            <div className="flex items-center gap-1.5">
              <span
                className="text-base font-bold tracking-wider"
                style={{ color: '#7b2c2d', fontFamily: "'Playfair Display', serif" }}
              >
                11:00
              </span>
              <div className="w-5 h-5 flex items-center justify-center text-[#7b2c2d]">
                <svg viewBox="0 0 28 24" className="w-4.5 h-4.5 stroke-current" fill="none" strokeWidth="1.5">
                  <path d="M7 4 L11 9 C11 11.2 9 13 6.5 13 C4 13 2 11.2 2 9 L6 4 Z" />
                  <path d="M6.5 13 L6.5 19 M3.5 19 L9.5 19" />
                  <path d="M19 4 L15 9 C15 11.2 17 13 19.5 13 C22 13 24 11.2 24 9 L20 4 Z" />
                  <path d="M19.5 13 L19.5 19 M16.5 19 L22.5 19" />
                  <circle cx="13" cy="5" r="0.8" fill="#7b2c2d" />
                  <path d="M13 3 L13 7 M11 5 L15 5" strokeWidth="1" />
                </svg>
              </div>
            </div>
            <span
              className="text-[11px] font-semibold tracking-widest uppercase mt-0.5 leading-snug"
              style={{ color: '#1a1a1a', fontFamily: "'Playfair Display', serif" }}
            >
              KHAI TIỆC &amp;<br />GIAO LƯU
            </span>
          </div>
        </div>

        {/* Điểm hoa Hoa2 ở chân lịch trình (nằm sát vạch dưới) */}
        <div className="flex justify-center items-end pt-4 pb-0 leading-none">
          <img
            src="/thoahai/Hoa20.png"
            alt="hoa điểm chân lịch trình"
            className="w-50 h-auto block object-contain opacity-80 pointer-events-none select-none -mb-px"
          />
        </div>
      </div>
    </div>
  );
};
