import React, { useState, useEffect } from 'react';
import type { WeddingInfo } from '../../types';
import { Calendar, MessageSquareHeart, Heart } from 'lucide-react';
import { useInView } from '../../hooks/useInView';

interface InvitationDetailsScreenProps {
  weddingInfo: WeddingInfo;
  onGoToSchedule: () => void;
  onGoToGuestbook?: () => void;
}

export const InvitationDetailsScreen: React.FC<InvitationDetailsScreenProps> = ({
  weddingInfo,
  onGoToSchedule,
  onGoToGuestbook,
}) => {
  const { ref: titleRef, isInView: titleInView } = useInView({ threshold: 0.15 });
  const { ref: letterRef, isInView: letterInView } = useInView({ threshold: 0.15 });
  const { ref: actionRef, isInView: actionInView } = useInView({ threshold: 0.15 });

  const fullQuote =
    '"Hôn nhân là bến đỗ bình yên, nơi tình yêu được đơm hoa kết trái. Trong ngày vui trọng đại của cuộc đời, sự hiện diện và lời chúc phúc của quý khách là niềm vinh hạnh to lớn đối với chúng tôi."';

  const [typedQuote, setTypedQuote] = useState('');
  const [isQuoteTyping, setIsQuoteTyping] = useState(false);

  // Typewriter effect for quote when letter card is in view
  useEffect(() => {
    if (!letterInView) return;
    setIsQuoteTyping(true);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTypedQuote(fullQuote.slice(0, i));
      if (i >= fullQuote.length) {
        clearInterval(interval);
        setIsQuoteTyping(false);
      }
    }, 22);
    return () => clearInterval(interval);
  }, [letterInView, fullQuote]);

  return (
    <div className="relative w-full min-h-full px-4 sm:px-6 py-8 bg-gradient-to-b from-[#faf7fb] via-[#f7eff7] to-[#faf7fb] text-[#300f47] overflow-hidden">
      <div className="max-w-md mx-auto text-center space-y-6 pt-2">
        {/* Title */}
        <div
          ref={titleRef}
          className={`space-y-1 reveal-init reveal-up ${titleInView ? 'reveal-active' : ''}`}
        >
          <span className="text-[11px] font-semibold tracking-[0.25em] text-[#7c4a9e] uppercase">
            THƯ NGỎ
          </span>
          <h2 className="font-serif text-2xl font-semibold text-[#3b1554] tracking-wide">
            Lời Mời Trang Trọng
          </h2>
          <div className="w-12 h-0.5 bg-[#a87ccb] mx-auto mt-2" />
        </div>

        {/* Formal Invitation Letter Card */}
        <div
          ref={letterRef}
          className={`bg-white/95 backdrop-blur-xs rounded-3xl p-6 sm:p-7 border border-[#e8dcef] shadow-md text-center space-y-5 overflow-hidden reveal-init reveal-scale ${letterInView ? 'reveal-active' : ''
            }`}
        >
          {/* 1. Đoạn Triết Lý Mở Đầu (Giữ Hiệu Ứng Đánh Máy Từ Từ) */}
          <div className="min-h-[4.2rem] flex items-center justify-center">
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans italic">
              {typedQuote}
              {isQuoteTyping && (
                <span className="inline-block w-[1.5px] h-[1em] bg-purple-600 animate-pulse ml-0.5 align-middle" />
              )}
            </p>
          </div>

          {/* 2, 3, 4. Hộp Kính Mời (Bay vào 2 bên từ từ, chậm thêm 1s) */}
          <div className="p-4 bg-[#f8f2fc] rounded-2xl border border-[#e8daf5] space-y-1 overflow-hidden">
            {/* 2. Tiêu Đề: Bay từ bên trái vào */}
            <span
              className={`text-[11px] uppercase tracking-wider text-[#6b3594] font-medium block transition-all duration-[4200ms] cubic-bezier(0.2,0.8,0.2,1) delay-150 ${letterInView
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-16'
                }`}
            >
              Trân trọng kính mời
            </span>

            {/* 3. Tên Khách Mời: Bay từ bên phải vào */}
            <span
              className={`font-calligraphy text-2xl sm:text-3xl text-[#3b1554] font-normal block py-0.5 transition-all duration-[4400ms] cubic-bezier(0.2,0.8,0.2,1) delay-300 ${letterInView
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 translate-x-16'
                }`}
            >
              {weddingInfo.guestName}
            </span>

            {/* 4. Dòng Thân Mật: Bay từ bên trái vào */}
            <span
              className={`text-xs text-slate-500 block leading-relaxed transition-all duration-[4200ms] cubic-bezier(0.2,0.8,0.2,1) delay-500 ${letterInView
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-16'
                }`}
            >
              Tới dự bữa cơm thân mật chung vui cùng gia đình chúng tôi
            </span>
          </div>

          {/* 5. Chữ Ký Cặp Đôi: Tên Chú Rể (trái) & Tên Cô Dâu (phải) bay vào từ 2 bên (chậm thêm 1s nữa: 5.5s & 4.8s) */}
          <div className="pt-2 flex items-center justify-center gap-3 text-slate-800 overflow-hidden">
            {/* Tên Chú Rể bay từ bên trái vào */}
            <span
              className={`font-calligraphy text-2xl text-[#3b1554] transition-all duration-[8500ms] cubic-bezier(0.2,0.8,0.2,1) delay-700 inline-block ${letterInView
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-16'
                }`}
            >
              {weddingInfo.groomFullName}
            </span>

            {/* Trái tim hồng ở giữa */}
            <span
              className={`transition-all duration-[4800ms] cubic-bezier(0.2,0.8,0.2,1) delay-850 inline-block ${letterInView ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                }`}
            >
              <Heart className="w-4 h-4 fill-pink-400 text-pink-400" />
            </span>

            {/* Tên Cô Dâu bay từ bên phải vào */}
            <span
              className={`font-calligraphy text-2xl text-[#3b1554] transition-all duration-[5500ms] cubic-bezier(0.2,0.8,0.2,1) delay-700 inline-block ${letterInView
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 translate-x-16'
                }`}
            >
              {weddingInfo.brideFullName}
            </span>
          </div>
        </div>

        {/* Quick Actions */}
        <div
          ref={actionRef}
          className={`grid grid-cols-2 gap-3 pt-1 reveal-init reveal-up ${actionInView ? 'reveal-active' : ''
            }`}
        >
          <button
            onClick={onGoToSchedule}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white border border-[#d8c2ed] text-slate-800 text-xs font-semibold hover:bg-purple-50 transition-colors shadow-2xs cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-[#6b3594]" />
            <span>Xem thời gian & địa điểm</span>
          </button>
          <button
            onClick={onGoToGuestbook}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-[#4a1d6d] hover:bg-[#5c2487] text-white text-xs font-semibold transition-colors shadow-sm cursor-pointer"
          >
            <MessageSquareHeart className="w-4 h-4 text-pink-300" />
            <span>Gửi lời chúc</span>
          </button>
        </div>
      </div>
    </div>
  );
};

