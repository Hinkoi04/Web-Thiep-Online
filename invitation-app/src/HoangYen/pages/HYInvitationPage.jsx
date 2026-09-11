import React, { useState, useEffect, useRef, useCallback } from "react";
import HYIntroOverlay from "../components/HYIntroOverlay";
import HYReveal from "../components/HYReveal";
import HYDivider from "../components/HYDivider";
import HYMusicButton from "../components/HYMusicButton";
import HYParticlesCanvas from "../components/HYParticlesCanvas";
import HYConfettiCanvas from "../components/HYConfettiCanvas";
import HYBokehEffect from "../components/HYBokehEffect";
import HYLightbox from "../components/HYLightbox";
import { pad, useCountdown, buildCalendar } from "../utils";
import "../HoangYenStyles.css";

/* ====================================================
   HARDCODED DATA — Hoàng Yến Graduation
   ==================================================== */
const HY_INFO = {
  grad_name: "Hoàng Yến",
  event_date: "2026-09-19",
  event_time: "15:00",
  location_name: "Trường Đại học Nguyễn Tất Thành",
  address: "Cơ sở Q.12 — 331A-331B Đỗ Mười, An Phú Đông 10, An Phú Đồng",
  lat: 10.859858712011244,
  lng: 106.69462064035187,
  quote:
    "Đây là ngày mình muốn lưu lại những khoảnh khắc đẹp đẽ của thời sinh viên. Hy vọng những khoảnh khắc lưu lại cột mốc thời sinh viên này sẽ có sự tham gia của bạn.",
  photo_1:
    "https://images.unsplash.com/photo-1627556592933-ffe99c1cd9eb?w=280&h=360&fit=crop&auto=format",
  photo_2:
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=280&h=360&fit=crop&auto=format",
  photo_3:
    "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=280&h=360&fit=crop&auto=format",
  intro_text:
    "Sau những năm nỗ lực không ngừng nghỉ, Hoàng Yến đã sẵn sàng để chạm tay vào chiếc mũ cử nhân. Buổi lễ tốt nghiệp này sẽ kém phần trọn vẹn nếu thiếu đi sự hiện diện của những người đã luôn bên cạnh động viên và ủng hộ. Thân mời bạn / anh / chị / gia đình đến tham dự để cùng lưu giữ những khung hình đẹp nhất của dấu mốc quan trọng này. 🎓✨",
  album_1:
    "https://images.unsplash.com/photo-1546961342-ea5f62d5a27b?w=400&h=530&fit=crop&auto=format",
  album_2:
    "https://images.unsplash.com/photo-1627556592933-ffe99c1cd9eb?w=400&h=530&fit=crop&auto=format",
  album_3:
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=530&fit=crop&auto=format",
  album_4:
    "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=530&fit=crop&auto=format",
  rsvp_text:
    "Sự hiện diện của bạn / anh / chị / gia đình là niềm vinh hạnh cho buổi lễ tốt nghiệp của Hoàng Yến. Dẫu khoảng cách địa lý hay công việc có ngăn chúng ta gặp gỡ, nhưng niềm vui ngày tốt nghiệp sẽ thêm trọn vẹn hơn nếu như mình nhận thêm lời chúc từ bạn. ❤️",
  contact_1_name: "Hoàng Yến",
  contact_1_phone: "0xx xxxx xxx",
  contact_2_name: "Nhàn",
  contact_2_phone: "0xx xxxx xxx",
  hero_image:
    "https://images.unsplash.com/photo-1627556592933-ffe99c1cd9eb?w=430&h=932&fit=crop&auto=format",
  music: "/music/nhac.mp3",
};

