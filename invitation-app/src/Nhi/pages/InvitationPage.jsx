import React, { useState, useEffect, useRef, useCallback } from "react";
import IntroOverlay from "../components/IntroOverlay";
import Reveal from "../components/Reveal";
import Divider from "../components/Divider";
import MusicButton from "../components/MusicButton";
import ParticlesCanvas from "../components/ParticlesCanvas";
import ConfettiCanvas from "../components/ConfettiCanvas";
import BokehEffect from "../components/BokehEffect";
import Lightbox from "../components/Lightbox";
import { pad, useCountdown, buildCalendar } from "../utils";
import "../NhiStyles.css";

/* ====== IMAGE IMPORTS ====== */
import imgAnhbia from "../uploads/anhbia.jpg";
import imgAnh1 from "../uploads/anh1.JPG";
import imgAnh7 from "../uploads/anh7.JPG";
import imgAnh8 from "../uploads/anh8.JPG";
import imgAnh4 from "../uploads/anh4.JPG";
import imgAnh5 from "../uploads/anh5.JPG";
import imgAnh6 from "../uploads/anh6.jpg";
import imgAnh3 from "../uploads/anh3.JPG";
import imgIntro from "../uploads/IMG_5187.JPG";
import imgTassel from "../uploads/daay.png";

/* ====================================================
   HARDCODED DATA — Trần Thị Tố Nhi Graduation
   ==================================================== */
const NHI_INFO = {
  grad_name: "Trần Thị Tố Nhi",
  event_date: "2026-06-21",
  event_time: "07:30",
  location_name: "Trường Đại học Nguyễn Tất Thành",
  address: "331A - 331B Đỗ Mười, An Phú Đông, TP HCM",
  lat: 10.859858712011244,
  lng: 106.69462064035187,
  hero_image: imgAnhbia,
  quote: "Đây là ngày mình muốn lưu lại những khoảng khắc đẹp đẽ của thời sinh viên. Hy vọng những khoảnh khắc lưu lại cột mốc thời sinh viên này sẽ có sự tham gia của bạn.",
  photo_1: imgAnh1,
  photo_2: imgAnh7,
  photo_3: imgAnh8,
  intro_text: "Sau 3 năm nỗ lực không ngừng nghỉ, Tố Nhi đã sẵn sàng để chạm tay vào chiếc mũ cử nhân. Buổi lễ tốt nghiệp này sẽ kém phần trọn vẹn nếu thiếu đi sự hiện diện của những người đã luôn bên cạnh động viên và ủng hộ Nhi. Thân mời bạn/ anh/ chị/ gia đình đến tham dự buổi lễ để cùng Nhi lưu giữ những khung hình đẹp nhất của dấu mốc quan trọng này. 🎓✨",
  album_1: imgAnh4,
  album_2: imgAnh5,
  album_3: imgAnh6,
  album_4: imgAnh3,
  rsvp_text: "Sự hiện diện của bạn/ anh/ chị/ gia đình là niềm vinh hạnh cho buổi lễ tốt nghiệp của Tố Nhi. Dẫu khoảng cách địa lý hay công việc có ngăn chúng ta gặp gỡ, nhưng niềm vui ngày tốt nghiệp sẽ thêm trọn vẹn hơn nếu như mình nhận thêm chúc từ bạn.❤️",
  contact_1_name: "Nhi",
  contact_1_phone: "0334259765",
  contact_2_name: "Mi",
  contact_2_phone: "0397177038",
  intro_image: imgIntro,
  tassel_image: imgTassel,
  music: "./../../../dist/assets/nhac.mp3",
};

