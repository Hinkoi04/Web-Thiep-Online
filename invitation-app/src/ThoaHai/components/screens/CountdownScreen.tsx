import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { useInView } from '../../hooks/useInView';

interface CountdownScreenProps {
  targetDate: string;
}

export const CountdownScreen: React.FC<CountdownScreenProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const { ref: headerRef, isInView: headerInView } = useInView({ threshold: 0.1 });

  // Typewriter effect cho tiêu đề "Đếm Ngược Ngày Chung Đôi"
  const fullTitle = 'Đếm Ngược Ngày Chung Đôi';
  const [typedTitle, setTypedTitle] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isTitleDone, setIsTitleDone] = useState(false);

  useEffect(() => {
    if (!headerInView) return;
    setIsTyping(true);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTypedTitle(fullTitle.slice(0, i));
      if (i >= fullTitle.length) {
        clearInterval(interval);
        setIsTyping(false);
        // Sau khi gõ máy xong, kích hoạt hiện đồng hồ đếm ngược
        setTimeout(() => setIsTitleDone(true), 250);
      }
    }, 55);
    return () => clearInterval(interval);
  }, [headerInView, fullTitle]);

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
    <div className="relative w-full px-5 py-8 bg-[#faf5ee] text-[#3d2c1e] text-center select-none overflow-hidden">
      <div className="max-w-md mx-auto space-y-5 pt-1">
        {/* Header với hiệu ứng đánh máy */}
        <div
          ref={headerRef}
          className={`space-y-1 transition-all duration-[2000ms] ${headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          {/* Điểm hoa Hoa6 (nhánh hoa trái tim) */}
          <img
            src="/thoahai/Hoa6.png"
            alt="hoa điểm đếm ngược"
            className="w-9 h-auto mx-auto mb-1 opacity-90 drop-shadow-xs pointer-events-none select-none"
          />

          <span
            className="text-[11px] font-semibold tracking-[0.25em] uppercase"
            style={{ color: '#4a4039', fontFamily: "'Playfair Display', serif" }}
          >
            SAVE THE DATE
          </span>

          {/* Tiêu đề đánh máy từng chữ */}
          <h2
            className="text-2xl sm:text-3xl font-semibold tracking-wide min-h-[38px] flex items-center justify-center"
            style={{ color: '#1a1a1a', fontFamily: "'Playfair Display', serif" }}
          >
            <span>{typedTitle}</span>
            {isTyping && (
              <span className="inline-block w-[2px] h-[1em] bg-[#1a1a1a] animate-pulse ml-1 align-middle" />
            )}
          </h2>
          <div className="w-12 h-0.5 mx-auto mt-2" style={{ background: '#d8c7b3' }} />
        </div>

        {/* Live Countdown Card (hiện ra sau khi đánh máy xong tiêu đề) */}
        <div
          className={`rounded-3xl p-6 sm:p-7 border text-center space-y-4 transition-all duration-[2400ms] cubic-bezier(0.16, 1, 0.3, 1) ${
            isTitleDone ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-8 pointer-events-none'
          }`}
          style={{
            background: 'rgba(245, 238, 228, 0.65)',
            borderColor: 'rgba(215, 195, 175, 0.75)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
          }}
        >
          <div
            className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider"
            style={{ color: '#4a4039' }}
          >
            <Clock className="w-4 h-4 text-[#1a1a1a]" />
            <span>29 · 10 · 2026 — 10:30 - 11:00 THỨ NĂM</span>
          </div>

          {/* Countdown grid */}
          <div className="grid grid-cols-4 gap-2.5 sm:gap-3 pt-1">
            {[
              { val: timeLeft.days, label: 'Ngày' },
              { val: timeLeft.hours, label: 'Giờ' },
              { val: timeLeft.minutes, label: 'Phút' },
              { val: timeLeft.seconds, label: 'Giây' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl p-3 border flex flex-col items-center justify-center transition-all hover:scale-105"
                style={{
                  background: 'linear-gradient(180deg, #fdfbf7 0%, rgba(225,203,180,0.25) 100%)',
                  borderColor: 'rgba(225,203,180,0.7)',
                }}
              >
                <span
                  className="font-bold tabular-nums"
                  style={{
                    fontSize: '1.75rem',
                    color: '#1a1a1a',
                    fontFamily: "'Playfair Display', serif",
                  }}
                >
                  {String(item.val).padStart(2, '0')}
                </span>
                <span
                  className="text-[10px] sm:text-[11px] uppercase font-semibold mt-1 tracking-wider"
                  style={{ color: '#4a4039' }}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <p className="text-xs italic text-[#6d5a49] pt-1">
            Chỉ còn một chút thời gian nữa thôi, hãy cùng đếm ngược với chúng mình nhé!
          </p>
        </div>
      </div>
    </div>
  );
};
