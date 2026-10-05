import React, { useState, useEffect } from 'react';
import { Clock, Heart } from 'lucide-react';
import { useInView } from '../../hooks/useInView';

interface LoveStoryScreenProps {
  targetDate: string; // ISO date
}

export const LoveStoryScreen: React.FC<LoveStoryScreenProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const { ref: headerRef, isInView: headerInView } = useInView({ threshold: 0.15 });
  const { ref: countdownRef, isInView: countdownInView } = useInView({ threshold: 0.15 });

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="relative w-full min-h-full px-4 sm:px-5 py-8 bg-gradient-to-b from-[#faf6fe] via-[#f5ebfc] to-[#faf6fe] text-[#300f47] overflow-hidden">
      <div className="max-w-md mx-auto space-y-6 pt-1">
        {/* Header */}
        <div 
          ref={headerRef}
          className={`text-center space-y-1 reveal-init reveal-up ${headerInView ? 'reveal-active' : ''}`}
        >
          <span className="text-[11px] font-semibold tracking-[0.25em] text-[#7c4a9e] uppercase">
            SAVE THE DATE
          </span>
          <h2 className="font-serif text-2xl font-semibold text-[#3b1554] tracking-wide">
            Đếm Ngược Ngày Chung Đôi
          </h2>
          <div className="w-12 h-0.5 bg-[#a87ccb] mx-auto mt-2" />
        </div>

        {/* Live Countdown Card */}
        <div 
          ref={countdownRef}
          className={`bg-white rounded-3xl p-6 sm:p-7 border border-[#e2d3f2] shadow-md text-center space-y-4 reveal-init reveal-scale ${
            countdownInView ? 'reveal-active' : ''
          }`}
        >
          <div className="flex items-center justify-center gap-2 text-xs text-[#6b3594] font-semibold uppercase tracking-wider">
            <Clock className="w-4 h-4 text-[#8b5eb5]" />
            <span>Cùng chờ đón khoảnh khắc trọng đại</span>
          </div>

          <div className="grid grid-cols-4 gap-2.5 sm:gap-3 pt-1">
            {[
              { val: timeLeft.days, label: 'Ngày' },
              { val: timeLeft.hours, label: 'Giờ' },
              { val: timeLeft.minutes, label: 'Phút' },
              { val: timeLeft.seconds, label: 'Giây' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-b from-[#fbf8fe] to-[#f4e8fb] rounded-2xl p-3 border border-[#e8daf5] flex flex-col items-center justify-center shadow-2xs"
              >
                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#3b1554] tabular-nums">
                  {String(item.val).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-[11px] uppercase font-semibold text-[#7c4a9e] mt-1 tracking-wider">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* Romantic Quote */}
          <div className="pt-3 border-t border-[#f0e4f5] flex items-center justify-center gap-2 text-xs text-[#541f7a] font-serif italic">
            <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400 shrink-0" />
            <span>"Từng giây phút trôi qua đều là bước đệm cho ngày hạnh phúc nhất."</span>
          </div>
        </div>
      </div>
    </div>
  );
};
