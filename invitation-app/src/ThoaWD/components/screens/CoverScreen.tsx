import React from 'react';
import type { WeddingInfo } from '../../types';
import { Volume2, VolumeX } from 'lucide-react';
import { useInView } from '../../hooks/useInView';

interface CoverScreenProps {
  weddingInfo: WeddingInfo;
  onExploreClick?: () => void;
  isPlayingMusic: boolean;
  onToggleMusic: () => void;
}

export const CoverScreen: React.FC<CoverScreenProps> = ({
  weddingInfo,
  isPlayingMusic,
  onToggleMusic,
}) => {
  const { ref: photoRef, isInView: photoInView } = useInView({ threshold: 0.1 });
  const { ref: contentRef, isInView: contentInView } = useInView({ threshold: 0.1 });
  const { ref: guestRef, isInView: guestInView } = useInView({ threshold: 0.1 });

  const coverPhotoUrl = 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=85';

  return (
    <div className="relative w-full min-h-[100dvh] flex flex-col justify-between overflow-hidden bg-[#faf8fc] text-[#300f47] select-none">

      {/* ── ẢNH CHÍNH KHUNG CHỮ NHẬT FULL CHIỀU NGANG TỪ TRÊN CÙNG MỜ DẦN DƯỚI CHÂN ── */}
      <div
        ref={photoRef}
        className={`relative w-full overflow-hidden reveal-init reveal-scale ${photoInView ? 'reveal-active' : ''
          }`}
      >
        <div className="relative w-full h-[380px] sm:h-[450px]">
          <img
            src={coverPhotoUrl}
            alt="Ảnh cưới Cô Dâu & Chú Rể"
            className="w-full h-full object-cover object-[center_25%]"
          />

          {/* Hiệu ứng mờ mờ êm dịu phủ nhẹ trên ảnh */}
          <div className="absolute inset-0 bg-purple-900/10 backdrop-blur-[0.5px] pointer-events-none" />

          {/* Nút nhạc tròn phong cách đĩa than nổi góc trên bên phải ảnh */}
          <div className="absolute top-4 right-4 z-30">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleMusic();
              }}
              aria-label={isPlayingMusic ? 'Tạm dừng nhạc' : 'Phát nhạc đám cưới'}
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center border transition-all duration-300 cursor-pointer shadow-lg backdrop-blur-md ${isPlayingMusic
                  ? 'bg-[#4a1d6d]/80 text-amber-200 border-white/50 shadow-[0_0_15px_rgba(255,255,255,0.4)] animate-spin-slow'
                  : 'bg-black/30 text-white border-white/30 hover:bg-black/50'
                }`}
              title="Bật / Tắt nhạc"
            >
              {isPlayingMusic ? (
                <Volume2 className="w-4 h-4 text-amber-300" />
              ) : (
                <VolumeX className="w-4 h-4 text-white/90" />
              )}
            </button>
          </div>

          {/* Gradient mờ dần dưới chân ảnh chuyển tiếp êm dịu sang nền trắng dưới */}
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#faf8fc] via-[#faf8fc]/85 via-40% to-transparent pointer-events-none" />
        </div>
      </div>

      {/* ── MẢNG TRẮNG CHỨA SAVE THE DATE, TÊN CẶP ĐÔI & KHÁCH MỜI DƯỚI ẢNH ── */}
      <div
        ref={contentRef}
        className={`relative z-10 -mt-10 sm:-mt-12 flex flex-col items-center justify-between px-4 w-full flex-1 pt-1 pb-6 bg-[#faf8fc] space-y-4 reveal-init reveal-up ${contentInView ? 'reveal-active' : ''
          }`}
      >
        {/* SAVE THE DATE & LỄ THÀNH HÔN (ĐÃ DI CHUYỂN XUỐNG DƯỚI ẢNH, BỎ NỀN TÍM) */}
        <div className="text-center space-y-1">
          <h1 className="font-serif text-2xl sm:text-3xl font-light tracking-[0.25em] text-[#3b1554] uppercase drop-shadow-xs">
            LỄ THÀNH HÔN
          </h1>
        </div>

        {/* Tên Cặp Đôi (Hiệu ứng trượt từ 2 bên vô êm dịu chậm 4s) & Ngày Cưới */}
        <div className="text-center w-full max-w-sm mx-auto space-y-1.5 overflow-hidden py-1">
          <div className="flex items-center justify-center gap-3">
            {/* Tên Chú Rể đi từ bên trái vào */}
            <span
              className={`font-calligraphy text-3xl sm:text-4xl text-[#3b1554] font-normal transition-all duration-[4000ms] cubic-bezier(0.2,0.8,0.2,1) inline-block ${
                contentInView
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 -translate-x-16'
              }`}
            >
              {weddingInfo.groomName}
            </span>

            {/* Dấu & ở giữa */}
            <span
              className={`font-serif italic text-lg text-[#8b5eb5] transition-all duration-[3800ms] cubic-bezier(0.2,0.8,0.2,1) delay-150 inline-block ${
                contentInView ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
              }`}
            >
              &
            </span>

            {/* Tên Cô Dâu đi từ bên phải vào */}
            <span
              className={`font-calligraphy text-3xl sm:text-4xl text-[#3b1554] font-normal transition-all duration-[4000ms] cubic-bezier(0.2,0.8,0.2,1) inline-block ${
                contentInView
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 translate-x-16'
              }`}
            >
              {weddingInfo.brideName}
            </span>
          </div>

          <div
            className={`font-serif text-sm sm:text-base font-medium tracking-[0.25em] text-[#541f7a] transition-all duration-[3800ms] cubic-bezier(0.2,0.8,0.2,1) delay-300 ${
              contentInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {weddingInfo.solarDateText}
          </div>
        </div>

        {/* TRÂN TRỌNG KÍNH MỜI CARD DƯỚI ĐÁY */}
        <div
          ref={guestRef}
          className={`w-full max-w-sm mx-auto bg-white text-[#3b1554] rounded-2xl sm:rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-purple-100/70 px-5 py-3.5 text-center reveal-init reveal-up ${guestInView ? 'reveal-active' : ''
            }`}
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-0.5 rounded-full border border-[#9c6ebd] text-[10px] font-medium tracking-[0.2em] text-[#3b1554] uppercase bg-[#f8f2fc]">
            <span>TRÂN TRỌNG KÍNH MỜI</span>
          </div>

          <div className="mt-1 flex items-center justify-center">
            <h2 className="font-calligraphy text-2xl sm:text-[26px] text-[#300f47] tracking-wide">
              {weddingInfo.guestName}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};