const NHI_TIMELINE = [
  { id: 1, order_num: 1, time_str: "07:30", description: "Bắt đầu Lễ Trao Bằng Tốt Nghiệp" },
  { id: 2, order_num: 2, time_str: "09:45 - 12:00", description: "Đón khách, Chụp ảnh lưu niệm & Chung vui" },
];

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export default function InvitationPage({ info: _info, timeline: _timeline, rsvp: initialRsvp, onAddRsvp, onBack }) {
  // Use hardcoded data
  const info = NHI_INFO;
  const timeline = NHI_TIMELINE;

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
  const [rsvpList, setRsvpList] = useState(initialRsvp || []);

  const heroBgRef = useRef(null);
  const heroContentRef = useRef(null);
  const musicRef = useRef(null);
  const confettiRef = useRef(null);
  const autoScrollRef = useRef(null);

  // Get guest name from URL
  const [guestName] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("to") || "";
  });

  // Pre-fill RSVP name from URL param
  useEffect(() => {
    if (guestName && !rsvpName) {
      setRsvpName(guestName);
    }
  }, [guestName]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch RSVP messages from backend
  useEffect(() => {
    fetch(`${API_URL}/rsvp?slug=nhi`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setRsvpList(data.data);
        }
      })
      .catch(() => { }); // Fallback: giữ list rỗng nếu API chưa chạy
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

  /* ---- INTRO HANDLERS ---- */
  const handleStartOpen = useCallback(() => {
    setMainVisible(true);
    // Auto-play music
    if (musicRef.current) {
      musicRef.current.play();
    }
  }, []);

  const handleOpen = useCallback(() => {
    setIntroVisible(false);
    setParticlesActive(true);
    // Start auto-scroll after 1 second
    setTimeout(startAutoScroll, 1000);
  }, [startAutoScroll]);

  /* ---- SCROLL LISTENER ---- */
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

  /* ---- RSVP SUBMIT ---- */
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
        body: JSON.stringify({ guest_name: rsvpName.trim(), message: rsvpMsg.trim(), slug: "nhi" }),
      });
      const data = await res.json();
      if (data.success) {
        setRsvpList((prev) => [data.data, ...prev]);
        if (onAddRsvp) onAddRsvp(data.data);
        showToast(`✨ Cảm ơn ${rsvpName.trim()} đã gửi lời chúc! 🎓`);
        setRsvpName(guestName || "");
        setRsvpMsg("");
      } else {
        showToast(`❌ ${data.error || "Lỗi gửi lời chúc"}`);
      }
    } catch {
      // Fallback client-side nếu API không khả dụng
      const newMsg = { id: Date.now(), guest_name: rsvpName.trim(), message: rsvpMsg.trim(), slug: "nhi" };
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
    <div className="nhi-wrapper">
      {/* Toast */}
      <div className={`nhi-toast${toastVisible ? " show" : ""}`}>{toastMsg}</div>

      {/* Music Button */}
      <MusicButton ref={musicRef} src={info.music} />

      {/* Particles */}
      <ParticlesCanvas active={particlesActive} />

      {/* Confetti */}
      <ConfettiCanvas ref={confettiRef} />

      {/* Intro Overlay */}
      {introVisible && (
        <IntroOverlay
          info={info}
          onStartOpen={handleStartOpen}
          onOpen={handleOpen}
          confettiRef={confettiRef}
        />
      )}

      {/* Scroll Progress */}
      <div className="nhi-scroll-progress">
        <div className="nhi-scroll-progress-bar" style={{ width: `${scrollPct}%` }} />
      </div>

      {/* ============ MAIN CONTENT ============ */}
      <div
        id="main-content"
        style={{
          opacity: mainVisible ? 1 : 0,
          transition: "opacity 1.5s ease",
        }}
      >
        {/* ---- HERO ---- */}
        <div className="nhi-hero">
          <div className="nhi-hero-bg-layer" ref={heroBgRef}>
            <img src={info.hero_image} alt="" />
          </div>
          <BokehEffect />
          <div className="nhi-hero-content" ref={heroContentRef}>
            {guestName && (
              <div className={`nhi-invite-box${mainVisible ? " anim" : ""}`}>
                <p className="nhi-invite-label">Kính mời</p>
                <p className="nhi-invite-name">{guestName}</p>
              </div>
            )}
          </div>
          <div className={`nhi-scroll-indicator${scrollArrowHidden ? " hidden" : ""}`}>↓</div>
        </div>

        {/* ---- QUOTE ---- */}
        <div className="nhi-section">
          <Reveal>
            <div className="nhi-quote-box">
              <span className="nhi-quote-mark open">"</span>
              {info.quote}
              <span className="nhi-quote-mark close">"</span>
            </div>
          </Reveal>
        </div>

        <Reveal><Divider /></Reveal>

        {/* ---- GRAD INFO + PHOTOS ---- */}
        <div className="nhi-section" style={{ paddingTop: 30 }}>
          <Reveal>
            <div className="nhi-title-sm">Tân Cử Nhân</div>
            <div className="nhi-title-script-lg">{info.grad_name}</div>
          </Reveal>
          <Reveal delay={100}>
            <div className="nhi-photo-row">
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
          </Reveal>
          <Reveal delay={200}>
            <p className="nhi-text-desc">{info.intro_text}</p>
          </Reveal>
        </div>

        <Reveal><Divider /></Reveal>

        {/* ---- GOLD BAND (INVITE) ---- */}
        <div className="nhi-gold-band">
          <Reveal>
            {guestName ? (
              <>
                <div className="nhi-title-sm" style={{ color: "var(--gold-light)" }}>Thân mời</div>
                <div
                  style={{
                    fontFamily: "var(--script)",
                    fontSize: "clamp(2.2rem, 8vw, 3.2rem)",
                    color: "var(--gold-light)",
                    lineHeight: 1.2,
                    margin: "10px 0",
                    whiteSpace: "nowrap",
                  }}
                >
                  {guestName}
                </div>
                <div className="nhi-title-sm" style={{ color: "var(--gold-light)" }}>Đến dự lễ tốt nghiệp</div>
              </>
            ) : (
              <>
                <div className="nhi-title-sm" style={{ color: "var(--gold-light)" }}>Thân mời</div>
                <div className="nhi-title-script" style={{ color: "var(--gold-light)" }}>Bạn bè &amp; Gia đình</div>
                <div className="nhi-title-sm" style={{ color: "var(--gold-light)" }}>Đến dự lễ tốt nghiệp</div>
              </>
            )}
          </Reveal>
        </div>

        {/* ---- CALENDAR ---- */}
        <div className="nhi-cal-wrap">
          <Reveal>
            <div className="nhi-title-sm">Thời Gian</div>
            <div className="nhi-title-script">{cal.monthLabel} · {cal.year}</div>
          </Reveal>
          <Reveal delay={100}>
            <table className="nhi-cal-table">
              <thead>
                <tr>{cal.weekdays.map((w) => <th key={w}>{w}</th>)}</tr>
              </thead>
              <tbody>
                {cal.rows.map((row, ri) => (
                  <tr key={ri}>
                    {row.map((day, ci) => (
                      <td key={ci} className={day === null ? "empty" : ""}>
                        {day === cal.eventDay ? (
                          <span className="nhi-day-active">{day}</span>
                        ) : (day ?? "")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>

          {/* Date block */}
          <Reveal delay={150}>
            <div className="nhi-date-block">
              <div className="nhi-d-item">
                <span>Tháng</span>
                <strong>{String(d.getMonth() + 1).padStart(2, "0")}</strong>
              </div>
              <div className="nhi-date-dot" />
              <div className="nhi-d-item main">
                <span>{cal.dayOfWeekLabel}</span>
                <strong>{d.getDate()}</strong>
              </div>
              <div className="nhi-date-dot" />
              <div className="nhi-d-item">
                <span>Năm</span>
                <strong>{d.getFullYear()}</strong>
              </div>
            </div>
          </Reveal>

          {/* Location */}
          <Reveal delay={200}>
            <div className="nhi-location-card">
              <div className="nhi-loc-name">{info.location_name}</div>
              <div className="nhi-loc-addr">📍{info.address}</div>
              <div className="nhi-map-container">
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
          </Reveal>

          <Reveal delay={250}>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${info.lat},${info.lng}`}
              target="_blank"
              rel="noreferrer"
              className="nhi-btn"
            >
              ✦ Chỉ Đường
            </a>
          </Reveal>

          {/* Contact */}
          <Reveal delay={300}>
            <div style={{ marginTop: 28 }}>
              <div className="nhi-title-script">Liên hệ</div>
              <div className="nhi-contact-text">{info.contact_1_name}: {info.contact_1_phone}</div>
              <div className="nhi-contact-text">{info.contact_2_name}: {info.contact_2_phone}</div>
            </div>
          </Reveal>
        </div>

        {/* ---- TIMELINE ---- */}
        <div className="nhi-section" style={{ background: "#fff" }}>
          <Reveal>
            <div className="nhi-title-sm">Chương Trình</div>
            <div className="nhi-title-script">Sự Kiện</div>
          </Reveal>
          <div className="nhi-timeline">
            {[...timeline].sort((a, b) => a.order_num - b.order_num).map((item, i) => (
              <Reveal key={item.id} delay={i * 150}>
                <div className="nhi-t-item">
                  <div className="nhi-t-time">{item.time_str}</div>
                  <div className="nhi-t-desc">{item.description}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* ---- ALBUM ---- */}
        <div className="nhi-section" style={{ paddingBottom: 20 }}>
          <Reveal>
            <div className="nhi-title-sm">Kỷ Niệm</div>
            <div className="nhi-title-script">Album Tốt Nghiệp</div>
          </Reveal>
        </div>
        <Reveal>
          <div className="nhi-album-grid">
            {[info.album_1, info.album_2, info.album_3, info.album_4].map((src, i) => (
              <div
                key={i}
                className="nhi-album-item"
                onClick={() => setLightboxSrc(src)}
              >
                <img src={src} alt={`Album ${i + 1}`} loading="lazy" />
              </div>
            ))}
          </div>
        </Reveal>

        {/* ---- RSVP ---- */}
        <div className="nhi-rsvp-wrap" id="rsvp">
          <Reveal>
            <div className="nhi-title-sm">Gửi Lời Yêu Thương</div>
            <div className="nhi-title-script">Sổ Lưu Bút</div>
            <p className="nhi-text-desc" style={{ textAlign: "center", marginBottom: 28 }}>
              {info.rsvp_text}
            </p>
          </Reveal>
          <Reveal delay={100}>
            <form onSubmit={submitRsvp} style={{ marginTop: 24 }}>
              <input
                type="text"
                className="nhi-form-control"
                placeholder="Tên của bạn"
                value={rsvpName}
                onChange={(e) => setRsvpName(e.target.value)}
                required
              />
              <textarea
                className="nhi-form-control"
                placeholder="Gửi lời chúc mừng đến Nhi..."
                value={rsvpMsg}
                onChange={(e) => setRsvpMsg(e.target.value)}
                required
              />
              <button type="submit" className="nhi-btn-submit">
                Gửi Lời Nhắn ✦
              </button>
            </form>
          </Reveal>
        </div>

        {/* ---- COUNTDOWN + FOOTER ---- */}
        <div className="nhi-thank-section">
          <Reveal>
            <div className="nhi-title-sm">Đếm Ngược</div>
            <div className="nhi-title-script">Thời Gian</div>
          </Reveal>
          <Reveal delay={100}>
            {cd.over ? (
              <div style={{
                fontFamily: "var(--sans)",
                fontSize: "1.1rem",
                color: "var(--gold)",
                fontWeight: 500,
                letterSpacing: 2,
                margin: "28px 0",
              }}>
                ✦ Sự kiện đã diễn ra ✦
              </div>
            ) : (
              <div className="nhi-countdown">
                {[
                  [cd.days, "Ngày"],
                  [cd.hours, "Giờ"],
                  [cd.minutes, "Phút"],
                  [cd.seconds, "Giây"],
                ].map(([val, lbl], i, arr) => (
                  <React.Fragment key={lbl}>
                    <div className="nhi-cd-item">
                      <div className="nhi-cd-num">{pad(Number(val))}</div>
                      <div className="nhi-cd-label">{lbl}</div>
                    </div>
                    {i < arr.length - 1 && <div className="nhi-cd-sep">:</div>}
                  </React.Fragment>
                ))}
              </div>
            )}
          </Reveal>

          <div className="nhi-footer-line" />
          <Reveal delay={200}>
            <div className="nhi-thank-you">Trân trọng cảm ơn</div>
            <div className="nhi-footer-name">{info.grad_name}</div>
          </Reveal>
          <div className="nhi-footer-line" />
          <p style={{
            fontFamily: "var(--sans)",
            fontSize: "1rem",
            color: "#bbb",
            letterSpacing: 3,
            marginTop: 20,
            textTransform: "uppercase",
          }}>
            21 · 06 · 2026
          </p>
        </div>
      </div>

      {/* Lightbox */}
      <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />

      {/* Scroll Top */}
      <button
        className={`nhi-scroll-top-btn${showScrollTop ? " show" : ""}`}
        onClick={() => {
          stopAutoScroll();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        title="Lên đầu trang"
      >
        ↑
      </button>
    </div>
  );
}
