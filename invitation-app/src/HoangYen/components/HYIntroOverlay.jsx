import React, { useState, useEffect, useRef } from "react";
import StarField from "./StarField";

export default function HYIntroOverlay({ onOpen, onStartOpen, confettiRef }) {
  const [opening, setOpening] = useState(false);
  const [cdText, setCdText] = useState("");
  const overlayRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = opening ? "auto" : "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, [opening]);

  useEffect(() => {
    const target = new Date("2026-09-19T15:00:00").getTime();
    const diff = target - Date.now();
    if (diff <= 0) setCdText("Sự kiện đã diễn ra");
    else setCdText(`Còn ${Math.floor(diff / 86400000)} ngày nữa`);

  }, []);

  function handleClick(e) {
    if (opening) return;
    setOpening(true);
    if (navigator.vibrate) navigator.vibrate(50);
    const overlay = overlayRef.current;
    if (overlay) {
      const ripple = document.createElement("div");
      ripple.className = "hy-ripple";
      const rect = overlay.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = e.clientX - rect.left - size / 2 + "px";
      ripple.style.top = e.clientY - rect.top - size / 2 + "px";
      overlay.appendChild(ripple);
      if (confettiRef && confettiRef.current) {
        confettiRef.current.fire(rect.width / 2, rect.height / 2);
      }
    }
    if (onStartOpen) onStartOpen();
    setTimeout(() => { if (onOpen) onOpen(); }, 1600);
  }

  return (
    <div ref={overlayRef} className={`hy-intro-overlay${opening ? " open" : ""}`} onClick={handleClick}>
      <div className="hy-intro-top hy-intro-half">
        <div style={{ position: "absolute", inset: 0, zIndex: 0, opacity: 0.6 }}>
          <StarField />
        </div>
        <div className="hy-cap-title">Graduation</div>
        <div className="hy-cap-sub">2026</div>
      </div>
      <div className="hy-intro-bottom hy-intro-half">
        <div className="hy-intro-school-info">
          <div className="label">Trường Đại học</div>
          <div className="name">Nguyễn Tất Thành</div>
        </div>
        <div className="hy-intro-date-info">
          <div className="day">19/09</div>
          <div className="year">2026</div>
        </div>
      </div>
      <div className="hy-tassel-wrap">
        <div style={{ fontSize: 80, lineHeight: 1 }}>🎓</div>
      </div>
      <div className="hy-click-hint">
        ✦ Chạm để mở thiệp ✦
        <span className="hy-intro-cd">{cdText}</span>
      </div>
    </div>
  );
}
