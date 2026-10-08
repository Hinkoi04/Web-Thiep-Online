import React, { useState, useCallback } from 'react';
import { weddingImages } from '../data/weddingData';

export interface WeddingEnvelopeCoverProps {
  guestName?: string;
  onDone: () => void;
  onStartOpen?: () => void;
}

export const WeddingEnvelopeCover: React.FC<WeddingEnvelopeCoverProps> = ({
  guestName,
  onDone,
  onStartOpen,
}) => {
  const [opening, setOpening] = useState(false);

  const handleOpen = useCallback(() => {
    if (opening) return;
    setOpening(true);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
    try {
      if (onStartOpen) onStartOpen();
    } catch (err) {
      console.warn('onStartOpen error:', err);
    }
    // Trắng dần bìa trong 1s (1000ms) rồi mới hiện nội dung bên trong
    setTimeout(() => {
      try {
        onDone();
      } catch (err) {
        console.warn('onDone error:', err);
      }
    }, 1000);
  }, [opening, onStartOpen, onDone]);

  const coverImage = weddingImages.coverPhoto;

  return (
    <div
      className={`th-envelope-scene${opening ? ' opening' : ''}`}
      onClick={handleOpen}
    >
      {/* Lớp phủ trắng dần khi chạm vào mở thiệp */}
      <div className="th-white-washout" />

      <div style={{ width: 'min(340px, 90vw)', position: 'relative', userSelect: 'none', zIndex: 1 }}>
        {/* Cover Card */}
        <div className="th-env-body">
          {/* Cover Photo */}
          <div className="th-env-cover-photo-wrap">
            <img
              src={coverImage}
              alt="Ảnh bìa cưới Thanh Hải & Yến Thoa"
              className="th-env-cover-photo"
            />
            <div className="th-env-cover-overlay" />
          </div>

          <div style={{ position: 'relative', zIndex: 1, padding: '0 24px 28px' }}>
            <div className="th-env-cover-title">Save the Date</div>
            <div className="th-env-cover-year">2026</div>
            <img
              src="/thoahai/Hoa3.png"
              alt="hoa điểm"
              className="w-7 h-auto mx-auto my-1 opacity-85 select-none pointer-events-none drop-shadow-xs"
            />
            <div className="th-env-cover-type">Lễ Thành Hôn</div>
            <div className="th-env-cover-couple">
              Thanh Hải &amp; Yến Thoa
            </div>
            <div className="th-env-cover-date">29 · 10 · 2026</div>

            {guestName && (
              <div className="th-env-guest-box">
                <span className="th-env-guest-label">Kính mời</span>
                <span className="th-env-guest-name">{guestName}</span>
              </div>
            )}
          </div>
        </div>

        {/* Tap hint (đã bỏ dấu mũi tên) */}
        <div
          className="th-tap-hint flex justify-center"
          style={{ textAlign: 'center', marginTop: 20 }}
        >
          <div className="px-5 py-2 rounded-full bg-white/70 backdrop-blur-md border border-[#bda893]/70 shadow-xs tracking-[0.2em] uppercase text-xs font-semibold text-[#1a1a1a]">
            ✦ Chạm để mở thiệp ✦
          </div>
        </div>
      </div>
    </div>
  );
};
