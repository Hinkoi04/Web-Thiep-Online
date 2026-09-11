import React from "react";

export default function Lightbox({ src, onClose }) {
  if (!src) return null;
  return (
    <div className={`hy-lightbox${src ? " active" : ""}`} onClick={onClose}>
      <button className="hy-lightbox-close" onClick={onClose}>×</button>
      <img src={src} alt="Phóng to" />
    </div>
  );
}