const HY_TIMELINE = [
  { id: 1, order_num: 1, time_str: "15:00", description: "Bắt đầu Lễ Trao Bằng Tốt Nghiệp" },
  { id: 2, order_num: 2, time_str: "15:00 – 16:30", description: "Đón khách, Chụp ảnh lưu niệm & Chung vui" },
];

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export default function HYInvitationPage() {
  const info = HY_INFO;
  const timeline = HY_TIMELINE;

  const [introVisible, setIntroVisible] = useState(true);
  const [mainVisible, setMainVisible] = useState(false);
  const [particlesActive, setParticlesActive] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState(null);
  const [scrollPct, setScrollPct] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollArrowHidden, setScrollArrowHidden] = useState(false);
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpMsg, setRsvpMsg] = useState("");
  const [toastMsg, setToastMsg] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [rsvpList, setRsvpList] = useState([]);

  const heroBgRef = useRef(null);
  const heroContentRef = useRef(null);
  const musicRef = useRef(null);
  const confettiRef = useRef(null);
  const autoScrollRef = useRef(null);

  const [guestName] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("to") || "";
  });

  useEffect(() => {
    if (guestName && !rsvpName) setRsvpName(guestName);
  }, [guestName]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch RSVP messages from backend
  useEffect(() => {
    fetch(`${API_URL}/rsvp?slug=hoangyen`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) setRsvpList(data.data);
      })
      .catch(() => { });
  }, []);

  const cd = useCountdown(info.event_date, info.event_time);
  const cal = buildCalendar(info.event_date);
  const d = new Date(info.event_date);

  /* ---- AUTO SCROLL ---- */
  const stopAutoScroll = useCallback(() => {
    if (autoScrollRef.current) {
      cancelAnimationFrame(autoScrollRef.current);
      autoScrollRef.current = null;
    }
    document.documentElement.style.scrollBehavior = "smooth";
  }, []);

  const startAutoScroll = useCallback(() => {
    document.documentElement.style.scrollBehavior = "auto";
    let currentY = window.scrollY;
    function step() {
      currentY += 1.5;
      window.scrollTo(0, currentY);
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (window.scrollY < maxScroll - 5) {
        autoScrollRef.current = requestAnimationFrame(step);
      } else {
        stopAutoScroll();
      }
    }
    autoScrollRef.current = requestAnimationFrame(step);
  }, [stopAutoScroll]);

  useEffect(() => {
    const handler = () => stopAutoScroll();
    ["wheel", "touchmove", "mousedown"].forEach((e) =>
      window.addEventListener(e, handler, { passive: true })
    );
    return () => {
      stopAutoScroll();
      ["wheel", "touchmove", "mousedown"].forEach((e) =>
        window.removeEventListener(e, handler)
      );
    };
  }, [stopAutoScroll]);

  const handleStartOpen = useCallback(() => {
    setMainVisible(true);
    if (musicRef.current) musicRef.current.play();
  }, []);

  const handleOpen = useCallback(() => {
    setIntroVisible(false);
    setParticlesActive(true);
    setTimeout(startAutoScroll, 1000);
  }, [startAutoScroll]);

  useEffect(() => {
    if (!mainVisible) return;
    function onScroll() {
      const scrollTop = window.scrollY;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(docH > 0 ? (scrollTop / docH) * 100 : 0);
      setShowScrollTop(scrollTop > docH * 0.25);
      setScrollArrowHidden(scrollTop > 100);
      if (scrollTop < window.innerHeight) {
        if (heroBgRef.current) heroBgRef.current.style.transform = `translateY(${scrollTop * 0.3}px)`;
        if (heroContentRef.current) heroContentRef.current.style.transform = `translateY(${scrollTop * 0.6}px)`;
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [mainVisible]);

  async function submitRsvp(e) {
    e.preventDefault();
    if (!rsvpName.trim() || !rsvpMsg.trim()) {
      showToast("⚠️ Vui lòng nhập đầy đủ tên và lời chúc!");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guest_name: rsvpName.trim(), message: rsvpMsg.trim(), slug: "hoangyen" }),
      });
      const data = await res.json();
      if (data.success) {
        setRsvpList((prev) => [data.data, ...prev]);
        showToast(`✨ Cảm ơn ${rsvpName.trim()} đã gửi lời chúc! 🎓`);
        setRsvpName(guestName || "");
        setRsvpMsg("");
      } else {
        showToast(`❌ ${data.error || "Lỗi gửi lời chúc"}`);
      }
    } catch {
      const newMsg = { id: Date.now(), guest_name: rsvpName.trim(), message: rsvpMsg.trim(), slug: "hoangyen" };
      setRsvpList((prev) => [newMsg, ...prev]);
      showToast(`✨ Cảm ơn ${rsvpName.trim()} đã gửi lời chúc! 🎓`);
      setRsvpName(guestName || "");
      setRsvpMsg("");
    }
  }

  function showToast(msg) {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 4000);
  }

  return (
    <div className="hy-wrapper">
      {/* Toast */}
      <div className={`hy-toast${toastVisible ? " show" : ""}`}>{toastMsg}</div>

      {/* Music Button */}
      <HYMusicButton ref={musicRef} src={info.music} />

      {/* Particles */}
      <HYParticlesCanvas active={particlesActive} />

      {/* Confetti */}
      <HYConfettiCanvas ref={confettiRef} />

      {/* Intro Overlay */}
      {introVisible && (
        <HYIntroOverlay
          onStartOpen={handleStartOpen}
          onOpen={handleOpen}
          confettiRef={confettiRef}
        />
      )}

      {/* Scroll Progress */}
      <div className="hy-scroll-progress">
        <div className="hy-scroll-progress-bar" style={{ width: `${scrollPct}%` }} />
      </div>

      {/* ============ MAIN CONTENT ============ */}
      <div
        id="main-content"
        style={{ opacity: mainVisible ? 1 : 0, transition: "opacity 1.5s ease" }}
      >
        {/* ---- HERO ---- */}
        <div className="hy-hero">
          <div className="hy-hero-bg-layer" ref={heroBgRef}>
            <img src={info.hero_image} alt="" />
          </div>
          <HYBokehEffect />
          <div className="hy-hero-content" ref={heroContentRef}>
            <div className="hy-hero-badge">Lễ Tốt Nghiệp · 2026</div>
            <h1 style={{ color: "#fff" }}>{info.grad_name}</h1>
            <div className="hy-hero-line" />
            <div className="hy-hero-date">19 · 09 · 2026</div>
            {guestName && (
              <div className={`hy-invite-box${mainVisible ? " anim" : ""}`}>
                <p className="hy-invite-label">Kính mời</p>
                <p className="hy-invite-name">{guestName}</p>
              </div>
            )}
          </div>
          <div className={`hy-scroll-indicator${scrollArrowHidden ? " hidden" : ""}`}>↓</div>
        </div>

        {/* ---- QUOTE ---- */}
        <div className="hy-section">
          <HYReveal>
            <div className="hy-quote-box">
              <span className="hy-quote-mark open">"</span>
              {info.quote}
              <span className="hy-quote-mark close">"</span>
            </div>
          </HYReveal>
        </div>

        <HYReveal><HYDivider /></HYReveal>

        {/* ---- GRAD INFO + PHOTOS ---- */}
        <div className="hy-section" style={{ paddingTop: 30 }}>
          <HYReveal>
            <div className="hy-title-sm">Tân Cử Nhân</div>
            <div className="hy-title-script-lg">{info.grad_name}</div>
          </HYReveal>
          <HYReveal delay={100}>
            <div className="hy-photo-row">
              {[info.photo_1, info.photo_2, info.photo_3].map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`Ảnh ${i + 1}`}
                  loading="lazy"
                  onClick={() => setLightboxSrc(src)}
                />
              ))}
            </div>
          </HYReveal>
          <HYReveal delay={200}>
            <p className="hy-text-desc">{info.intro_text}</p>
          </HYReveal>
        </div>

        <HYReveal><HYDivider /></HYReveal>

        {/* ---- GOLD BAND (INVITE) ---- */}
        <div className="hy-gold-band">
          <HYReveal>
            {guestName ? (
              <>
                <div className="hy-title-sm" style={{ color: "var(--gold-light)" }}>Thân mời</div>
                <div style={{ fontFamily: "var(--script)", fontSize: "clamp(2.2rem,8vw,3.2rem)", color: "var(--gold-light)", lineHeight: 1.2, margin: "10px 0", whiteSpace: "nowrap" }}>
                  {guestName}
                </div>
                <div className="hy-title-sm" style={{ color: "var(--gold-light)" }}>Đến dự lễ tốt nghiệp</div>
              </>
            ) : (
              <>
                <div className="hy-title-sm" style={{ color: "var(--gold-light)" }}>Thân mời</div>
                <div className="hy-title-script" style={{ color: "var(--gold-light)" }}>Bạn bè &amp; Gia đình</div>
                <div className="hy-title-sm" style={{ color: "var(--gold-light)" }}>Đến dự lễ tốt nghiệp</div>
              </>
            )}
          </HYReveal>
        </div>

        {/* ---- CALENDAR ---- */}
        <div className="hy-cal-wrap">
          <HYReveal>
            <div className="hy-title-sm">Thời Gian</div>
            <div className="hy-title-script">{cal.monthLabel} · {cal.year}</div>
          </HYReveal>
          <HYReveal delay={100}>
            <table className="hy-cal-table">
              <thead>
                <tr>{cal.weekdays.map((w) => <th key={w}>{w}</th>)}</tr>
              </thead>
              <tbody>
                {cal.rows.map((row, ri) => (
                  <tr key={ri}>
                    {row.map((day, ci) => (
                      <td key={ci} className={day === null ? "empty" : ""}>
                        {day === cal.eventDay ? (
                          <span className="hy-day-active">{day}</span>
                        ) : (day ?? "")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </HYReveal>

          {/* Date block */}
          <HYReveal delay={150}>
            <div className="hy-date-block">
              <div className="hy-d-item">
                <span>Tháng</span>
                <strong>{String(d.getMonth() + 1).padStart(2, "0")}</strong>
              </div>
              <div className="hy-date-dot" />
              <div className="hy-d-item main">
                <span>{cal.dayOfWeekLabel}</span>
                <strong>{d.getDate()}</strong>
              </div>
              <div className="hy-date-dot" />
              <div className="hy-d-item">
                <span>Năm</span>
                <strong>{d.getFullYear()}</strong>
              </div>
            </div>
          </HYReveal>

          {/* Location */}
          <HYReveal delay={200}>
            <div className="hy-location-card">
              <div className="hy-loc-name">{info.location_name}</div>
              <div className="hy-loc-addr">📍{info.address}</div>
              <div className="hy-map-container">
                <iframe
                  title="map"
                  width="100%"
                  height="180"
                  frameBorder={0}
                  scrolling="no"
                  loading="lazy"
                  src={`https://maps.google.com/maps?q=${info.lat},${info.lng}&hl=vi&z=15&output=embed`}
                />
              </div>
            </div>
          </HYReveal>

          <HYReveal delay={250}>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${info.lat},${info.lng}`}
              target="_blank"
              rel="noreferrer"
              className="hy-btn"
            >
              ✦ Chỉ Đường
            </a>
          </HYReveal>

          {/* Contact */}
          <HYReveal delay={300}>
            <div style={{ marginTop: 28 }}>
              <div className="hy-title-script">Liên hệ</div>
              <div className="hy-contact-text">{info.contact_1_name}: {info.contact_1_phone}</div>
              <div className="hy-contact-text">{info.contact_2_name}: {info.contact_2_phone}</div>
            </div>
          </HYReveal>
        </div>

        {/* ---- TIMELINE ---- */}
        <div className="hy-section" style={{ background: "#fff" }}>
          <HYReveal>
            <div className="hy-title-sm">Chương Trình</div>
            <div className="hy-title-script">Sự Kiện</div>
          </HYReveal>
          <div className="hy-timeline">
            {[...timeline].sort((a, b) => a.order_num - b.order_num).map((item, i) => (
              <HYReveal key={item.id} delay={i * 150}>
                <div className="hy-t-item">
                  <div className="hy-t-time">{item.time_str}</div>
                  <div className="hy-t-desc">{item.description}</div>
                </div>
              </HYReveal>
            ))}
          </div>
        </div>

        {/* ---- ALBUM ---- */}
        <div className="hy-section" style={{ paddingBottom: 20 }}>
          <HYReveal>
            <div className="hy-title-sm">Kỷ Niệm</div>
            <div className="hy-title-script">Album Tốt Nghiệp</div>
          </HYReveal>
        </div>
        <HYReveal>
          <div className="hy-album-grid">
            {[info.album_1, info.album_2, info.album_3, info.album_4].map((src, i) => (
              <div key={i} className="hy-album-item" onClick={() => setLightboxSrc(src)}>
                <img src={src} alt={`Album ${i + 1}`} loading="lazy" />
              </div>
            ))}
          </div>
        </HYReveal>

        {/* ---- RSVP ---- */}
        <div className="hy-rsvp-wrap" id="rsvp">
          <HYReveal>
            <div className="hy-title-sm">Gửi Lời Yêu Thương</div>
            <div className="hy-title-script">Sổ Lưu Bút</div>
            <p className="hy-text-desc" style={{ textAlign: "center", marginBottom: 28 }}>
              {info.rsvp_text}
            </p>
          </HYReveal>
          <HYReveal delay={100}>
            <form onSubmit={submitRsvp} style={{ marginTop: 24 }}>
              <input
                type="text"
                className="hy-form-control"
                placeholder="Tên của bạn"
                value={rsvpName}
                onChange={(e) => setRsvpName(e.target.value)}
                required
              />
              <textarea
                className="hy-form-control"
                placeholder="Gửi lời chúc mừng đến Hoàng Yến..."
                value={rsvpMsg}
                onChange={(e) => setRsvpMsg(e.target.value)}
                required
              />
              <button type="submit" className="hy-btn-submit">
                Gửi Lời Nhắn ✦
              </button>
            </form>
          </HYReveal>

          {rsvpList.length > 0 && (
            <div style={{ marginTop: 28 }}>
              {rsvpList.map((m, i) => (
                <HYReveal key={m.id || i} delay={i * 60}>
                  <div className="hy-rsvp-message">
                    <div className="hy-rsvp-message-inner">
                      <div className="hy-rsvp-message-name">{m.guest_name}</div>
                      <div className="hy-rsvp-message-text">{m.message}</div>
                    </div>
                  </div>
                </HYReveal>
              ))}
            </div>
          )}
        </div>

        {/* ---- COUNTDOWN + FOOTER ---- */}
        <div className="hy-thank-section">
          <HYReveal>
            <div className="hy-title-sm">Đếm Ngược</div>
            <div className="hy-title-script">Thời Gian</div>
          </HYReveal>
          <HYReveal delay={100}>
            {cd.over ? (
              <div style={{ fontFamily: "var(--sans)", fontSize: "1.1rem", color: "var(--gold)", fontWeight: 500, letterSpacing: 2, margin: "28px 0" }}>
                ✦ Sự kiện đã diễn ra ✦
              </div>
            ) : (
              <div className="hy-countdown">
                {[
                  [cd.days, "Ngày"],
                  [cd.hours, "Giờ"],
                  [cd.minutes, "Phút"],
                  [cd.seconds, "Giây"],
                ].map(([val, lbl], i, arr) => (
                  <React.Fragment key={lbl}>
                    <div className="hy-cd-item">
                      <div className="hy-cd-num">{pad(Number(val))}</div>
                      <div className="hy-cd-label">{lbl}</div>
                    </div>
                    {i < arr.length - 1 && <div className="hy-cd-sep">:</div>}
                  </React.Fragment>
                ))}
              </div>
            )}
          </HYReveal>

          <div className="hy-footer-line" />
          <HYReveal delay={200}>
            <div className="hy-thank-you">Trân trọng cảm ơn</div>
            <div className="hy-footer-name">{info.grad_name}</div>
          </HYReveal>
          <div className="hy-footer-line" />
          <p style={{ fontFamily: "var(--sans)", fontSize: "1rem", color: "#bbb", letterSpacing: 3, marginTop: 20, textTransform: "uppercase" }}>
            19 · 09 · 2026
          </p>
        </div>
      </div>

      {/* Lightbox */}
      <HYLightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />

      {/* Scroll Top */}
      <button
        className={`hy-scroll-top-btn${showScrollTop ? " show" : ""}`}
        onClick={() => { stopAutoScroll(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
        title="Lên đầu trang"
      >
        ↑
      </button>
    </div>
  );
}

