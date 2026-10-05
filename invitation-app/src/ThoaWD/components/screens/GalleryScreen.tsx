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
    <div className="relative w-full min-h-full px-4 sm:px-5 py-8 bg-gradient-to-b from-[#faf7fb] via-[#f7eff7] to-[#faf7fb] text-[#300f47] overflow-hidden">
      <div className="max-w-md mx-auto space-y-5 pt-1">
        {/* Header */}
        <div 
          ref={headerRef}
          className={`text-center space-y-1 reveal-init reveal-up ${headerInView ? 'reveal-active' : ''}`}
        >
          <span className="text-[11px] font-semibold tracking-[0.25em] text-[#7c4a9e] uppercase">
            ALBUM KỶ NIỆM
          </span>
          <h2 className="font-serif text-2xl font-semibold text-[#3b1554] tracking-wide">
            Khoảnh Khắc Ngọt Ngào
          </h2>
          <p className="text-xs text-slate-500 font-sans">
            Từng bức hình lưu giữ trọn vẹn tình yêu của chúng mình
          </p>
          <div className="w-12 h-0.5 bg-[#a87ccb] mx-auto mt-2" />
        </div>

        {/* ── KHUNG ẢNH CHÍNH LỚN THEO MẪU HÌNH (FEATURED PHOTO SLIDER) ── */}
        <div
          ref={sliderRef}
          className={`relative w-full aspect-4/3 sm:aspect-1/1 rounded-3xl overflow-hidden bg-slate-200 shadow-md border border-[#e8dcef] group select-none cursor-pointer reveal-init reveal-scale ${
            sliderInView ? 'reveal-active' : ''
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
            className="absolute top-3.5 right-3.5 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-slate-800 backdrop-blur-xs flex items-center justify-center shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer z-10"
            title="Phóng to ảnh"
          >
            <Maximize2 className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-slate-700" />
          </button>

          {/* Nút lùi ảnh (<) hình tròn trắng bên trái */}
          <button
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-white text-slate-800 backdrop-blur-xs flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer z-10"
            title="Ảnh trước"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-slate-800 -translate-x-0.5" />
          </button>

          {/* Nút tiến ảnh (>) hình tròn trắng bên phải */}
          <button
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-white text-slate-800 backdrop-blur-xs flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer z-10"
            title="Ảnh tiếp theo"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-slate-800 translate-x-0.5" />
          </button>

          {/* Scrim thông tin ảnh & nút thả tim */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4 flex items-end justify-between text-white">
            <div className="space-y-0.5 max-w-[80%]">
              <span className="text-xs font-semibold drop-shadow-sm line-clamp-1">
                {currentPhoto.title}
              </span>
              <p className="text-[11px] text-slate-200 drop-shadow-xs line-clamp-1">
                {currentPhoto.caption}
              </p>
            </div>

            <button
              onClick={(e) => handleLike(currentPhoto.id, e)}
              className="p-1.5 px-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-xs flex items-center gap-1.5 text-xs transition-transform active:scale-90 cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span className="font-semibold text-[11px]">{photoLikes[currentPhoto.id] || 0}</span>
            </button>
          </div>
        </div>

        {/* ── DẢI THUMBNAIL ẢNH NHỎ BÊN DƯỚI THEO MẪU HÌNH ── */}
        <div 
          ref={thumbRef}
          className={`flex items-center gap-2 sm:gap-2.5 overflow-x-auto py-1 px-0.5 no-scrollbar scroll-smooth reveal-init reveal-up ${
            thumbInView ? 'reveal-active' : ''
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
                    ? 'border-[#4a1d6d] ring-2 ring-[#8b5eb5]/50 scale-105 shadow-md'
                    : 'border-white/80 opacity-70 hover:opacity-100 hover:border-purple-300'
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
              <h3 className="font-serif text-lg font-medium">{currentPhoto.title}</h3>
              <p className="text-xs text-slate-300">{currentPhoto.caption}</p>
              <span className="text-[11px] text-purple-300 font-sans block">
                {activeIndex + 1} / {galleryPhotos.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
