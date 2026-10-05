import React, { useState, useCallback } from 'react';
import { ChevronUp } from 'lucide-react';

export type CoverPhase = 'idle' | 'fading' | 'exiting';

export interface WeddingEnvelopeCoverProps {
  guestName: string;
  onDone: () => void;
}

const COVER_IMAGE_URL = 'https://res.cloudinary.com/dlxbhq8pw/image/upload/v1791131939/%E1%BA%A2nh_b%C3%ACa_Thoa_ajr7tc.png';

export const WeddingEnvelopeCover: React.FC<WeddingEnvelopeCoverProps> = ({
  guestName,
  onDone,
}) => {
  const [phase, setPhase] = useState<CoverPhase>('idle');

  const handleTap = useCallback(() => {
    if (phase !== 'idle') return;
    setPhase('fading');
    setTimeout(() => {
      setPhase('exiting');
      onDone();
    }, 2500);
  }, [phase, onDone]);

  return (
    <div
      onClick={handleTap}
      className={`fixed inset-0 z-[200] flex items-center justify-center cursor-pointer select-none overflow-hidden touch-none transition-all duration-[2500ms] ease-in-out ${phase !== 'idle'
          ? 'opacity-0 pointer-events-none scale-105 blur-[4px]'
          : 'opacity-100 scale-100 blur-0'
        }`}
      style={{
        backgroundColor: '#1b1226',
        touchAction: 'none',
      }}
    >
      {/* ── HIỆU ỨNG ÁNH SÁNG AMBIENT XUNG QUANH ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[520px] h-[520px] bg-purple-500/20 blur-[130px] rounded-full animate-pulse" />
        <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[480px] h-[480px] bg-pink-500/15 blur-[130px] rounded-full" />
      </div>

      {/* ── KHUNG THIỆP BÌA CHÍNH (CHIA 70% ẢNH VÀ 30% THÔNG TIN) ── */}
      <div className="relative w-full max-w-[450px] h-[100dvh] max-h-[920px] flex flex-col p-2.5 sm:p-3.5 box-border overflow-hidden z-10">

        {/* Vỏ thiệp bo góc có viền vàng gold sang trọng */}
        <div className="relative w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_16px_50px_rgba(0,0,0,0.45)] border border-[#c8a452]/40 bg-[#f7f1fb] flex flex-col">

          {/* ── PHẦN 1: ẢNH BÌA CHIẾM 70% CHIỀU CAO (VỚI HIỆU ỨNG MỜ DẦN / RÕ DẦN Ở ĐÁY) ── */}
          <div className="relative w-full h-[70%] overflow-hidden">
            {/* Ảnh gốc */}
            <img
              src={COVER_IMAGE_URL}
              alt="Bìa thư cưới"
              className="w-full h-full object-cover object-top pointer-events-none select-none"
            />

            {/* Gradient chuyển tiếp mờ dần - rõ dần cực êm giữa ảnh và nền dưới */}
            <div
              className="absolute inset-x-0 bottom-0 h-32 sm:h-36 bg-gradient-to-b from-transparent via-[#f7f1fb]/75 via-40% to-[#f7f1fb] pointer-events-none z-10"
            />
          </div>

          {/* ── PHẦN 2: 30% CHIỀU CAO CÒN LẠI CHỨA THIỆP MỜI & NÚT MỞ THIỆP ── */}
          <div className="relative w-full h-[30%] bg-gradient-to-b from-[#f7f1fb] to-[#ede3f5] flex flex-col items-center justify-between px-4 pt-1 pb-4 sm:pb-5 z-20">

            {/* Hộp Trân Trọng Kính Mời */}
            <div className="w-full max-w-[290px] px-5 py-2 rounded-2xl bg-white/90 backdrop-blur-md border border-[#c8a452]/50 shadow-[0_4px_16px_rgba(107,33,168,0.08)] text-center transition-transform group-hover:scale-[1.02]">
              <div className="flex items-center justify-center gap-2 mb-0.5">
                <span className="w-5 h-[1px] bg-gradient-to-r from-transparent to-[#c8a452]" />
                <span className="text-[9.5px] text-[#8e6b28] uppercase tracking-[0.22em] font-semibold">
                  TRÂN TRỌNG KÍNH MỜI
                </span>
                <span className="w-5 h-[1px] bg-gradient-to-l from-transparent to-[#c8a452]" />
              </div>

              <span className="font-calligraphy text-2xl sm:text-[27px] text-[#300f47] font-normal block leading-tight mt-0.5">
                {guestName}
              </span>
            </div>

            {/* Nút Chạm để mở thiệp */}
            <div className="animate-soft-float flex flex-col items-center gap-1 group mt-auto">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-[#8b5eb5]/30 animate-ping" style={{ animationDuration: '2s' }} />
                <div className="relative w-10 h-10 rounded-full bg-gradient-to-b from-[#9e71c6] to-[#713c96] text-white flex items-center justify-center shadow-[0_4px_12px_rgba(113,60,150,0.4)] border border-white/50 group-hover:scale-110 transition-transform">
                  <ChevronUp className="w-5 h-5 animate-bounce" />
                </div>
              </div>
              <span className="font-serif text-[11px] sm:text-xs tracking-[0.25em] text-[#42195f] uppercase font-bold mt-0.5">
                Chạm Để Mở Thiệp
              </span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
