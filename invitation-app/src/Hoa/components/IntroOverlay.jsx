import React, { useState, useEffect, useRef } from "react";
import StarField from "./StarField";

export default function IntroOverlay({ info, onOpen, onStartOpen, confettiRef }) {
  const [opening, setOpening] = useState(false);
  const [cdText, setCdText] = useState("");
  const overlayRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = opening ? "auto" : "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, [opening]);

  useEffect(() => {
    const target = new Date("2026-06-21T07:30:00").getTime();
    const diff = target - Date.now();
    if (diff <= 0) setCdText("Sự kiện đã diễn ra");
    else setCdText(`Còn ${Math.floor(diff / 86400000)} ngày nữa`);
  }, []);

  function handleClick(e) {
    if (opening) return;
    setOpening(true);

    // Vibrate on mobile
    if (navigator.vibrate) navigator.vibrate(50);

    // Ripple effect
    const overlay = overlayRef.current;
    if (overlay) {
      const ripple = document.createElement("div");
      ripple.className = "nhi-ripple";
      const rect = overlay.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = e.clientX - rect.left - size / 2 + "px";
      ripple.style.top = e.clientY - rect.top - size / 2 + "px";
      overlay.appendChild(ripple);

      // Fire confetti
      if (confettiRef && confettiRef.current) {
        confettiRef.current.fire(rect.width / 2, rect.height / 2);
      }
    }

    if (onStartOpen) onStartOpen();
    setTimeout(() => {
      if (onOpen) onOpen();
    }, 1600);
  }

  return (
    <div
      ref={overlayRef}
      className={`nhi-intro-overlay${opening ? " open" : ""}`}
      onClick={handleClick}
    >
      {/* TOP HALF */}
      <div className="nhi-intro-top nhi-intro-half">
        <div style={{ position: "absolute", inset: 0, zIndex: 0, opacity: 0.6 }}>
          <StarField />
        </div>
        <img
          src={info.intro_image}
          alt=""
          className="nhi-intro-bg-img"
        />
        <div className="nhi-cap-title">Graduation</div>
        <div className="nhi-cap-sub">2026</div>
      </div>

      {/* BOTTOM HALF */}
      <div className="nhi-intro-bottom nhi-intro-half">
        <div className="nhi-intro-school-info">
          <div className="label">Trường Đại học</div>
          <div className="name">Nguyễn Tất Thành</div>
        </div>
        <div className="nhi-intro-date-info">
          <div className="day">21/06</div>
          <div className="year">2026</div>
        </div>
      </div>

      {/* TASSEL */}
      <div className="nhi-tassel-wrap">
        <img
          src={info.tassel_image}
          alt=""
          style={{ width: 100, height: 340, objectFit: "contain", marginTop: 0 }}
        />
      </div>

      {/* CLICK HINT */}
      <div className="nhi-click-hint">
        ✦ Chạm để mở thiệp ✦
        <span className="nhi-intro-cd">{cdText}</span>
      </div>
    </div>
  );
}
