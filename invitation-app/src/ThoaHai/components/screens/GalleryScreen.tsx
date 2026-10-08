import React, { useState, useRef } from 'react';
import { galleryPhotos } from '../../data/weddingData';
import { X, ChevronLeft, ChevronRight, Maximize2, Heart } from 'lucide-react';
import { useInView } from '../../hooks/useInView';

export const GalleryScreen: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [photoLikes, setPhotoLikes] = useState<{ [id: string]: number }>({
    g1: 42,
    g2: 38,
    g3: 29,
    g4: 51,
    g5: 45,
    g6: 33,
  });

  const { ref: headerRef, isInView: headerInView } = useInView({ threshold: 0.15 });
  const { ref: sliderRef, isInView: sliderInView } = useInView({ threshold: 0.15 });
  const { ref: thumbRef, isInView: thumbInView } = useInView({ threshold: 0.15 });

  const touchStartX = useRef<number | null>(null);
  const currentPhoto = galleryPhotos[activeIndex] || galleryPhotos[0];

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

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoLikes((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
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
            src="/thoahai/Hoa7.png"
            alt="hoa điểm"
            className="w-10 h-auto mx-auto mb-1 opacity-85 drop-shadow-xs pointer-events-none select-none"
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

        {/* ── KHUNG ẢNH CHÍNH LỚN THEO MẪU THOAWD (FEATURED PHOTO SLIDER) ── */}
        <div
          ref={sliderRef}
          className={`relative w-full aspect-4/3 sm:aspect-1/1 rounded-3xl overflow-hidden bg-[#f0e8dc] shadow-md border border-[#d8c7b3] group select-none cursor-pointer th-reveal-init th-reveal-scale ${
            sliderInView ? 'th-reveal-active' : ''
          }`}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onClick={() => setIsLightboxOpen(true)}
        >
          <img
            key={currentPhoto.id}
            src={currentPhoto.url}
            alt={currentPhoto.title}
            className="w-full h-full object-cover transition-all duration-300 animate-in fade-in"
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

          {/* Scrim thông tin ảnh & nút thả tim */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent p-4 flex items-end justify-between text-white">
            <div className="space-y-0.5 max-w-[80%]">
              <span className="text-xs font-semibold drop-shadow-sm line-clamp-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                {currentPhoto.title}
              </span>
              <p className="text-[11px] text-white/90 drop-shadow-xs line-clamp-1">
                {currentPhoto.caption}
              </p>
            </div>

            <button
              onClick={(e) => handleLike(currentPhoto.id, e)}
              className="p-1.5 px-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-xs flex items-center gap-1.5 text-xs transition-transform active:scale-90 cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 fill-[#e8a4a5] text-[#e8a4a5]" />
              <span className="font-semibold text-[11px]">{photoLikes[currentPhoto.id] || 0}</span>
            </button>
          </div>
        </div>

        {/* ── DẢI THUMBNAIL ẢNH NHỎ BÊN DƯỚI ── */}
        <div 
          ref={thumbRef}
          className={`flex items-center gap-2 sm:gap-2.5 overflow-x-auto py-1 px-0.5 th-no-scrollbar scroll-smooth th-reveal-init th-reveal-up ${
            thumbInView ? 'th-reveal-active' : ''
          }`}
        >
          {galleryPhotos.map((photo, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={photo.id}
                onClick={() => setActiveIndex(idx)}
                className={`relative shrink-0 w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                  isActive
                    ? 'border-[#1a1a1a] ring-2 ring-[#1a1a1a]/30 scale-105 shadow-md'
                    : 'border-[#d8c7b3]/70 opacity-70 hover:opacity-100 hover:border-[#1a1a1a]/60'
                }`}
              >
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* ── LIGHTBOX MODAL PHÓNG TO ẢNH FULLSCREEN ── */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Nút đóng */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 p-2.5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer z-20"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Controls */}
          <button
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 text-white hover:bg-white/35 transition-colors cursor-pointer z-20"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 text-white hover:bg-white/35 transition-colors cursor-pointer z-20"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Large Photo Display */}
          <div
            className="max-w-xl w-full max-h-[82vh] flex flex-col items-center select-none"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentPhoto.url}
              alt={currentPhoto.title}
              className="max-h-[70vh] w-auto object-contain rounded-2xl shadow-2xl"
              referrerPolicy="no-referrer"
            />
            <div className="text-center mt-3 text-white space-y-1">
              <h3 className="font-serif text-lg font-medium" style={{ fontFamily: "'Playfair Display', serif" }}>
                {currentPhoto.title}
              </h3>
              <p className="text-xs text-slate-300">{currentPhoto.caption}</p>
              <span className="text-[11px] text-[#e1cbb4] font-sans block">
                {activeIndex + 1} / {galleryPhotos.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
