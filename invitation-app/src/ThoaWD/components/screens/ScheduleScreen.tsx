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
          
          {/* ── 1. PHẦN NHÀ TRAI - NHÀ GÁI (2 BÊN ĐỐI DIỆN TRƯỢT VÀO NHAU) ── */}
          <div ref={parentsRef} className="grid grid-cols-2 gap-4 text-center overflow-hidden py-1">
            {/* Nhà Trai */}
            <div 
              className={`space-y-1 reveal-init reveal-left ${
                parentsInView ? 'reveal-active' : ''
              }`}
              style={{ transitionDelay: '150ms' }}
            >
              <h3 className="font-serif text-base sm:text-lg font-bold text-[#3b1554]">
                Nhà Trai
              </h3>
              <p className="font-sans text-xs sm:text-[13px] text-slate-700">
                Ông: {info.groomParents.father}
              </p>
              <p className="font-sans text-xs sm:text-[13px] text-slate-700">
                Bà: {info.groomParents.mother}
              </p>
              {info.groomParents.hometown && (
                <p className="font-sans text-xs sm:text-[13px] text-slate-600">
                  {info.groomParents.hometown}
                </p>
              )}
            </div>

            {/* Nhà Gái */}
            <div 
              className={`space-y-1 reveal-init reveal-right ${
                parentsInView ? 'reveal-active' : ''
              }`}
              style={{ transitionDelay: '150ms' }}
            >
              <h3 className="font-serif text-base sm:text-lg font-bold text-[#3b1554]">
                Nhà Gái
              </h3>
              <p className="font-sans text-xs sm:text-[13px] text-slate-700">
                Ông: {info.brideParents.father}
              </p>
              <p className="font-sans text-xs sm:text-[13px] text-slate-700">
                Bà: {info.brideParents.mother}
              </p>
              {info.brideParents.hometown && (
                <p className="font-sans text-xs sm:text-[13px] text-slate-600">
                  {info.brideParents.hometown}
                </p>
              )}
            </div>
          </div>

          {/* ── 2. TIÊU ĐỀ LỄ CƯỚI & GIỜ TỔ CHỨC ── */}
          <div 
            ref={eventRef} 
            className={`space-y-5 reveal-init reveal-scale ${eventInView ? 'reveal-active' : ''}`}
          >
            <div className="text-center space-y-1 pt-2 border-t border-[#f0e4f5]">
              <h2 className="font-serif text-base sm:text-lg font-bold tracking-[0.18em] text-[#3b1554] uppercase">
                {event.title}
              </h2>
              <p className="font-serif text-xs sm:text-sm font-semibold tracking-wider text-[#4a1d6d] uppercase">
                {event.timePrefix || `VÀO LÚC ${event.time}`}
              </p>
            </div>

            {/* ── 3. KHỐI HIỂN THỊ NGÀY ĐẶC TRƯNG: [THÁNG] [NGÀY TO] [NĂM] (DÀI XUỐNG DỄ NHÌN) ── */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 py-3 sm:py-4 my-1">
              {/* THÁNG */}
              <div className="flex-1 text-center">
                <div className="border-t border-b border-[#3b1554]/30 py-3 sm:py-4 px-2 min-h-[56px] sm:min-h-[64px] flex items-center justify-center">
                  <span className="font-serif text-sm sm:text-base font-bold tracking-[0.2em] text-[#3b1554] uppercase block">
                    {event.monthText || 'THÁNG 07'}
                  </span>
                </div>
              </div>

              {/* CON SỐ NGÀY RẤT TO Ở CHÍNH GIỮA */}
              <div className="shrink-0 px-2 sm:px-3 transform hover:scale-105 transition-transform flex items-center justify-center">
                <span className="font-serif text-5xl sm:text-6xl font-semibold text-[#802534] leading-none select-none block drop-shadow-xs">
                  {event.day || '29'}
                </span>
              </div>

              {/* NĂM */}
              <div className="flex-1 text-center">
                <div className="border-t border-b border-[#3b1554]/30 py-3 sm:py-4 px-2 min-h-[56px] sm:min-h-[64px] flex items-center justify-center">
                  <span className="font-serif text-sm sm:text-base font-bold tracking-[0.2em] text-[#3b1554] uppercase block">
                    {event.yearText || 'NĂM 2026'}
                  </span>
                </div>
              </div>
            </div>

            {/* ── 4. NGÀY ÂM LỊCH ── */}
            <div className="text-center pt-1 pb-1">
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
