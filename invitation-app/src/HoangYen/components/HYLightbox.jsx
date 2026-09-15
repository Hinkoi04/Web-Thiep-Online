import React, { useEffect } from "react";
import { createPortal } from "react-dom";

export default function HYLightbox({ src, onClose }) {
  useEffect(() => {
    if (!src) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [src, onClose]);

  if (!src) return null;

  return createPortal(
    <div className={`hy-lightbox${src ? " active" : ""}`} onClick={onClose}>
      <button
        className="hy-lightbox-close"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Đóng"
      >
        ×
      </button>
      <div className="hy-lightbox-content" onClick={(e) => e.stopPropagation()}>
        <img
          src={src}
          alt="Phóng to ảnh tốt nghiệp"
        />
      </div>
    </div>,
    document.body
  );
}
