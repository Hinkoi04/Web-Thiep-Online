import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { galleryPhotos } from '../../data/weddingData';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { useInView } from '../../hooks/useInView';

export const GalleryScreen: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  const { ref: headerRef, isInView: headerInView } = useInView({ threshold: 0.15 });
  const { ref: sliderRef, isInView: sliderInView } = useInView({ threshold: 0.15 });
  const { ref: thumbRef, isInView: thumbInView } = useInView({ threshold: 0.15 });

  const touchStartX = useRef<number | null>(null);
  const currentPhoto = galleryPhotos[activeIndex] || galleryPhotos[0];

  // Khóa cuộn trang khi mở lightbox để không bị dính thanh cuộn
  useEffect(() => {
    if (isLightboxOpen) {
      const originalOverflow = document.body.style.overflow;
      const originalOverscroll = document.body.style.overscrollBehavior;
      document.body.style.overflow = 'hidden';
      document.body.style.overscrollBehavior = 'none';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsLightboxOpen(false);
        else if (e.key === 'ArrowRight') handleNext();
        else if (e.key === 'ArrowLeft') handlePrev();
      };
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.overscrollBehavior = originalOverscroll;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isLightboxOpen]);

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveIndex((prev) => (prev < galleryPhotos.length - 1 ? prev + 1 : 0));
  };

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : galleryPhotos.length - 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 40) {
      handleNext();
    } else if (diff < -40) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  return (
    <div className="relative w-full min-h-full px-4 sm:px-5 py-9 bg-[#faf5ee] text-[#3d2c1e] select-none overflow-hidden">
      <div className="max-w-md mx-auto space-y-5 pt-1">
        {/* Header */}
        <div
          ref={headerRef}
          className={`text-center space-y-1 th-reveal-init th-reveal-up ${headerInView ? 'th-reveal-active' : ''}`}
        >
          {/* Điểm hoa Hoa7 */}
          <img
            src="/thoahai/Hoa8.png"
            alt="hoa điểm"
            className="w-20 h-auto mx-auto mb-1 opacity-85 drop-shadow-xs pointer-events-none select-none"
          />

          <span className="text-[11px] font-semibold tracking-[0.25em] text-[#4a4039] uppercase block">
            ALBUM KỶ NIỆM
          </span>
          <h2
            className="text-2xl sm:text-3xl font-semibold tracking-wide"
            style={{ color: '#1a1a1a', fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Khoảnh Khắc Ngọt Ngào
          </h2>
          <p className="text-xs text-[#6d5a49] font-sans">
            Từng bức hình lưu giữ trọn vẹn tình yêu của chúng mình
          </p>
          <div className="w-12 h-0.5 bg-[#1a1a1a]/20 mx-auto mt-2" />
        </div>

        {/* ── KHUNG ẢNH CHÍNH LỚN VỚI CHIỀU CAO FULL ẢNH DỌC (TỶ LỆ 3:4) ── */}
        <div
          ref={sliderRef}
          className={`relative w-full aspect-3/4 sm:aspect-3/4 max-h-[580px] rounded-3xl overflow-hidden bg-[#f0e8dc] shadow-md border border-[#d8c7b3] group select-none cursor-pointer th-reveal-init th-reveal-scale ${sliderInView ? 'th-reveal-active' : ''
            }`}
          style={{ aspectRatio: '3/4' }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onClick={() => setIsLightboxOpen(true)}
        >
          <img
            key={currentPhoto.id}
            src={currentPhoto.url}
            alt={currentPhoto.title}
            className="w-full h-full object-cover object-center transition-all duration-300 animate-in fade-in"
            loading="eager"
            referrerPolicy="no-referrer"
          />

          {/* Nút phóng to / Fullscreen ở góc trên bên phải */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsLightboxOpen(true);
            }}
            className="absolute top-3.5 right-3.5 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#faf5ee]/90 hover:bg-[#faf5ee] text-[#1a1a1a] backdrop-blur-xs flex items-center justify-center shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer z-10"
            title="Phóng to ảnh"
          >
            <Maximize2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </button>

          {/* Nút lùi ảnh (<) hình tròn bên trái */}
          <button
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#faf5ee]/90 hover:bg-[#faf5ee] text-[#1a1a1a] backdrop-blur-xs flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer z-10"
            title="Ảnh trước"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 -translate-x-0.5" />
          </button>

          {/* Nút tiến ảnh (>) hình tròn bên phải */}
          <button
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#faf5ee]/90 hover:bg-[#faf5ee] text-[#1a1a1a] backdrop-blur-xs flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer z-10"
            title="Ảnh tiếp theo"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 translate-x-0.5" />
          </button>
        </div>

        {/* ── DẢI THUMBNAIL ẢNH NHỎ BÊN DƯỚI ── */}
        <div
          ref={thumbRef}
          className={`flex items-center gap-2 sm:gap-2.5 overflow-x-auto py-1 px-0.5 th-no-scrollbar scroll-smooth th-reveal-init th-reveal-up ${thumbInView ? 'th-reveal-active' : ''
            }`}
        >
          {galleryPhotos.map((photo, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={photo.id}
                onClick={() => setActiveIndex(idx)}
                className={`relative shrink-0 w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${isActive
                  ? 'border-[#1a1a1a] ring-2 ring-[#1a1a1a]/30 scale-105 shadow-md'
                  : 'border-[#d8c7b3]/70 opacity-70 hover:opacity-100 hover:border-[#1a1a1a]/60'
                  }`}
              >
                <img
                  src={photo.url}
                  alt={photo.title || `Ảnh cưới ${idx + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* ── LIGHTBOX MODAL PHÓNG TO ẢNH FULLSCREEN (RENDER BẰNG PORTAL TRÁNH BỊ DÍNH THANH CUỘN) ── */}
      {isLightboxOpen && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-3 sm:p-6 select-none overflow-hidden touch-none"
          style={{ zIndex: 99999 }}
          onClick={() => setIsLightboxOpen(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Nút đóng */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 p-2.5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer z-20"
            title="Đóng (Esc)"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Controls */}
          <button
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 text-white hover:bg-white/35 transition-colors cursor-pointer z-20"
            title="Ảnh trước (←)"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 text-white hover:bg-white/35 transition-colors cursor-pointer z-20"
            title="Ảnh tiếp theo (→)"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Large Photo Display - Hiển thị full 100% không dính thanh cuộn */}
          <div
            className="relative flex flex-col items-center justify-center max-w-full max-h-[92vh] select-none"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentPhoto.url}
              alt={currentPhoto.title || `Ảnh cưới ${activeIndex + 1}`}
              className="max-h-[82vh] max-w-[92vw] sm:max-h-[86vh] sm:max-w-[85vw] w-auto h-auto object-contain rounded-2xl shadow-2xl"
              referrerPolicy="no-referrer"
            />
            <div className="text-center mt-3 text-white">
              {currentPhoto.title && (
                <p className="text-sm font-medium text-white/95">{currentPhoto.title}</p>
              )}
              <span className="text-xs text-white/70 font-sans block mt-0.5">
                {activeIndex + 1} / {galleryPhotos.length}
              </span>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
