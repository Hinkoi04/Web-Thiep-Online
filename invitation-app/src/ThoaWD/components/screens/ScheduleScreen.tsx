import React from 'react';
import { weddingEvents, initialWeddingInfo } from '../../data/weddingData';
import { WeddingCalendarCard } from '../WeddingCalendarCard';
import { Navigation } from 'lucide-react';
import { useInView } from '../../hooks/useInView';

export const ScheduleScreen: React.FC = () => {
  const event = weddingEvents[0];
  const info = initialWeddingInfo;

  const { ref: parentsRef, isInView: parentsInView } = useInView({ threshold: 0.15 });
  const { ref: eventRef, isInView: eventInView } = useInView({ threshold: 0.15 });
  const { ref: calendarRef, isInView: calendarInView } = useInView({ threshold: 0.15 });
  const { ref: mapRef, isInView: mapInView } = useInView({ threshold: 0.15 });

  if (!event) return null;

  return (
    <div className="relative w-full min-h-full px-4 sm:px-6 py-8 bg-gradient-to-b from-[#faf7fb] via-[#f7eff7] to-[#faf7fb] text-[#300f47] overflow-hidden">
      <div className="max-w-md mx-auto space-y-7 pt-1">

        {/* Card chứa toàn bộ thông tin lịch trình hôn lễ */}
        <div className="bg-white/95 rounded-3xl p-5 sm:p-7 border border-[#e8dcef] shadow-md space-y-6">

          {/* ── 1. PHẦN NHÀ TRAI - NHÀ GÁI (TỪNG DÒNG CHẠY XEN KẼ NHAU) ── */}
          <div ref={parentsRef} className="grid grid-cols-2 gap-4 text-center overflow-hidden py-1">
            {/* Cột Nhà Trai (Chạy từ bên trái vào) */}
            <div className="space-y-1.5 overflow-hidden">
              {/* Dòng 1: Tiêu đề Nhà Trai */}
              <h3
                className={`font-serif text-base sm:text-lg font-bold text-[#3b1554] transition-all duration-[900ms] cubic-bezier(0.2,0.8,0.2,1) ${parentsInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
                  }`}
                style={{ transitionDelay: '100ms' }}
              >
                Nhà Trai
              </h3>

              {/* Dòng 2: Tên Ông (Nhà Trai) */}
              <p
                className={`font-sans text-xs sm:text-[13px] text-slate-700 transition-all duration-[900ms] cubic-bezier(0.2,0.8,0.2,1) ${parentsInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
                  }`}
                style={{ transitionDelay: '500ms' }}
              >
                Ông: {info.groomParents.father}
              </p>

              {/* Dòng 3: Tên Bà (Nhà Trai) */}
              <p
                className={`font-sans text-xs sm:text-[13px] text-slate-700 transition-all duration-[900ms] cubic-bezier(0.2,0.8,0.2,1) ${parentsInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
                  }`}
                style={{ transitionDelay: '900ms' }}
              >
                Bà: {info.groomParents.mother}
              </p>

              {/* Dòng 4: Quê Quán (Nhà Trai) */}
              {info.groomParents.hometown && (
                <p
                  className={`font-sans text-xs sm:text-[13px] text-slate-600 transition-all duration-[900ms] cubic-bezier(0.2,0.8,0.2,1) ${parentsInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
                    }`}
                  style={{ transitionDelay: '1300ms' }}
                >
                  {info.groomParents.hometown}
                </p>
              )}
            </div>

            {/* Cột Nhà Gái (Chạy từ bên phải vào) */}
            <div className="space-y-1.5 overflow-hidden">
              {/* Dòng 1: Tiêu đề Nhà Gái */}
              <h3
                className={`font-serif text-base sm:text-lg font-bold text-[#3b1554] transition-all duration-[900ms] cubic-bezier(0.2,0.8,0.2,1) ${parentsInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
                  }`}
                style={{ transitionDelay: '300ms' }}
              >
                Nhà Gái
              </h3>

              {/* Dòng 2: Tên Ông (Nhà Gái) */}
              <p
                className={`font-sans text-xs sm:text-[13px] text-slate-700 transition-all duration-[900ms] cubic-bezier(0.2,0.8,0.2,1) ${parentsInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
                  }`}
                style={{ transitionDelay: '700ms' }}
              >
                Ông: {info.brideParents.father}
              </p>

              {/* Dòng 3: Tên Bà (Nhà Gái) */}
              <p
                className={`font-sans text-xs sm:text-[13px] text-slate-700 transition-all duration-[900ms] cubic-bezier(0.2,0.8,0.2,1) ${parentsInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
                  }`}
                style={{ transitionDelay: '1100ms' }}
              >
                Bà: {info.brideParents.mother}
              </p>

              {/* Dòng 4: Quê Quán (Nhà Gái) */}
              {info.brideParents.hometown && (
                <p
                  className={`font-sans text-xs sm:text-[13px] text-slate-600 transition-all duration-[900ms] cubic-bezier(0.2,0.8,0.2,1) ${parentsInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
                    }`}
                  style={{ transitionDelay: '1500ms' }}
                >
                  {info.brideParents.hometown}
                </p>
              )}
            </div>
          </div>

          {/* ── 2. TIÊU ĐỀ LỄ CƯỚI & GIỜ TỔ CHỨC ── */}
          <div
            ref={eventRef}
            className="space-y-5"
          >
            {/* Khung đường kẻ trên hiện trước, tiêu đề & giờ xuất hiện sau 1s (1000ms) */}
            <div className="pt-2 border-t border-[#f0e4f5] overflow-hidden">
              <div
                className={`text-center space-y-1 transition-all duration-[900ms] cubic-bezier(0.2,0.8,0.2,1) ${eventInView ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                  }`}
                style={{ transitionDelay: '2000ms' }}
              >
                <h2 className="font-serif text-base sm:text-lg font-bold tracking-[0.18em] text-[#3b1554] uppercase">
                  {event.title}
                </h2>
                <p className="font-serif text-xs sm:text-sm font-semibold tracking-wider text-[#4a1d6d] uppercase">
                  {event.timePrefix || `VÀO LÚC ${event.time}`}
                </p>
              </div>
            </div>

            {/* ── 3. KHỐI HIỂN THỊ NGÀY ĐẶC TRƯNG: [THÁNG] [NGÀY TO] [NĂM] ── */}
            {/* Khung viền Tháng/Năm hiện ngay lập tức, chữ Tháng/Năm và số Ngày to xuất hiện sau 1s */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 py-3 sm:py-4 my-1">
              {/* KHUNG THÁNG (Viền kẻ hiện ngay, chữ bên trong xuất hiện sau 1s) */}
              <div className="flex-1 text-center">
                <div
                  className={`border-t border-b border-[#3b1554]/30 py-3 sm:py-4 px-2 min-h-[56px] sm:min-h-[64px] flex items-center justify-center transition-all duration-[600ms] ${eventInView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                    }`}
                >
                  <span
                    className={`font-serif text-sm sm:text-base font-bold tracking-[0.2em] text-[#3b1554] uppercase block transition-all duration-[900ms] cubic-bezier(0.2,0.8,0.2,1) ${eventInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6'
                      }`}
                    style={{ transitionDelay: '1100ms' }}
                  >
                    {event.monthText || 'THÁNG 07'}
                  </span>
                </div>
              </div>

              {/* CON SỐ NGÀY RẤT TO Ở CHÍNH GIỮA (Xuất hiện sau 1s với hiệu ứng phóng to nổi bật) */}
              <div
                className={`shrink-0 px-2 sm:px-3 flex items-center justify-center transition-all duration-[950ms] cubic-bezier(0.34,1.56,0.64,1) ${eventInView ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                  }`}
                style={{ transitionDelay: '1250ms' }}
              >
                <span className="font-serif text-5xl sm:text-6xl font-semibold text-[#802534] leading-none select-none block drop-shadow-xs transform hover:scale-105 transition-transform">
                  {event.day || '29'}
                </span>
              </div>

              {/* KHUNG NĂM (Viền kẻ hiện ngay, chữ bên trong xuất hiện sau 1s) */}
              <div className="flex-1 text-center">
                <div
                  className={`border-t border-b border-[#3b1554]/30 py-3 sm:py-4 px-2 min-h-[56px] sm:min-h-[64px] flex items-center justify-center transition-all duration-[600ms] ${eventInView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                    }`}
                >
                  <span
                    className={`font-serif text-sm sm:text-base font-bold tracking-[0.2em] text-[#3b1554] uppercase block transition-all duration-[900ms] cubic-bezier(0.2,0.8,0.2,1) ${eventInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6'
                      }`}
                    style={{ transitionDelay: '1100ms' }}
                  >
                    {event.yearText || 'NĂM 2026'}
                  </span>
                </div>
              </div>
            </div>

            {/* ── 4. NGÀY ÂM LỊCH (Xuất hiện sau ngày dương lịch) ── */}
            <div
              className={`text-center pt-1 pb-1 transition-all duration-[800ms] cubic-bezier(0.2,0.8,0.2,1) ${eventInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              style={{ transitionDelay: '1400ms' }}
            >
              <p className="font-serif italic text-xs sm:text-sm text-slate-600">
                {event.lunarText || `(${info.lunarDateText})`}
              </p>
            </div>

            {/* ── 5. KHUNG LỊCH CƯỚI NẰM NGAY DƯỚI LỄ CƯỚI & TRÊN ĐỊA ĐIỂM TỔ CHỨC ── */}
            <div ref={calendarRef} className={`pt-2 pb-1 reveal-init reveal-up ${calendarInView ? 'reveal-active' : ''}`}>
              <WeddingCalendarCard weddingDateStr={info.solarDateText} dayToHighlight={29} />
            </div>

            {/* ── 6. ĐỊA ĐIỂM TỔ CHỨC ── */}
            <div className="text-center space-y-1.5 pt-3 border-t border-[#f0e4f5]">
              <h3 className="font-serif text-sm sm:text-base font-bold tracking-[0.18em] text-[#3b1554] uppercase">
                {event.locationName || 'ĐỊA ĐIỂM TỔ CHỨC'}
              </h3>
              <p className="font-serif text-xs sm:text-[13px] text-slate-700 max-w-xs mx-auto leading-relaxed">
                ({event.address})
              </p>
            </div>
          </div>

          {/* ── 7. NÚT CHỈ ĐƯỜNG MAPS TỐI GIẢN ── */}
          <div
            ref={mapRef}
            className={`pt-2 reveal-init reveal-up ${mapInView ? 'reveal-active' : ''}`}
          >
            <a
              href={event.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full max-w-xs mx-auto flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-[#4a1d6d] hover:bg-[#5c2487] text-white text-xs sm:text-sm font-semibold tracking-wider transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg active:scale-98"
            >
              <Navigation className="w-4 h-4 text-amber-300" />
              <span>CHỈ ĐƯỜNG GOOGLE MAPS</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
