import React from 'react';
import { galleryPhotos } from '../data/weddingData';
import { Heart } from 'lucide-react';
import { useInView } from '../hooks/useInView';

interface WeddingCalendarCardProps {
  photoUrl?: string;
  weddingDateStr?: string;
  dayToHighlight?: number;
}

export const WeddingCalendarCard: React.FC<WeddingCalendarCardProps> = ({
  photoUrl = galleryPhotos[0]?.url || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=700&q=85',
  weddingDateStr = '29.07.2026',
  dayToHighlight = 29,
}) => {
  const { ref: cardRef, isInView } = useInView({ threshold: 0.15 });

  // July 2026 calendar data: July 1, 2026 is a Wednesday (Wed)
  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const daysGrid: (number | null)[] = [
    null, null, 1, 2, 3, 4, 5,
    6, 7, 8, 9, 10, 11, 12,
    13, 14, 15, 16, 17, 18, 19,
    20, 21, 22, 23, 24, 25, 26,
    27, 28, 29, 30, 31, null, null,
  ];

  return (
    <div ref={cardRef} className="w-full select-none">
      {/* Main Calendar Card - Hiển thị khung trước */}
      <div className="w-full bg-gradient-to-br from-[#9880ad] via-[#8f75a4] to-[#866c9b] text-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 shadow-sm border border-purple-200/40 relative overflow-hidden transition-all duration-700">
        <div className="grid grid-cols-12 gap-3 items-center">
          
          {/* ── CỘT TRÁI: ẢNH CƯỚI ĐỨNG CÓ THANH NGÀY DƯỚI ĐÁY ── */}
          <div className="col-span-5 sm:col-span-5 flex flex-col items-center">
            <div className="w-full rounded-xl sm:rounded-2xl overflow-hidden shadow-xs bg-white border border-white/90">
              <div className="w-full h-36 sm:h-40 overflow-hidden bg-slate-200">
                <img
                  src={photoUrl}
                  alt="Ảnh cưới"
                  className="w-full h-full object-cover object-[center_20%]"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
              {/* Thanh hiển thị ngày cưới dưới đáy ảnh */}
              <div className="bg-white py-0.5 text-center border-t border-slate-100">
                <span className="font-serif text-[10px] sm:text-[11px] font-semibold tracking-wider text-slate-800">
                  {weddingDateStr}
                </span>
              </div>
            </div>
          </div>

          {/* ── CỘT PHẢI: LỊCH THÁNG & CÁC NGÀY DI CHUYỂN VÀO SAU ── */}
          <div className="col-span-7 sm:col-span-7 space-y-1.5 pl-0.5">
            {/* Header Tháng */}
            <div className="text-right pr-0.5">
              <span className="font-sans text-xs sm:text-sm font-bold tracking-wide text-white drop-shadow-xs">
                Tháng 07.2026
              </span>
            </div>

            {/* Thứ trong tuần */}
            <div className="grid grid-cols-7 gap-0.5 text-center">
              {weekdays.map((d, i) => (
                <span
                  key={i}
                  className={`text-[9.5px] sm:text-[10.5px] font-semibold text-purple-200 tracking-tighter transition-all duration-500 ${
                    isInView ? 'opacity-100' : 'opacity-40'
                  }`}
                >
                  {d}
                </span>
              ))}
            </div>

            {/* Lưới ngày - CÁC CON SỐ NGÀY DI CHUYỂN VÀO SAU THEO THỨ TỰ */}
            <div className="grid grid-cols-7 gap-y-1 gap-x-0.5 text-center items-center">
              {daysGrid.map((day, idx) => {
                if (day === null) {
                  return <div key={idx} className="h-5 sm:h-6" />;
                }
                const isWeddingDay = day === dayToHighlight;
                const delayMs = 350 + (typeof day === 'number' ? day * 35 : idx * 30);

                return (
                  <div
                    key={idx}
                    className="flex items-center justify-center h-5 sm:h-6"
                    style={{
                      transition: 'all 2.8s cubic-bezier(0.2, 0.8, 0.2, 1)',
                      transitionDelay: isInView ? `${delayMs}ms` : '0ms',
                      transform: isInView ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.65)',
                      opacity: isInView ? 1 : 0,
                    }}
                  >
                    {isWeddingDay ? (
                      /* Ngày cưới được làm nổi bật với biểu tượng trái tim đỏ */
                      <div className="relative w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-[10px] sm:text-[11px] shadow-sm animate-pulse">
                        <Heart className="absolute inset-0 w-full h-full text-rose-600 fill-rose-600 -z-10 scale-125 opacity-40 animate-ping" />
                        <span className="z-10 font-bold leading-none">
                          {day}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[10.5px] sm:text-[11.5px] font-normal text-white/90">
                        {day}
                      </span>
                    )}
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
