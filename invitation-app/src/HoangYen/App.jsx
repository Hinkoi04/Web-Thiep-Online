import React, { useState, useEffect, useRef, useCallback } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HYMusicButton from "./components/HYMusicButton";
import { AdminLogin, AdminDashboard, AdminTrash } from "./admin";
import "./HoangYenStyles.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

// --- Petal decoration for hero ---
function Petals() {
  return (
    <>
      <div className="hero-petal" style={{ width: 200, height: 200, top: -60, right: -40, transform: "rotate(20deg)" }} />
      <div className="hero-petal" style={{ width: 120, height: 120, bottom: -30, left: -20, transform: "rotate(-30deg)" }} />
      <div className="hero-petal" style={{ width: 80, height: 80, top: 80, left: -10, transform: "rotate(45deg)", background: "rgba(246,201,216,0.06)" }} />
    </>
  );
}

// --- Reveal wrapper ---
function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.transitionDelay = `${delay}ms`;
          el.classList.add("visible");
          obs.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}

// --- Calendar ---
function Calendar() {
  const days = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
  // Tháng 9/2026: bắt đầu từ Thứ 3 (T3), ngày 19 là Thứ 7
  const rows = [
    [null, 1, 2, 3, 4, 5, 6],
    [7, 8, 9, 10, 11, 12, 13],
    [14, 15, 16, 17, 18, 19, 20],
    [21, 22, 23, 24, 25, 26, 27],
    [28, 29, 30, null, null, null, null],
  ];
  return (
    <table className="cal-table">
      <thead>
        <tr>{days.map(d => <th key={d}>{d}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td key={j} className={cell === null ? "dim" : ""}>
                {cell === 19 ? <span className="active">{cell}</span> : (cell ?? "—")}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// --- Countdown ---
function useCountdown(target) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, target.getTime() - Date.now());
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return time;
}

// --- Messages ---
const INITIAL_MESSAGES = [
  { author: "Chị Lan", text: "Chúc mừng Hoàng Yến tốt nghiệp! Chị rất tự hào về em ❤️" },
  { author: "Nhóm lớp", text: "Cả nhóm chúc mừng Yến! Nhớ chụp thật nhiều ảnh nha 🎓" },
];

// --- Envelope Cover ---
function EnvelopeCover({ onOpen, onStartOpen, guestName }) {
  const [opening, setOpening] = useState(false);

  const handleTap = () => {
    if (opening) return;
    setOpening(true);
    if (onStartOpen) onStartOpen();
    setTimeout(onOpen, 600);
  };

  // Đổi link ảnh bìa tại đây
  const coverImage =
    "https://images.unsplash.com/photo-1627556592933-ffe99c1cd9eb?w=600&h=750&fit=crop&auto=format";

  return (
    <div className={`envelope-scene${opening ? " opening" : ""}`} onClick={handleTap}>
      <div style={{ width: "min(340px, 90vw)", position: "relative", userSelect: "none" }}>
        {/* Cover Card */}
        <div className="env-body">
          {/* Cover Photo */}
          <div className="env-cover-photo-wrap">
            <img src={coverImage} alt="Ảnh bìa tốt nghiệp" className="env-cover-photo" />
            <div className="env-cover-overlay" />
          </div>

          <div style={{ position: "relative", zIndex: 1, padding: "0 24px 28px" }}>
            <div className="env-cover-title">Graduation</div>
            <div className="env-cover-year">2026</div>
            <div className="env-ornament">✦</div>
            <div className="env-cover-school">
              Trường Đại học<br />Nguyễn Tất Thành
            </div>
            <div className="env-cover-date">19 · 09 · 2026</div>

            {guestName && (
              <div className="env-guest-box">
                <span className="env-guest-label">Kính mời</span>
                <span className="env-guest-name">{guestName}</span>
              </div>
            )}
          </div>
        </div>

        {/* Tap hint */}
        <div className="tap-hint" style={{ textAlign: "center", marginTop: 24 }}>
          ✦ Chạm để mở thiệp ✦
        </div>
      </div>
    </div>
  );
}

// --- Main Card Content ---
function CardContent({ guestName }) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [name, setName] = useState(guestName || "");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const countdown = useCountdown(new Date("2026-09-19T15:00:00"));

  // Tự động điền tên khách nếu có trên URL (?to=...)
  useEffect(() => {
    if (guestName && !name) {
      setName(guestName);
    }
  }, [guestName]);

  // Lấy danh sách lời chúc từ bảng hoang_yen trên backend
  useEffect(() => {
    fetch(`${API_URL}/hoang-yen`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data && data.data.length > 0) {
          setMessages(
            data.data.map((m) => ({
              id: m.id,
              author: m.guest_name,
              text: m.message,
            }))
          );
        }
      })
      .catch(() => { });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    const guest_name = name.trim();
    const wish_msg = message.trim();

    try {
      const res = await fetch(`${API_URL}/hoang-yen`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guest_name, message: wish_msg }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setMessages((prev) => [
          { id: data.data.id, author: guest_name, text: wish_msg },
          ...prev,
        ]);
      } else {
        setMessages((prev) => [{ author: guest_name, text: wish_msg }, ...prev]);
      }
    } catch {
      setMessages((prev) => [{ author: guest_name, text: wish_msg }, ...prev]);
    }

    setName(guestName || "");
    setMessage("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const pad = (n) => String(n).padStart(2, "0");

  return (
    <div className="main-card">
      {/* Hero */}
      <div className="card-hero">
        <Petals />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div className="hero-label">Lễ Tốt Nghiệp · 2026</div>
          <div className="hero-name">Hoàng Yến</div>
          <div className="hero-sub">Tân Cử Nhân</div>
          <div className="env-ornament" style={{ color: "rgba(246,201,216,0.4)", margin: "16px 0" }}>✦</div>
          <div className="hero-date-badge">
            <span>19 · 09 · 2026</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span>ĐH Nguyễn Tất Thành</span>
          </div>

          {guestName && (
            <div className="hero-invite-box">
              <div className="hero-invite-label">Kính mời</div>
              <div className="hero-invite-name">{guestName}</div>
            </div>
          )}
        </div>
      </div>

      {/* Quote */}
      <div className="section-pad">
        <Reveal>
          <div className="quote-block">
            Đây là ngày mình muốn lưu lại những khoảnh khắc đẹp đẽ của thời sinh viên.
            Hy vọng những khoảnh khắc lưu lại cột mốc thời sinh viên này sẽ có sự tham gia của bạn.
          </div>
        </Reveal>
      </div>

      <div className="divider-fancy"><div className="line" /><div className="icon">✦</div><div className="line" /></div>

      {/* Graduate info */}
      <div className="section-pad">
        <Reveal>
          <div className="section-label">Tân Cử Nhân</div>
          <div className="section-title">Hoàng Yến</div>
          {/* <p className="body-text">
            Sau những năm nỗ lực không ngừng nghỉ, Hoàng Yến đã sẵn sàng để chạm tay vào chiếc mũ cử nhân.
            Buổi lễ tốt nghiệp này sẽ kém phần trọn vẹn nếu thiếu đi sự hiện diện của những người đã luôn bên cạnh
            động viên và ủng hộ. Thân mời bạn / anh / chị / gia đình đến tham dự để cùng lưu giữ những
            khung hình đẹp nhất của dấu mốc quan trọng này. 🎓✨
          </p> */}
        </Reveal>
      </div>

      {/* Photo strip placeholder */}
      <Reveal>
        <div className="photo-strip">
          {[
            "https://images.unsplash.com/photo-1627556592933-ffe99c1cd9eb?w=280&h=360&fit=crop&auto=format",
            "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=280&h=360&fit=crop&auto=format",
            "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=280&h=360&fit=crop&auto=format",
          ].map((src, i) => (
            <div className="photo-strip-item" key={i}>
              <img src={src} alt={`Ảnh tốt nghiệp ${i + 1}`} />
            </div>
          ))}
        </div>
      </Reveal>

      <div className="divider-fancy" style={{ marginTop: 32 }}><div className="line" /><div className="icon">✦</div><div className="line" /></div>

      {/* Invitation band */}
      <div className="gold-band">
        <div style={{ position: "relative", zIndex: 1 }}>
          <Reveal>
            <div className="section-label">Thân Mời</div>
            <div className="section-title">
              {guestName ? guestName : "Bạn bè & Gia đình"}
            </div>
            <div className="section-label" style={{ marginTop: 4 }}>Đến dự lễ tốt nghiệp</div>
          </Reveal>
        </div>
      </div>

      {/* Date & Location */}
      <div className="section-pad">
        <Reveal>
          <div className="section-label">Thời Gian</div>
          <div className="section-title">Tháng 09 · 2026</div>
        </Reveal>
        <Reveal delay={100}>
          <Calendar />
        </Reveal>
        <Reveal delay={150}>
          <div className="date-display">
            <div className="d-unit"><div className="num">09</div><div className="lbl">Tháng</div></div>
            <div className="sep" />
            <div className="d-unit"><div className="num" style={{ fontSize: 52 }}>19</div><div className="lbl">Thứ Bảy</div></div>
            <div className="sep" />
            <div className="d-unit"><div className="num">2026</div><div className="lbl">Năm</div></div>
          </div>
        </Reveal>
        <Reveal delay={200}>
          <div className="loc-card">
            <div className="loc-name">Trường ĐH Nguyễn Tất Thành</div>
            <div className="loc-addr">📍 Cơ sở Q.12 — 331A-331B Đỗ Mười, An Phú Đông 10, An Phú Đồng</div>
            <div className="map-placeholder">
              <iframe
                src="https://maps.google.com/maps?q=10.859858712011244,106.69462064035187&hl=vi&z=15&output=embed"
                title="Bản đồ"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=10.859858712011244,106.69462064035187"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-direction"
            >
              ✦ Chỉ Đường
            </a>
          </div>
        </Reveal>

        <Reveal delay={250} className="mt-6">
          <div style={{ textAlign: "center", marginTop: 24 }}>
            <div className="section-label" style={{ marginBottom: 8 }}>Liên Hệ</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontStyle: "italic", color: "var(--mauve)", lineHeight: 1.8 }}>
              Nhi: 0334 259 765<br />Mi: 0397 177 038
            </div>
          </div>
        </Reveal>
      </div>

      <div className="divider-fancy"><div className="line" /><div className="icon">✦</div><div className="line" /></div>

      {/* Timeline */}
      <div className="section-pad">
        <Reveal>
          <div className="section-label">Chương Trình</div>
          <div className="section-title">Sự Kiện</div>
        </Reveal>
        {[
          { time: "15:00", desc: "Bắt đầu Lễ Trao Bằng Tốt Nghiệp" },
          { time: "15:30 – 16:30", desc: "Đón khách, Chụp ảnh lưu niệm & Chung vui" },
        ].map((item, i) => (
          <Reveal key={i} delay={i * 100}>
            <div className="timeline-item">
              <div className="t-time">{item.time}</div>
              <div className="t-desc">{item.desc}</div>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="divider-fancy"><div className="line" /><div className="icon">✦</div><div className="line" /></div>

      {/* Album */}
      <div className="section-pad" style={{ paddingBottom: 16 }}>
        <Reveal>
          <div className="section-label">Kỷ Niệm</div>
          <div className="section-title">Album Tốt Nghiệp</div>
        </Reveal>
      </div>
      <Reveal>
        <div className="album-grid">
          {[
            "https://images.unsplash.com/photo-1546961342-ea5f62d5a27b?w=400&h=530&fit=crop&auto=format",
            "https://images.unsplash.com/photo-1627556592933-ffe99c1cd9eb?w=400&h=530&fit=crop&auto=format",
            "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=530&fit=crop&auto=format",
            "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=530&fit=crop&auto=format",
          ].map((src, i) => (
            <div className="album-item" key={i}>
              <img src={src} alt={`Album ${i + 1}`} />
            </div>
          ))}
        </div>
      </Reveal>

      {/* RSVP */}
      <div className="section-pad" style={{ paddingTop: 40 }} id="rsvp">
        <Reveal>
          <div className="section-label">Gửi Lời Yêu Thương</div>
          <div className="section-title">Sổ Lưu Bút</div>
          <p className="body-text" style={{ marginBottom: 24, textAlign: "center" }}>
            Sự hiện diện của bạn / anh / chị / gia đình là niềm vinh hạnh cho buổi lễ tốt nghiệp của Hoàng Yến.
            Dẫu khoảng cách địa lý hay công việc có ngăn chúng ta gặp gỡ, nhưng niềm vui ngày tốt nghiệp
            sẽ thêm trọn vẹn hơn nếu như mình nhận thêm lời chúc từ bạn. ❤️
          </p>
        </Reveal>
        <Reveal delay={100}>
          <form className="rsvp-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Tên của bạn"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
            <textarea
              placeholder="Gửi lời chúc mừng đến Hoàng Yến..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              required
            />
            <button type="submit" className="btn-submit">
              {submitted ? "Đã gửi ✦" : "Gửi Lời Nhắn ✦"}
            </button>
          </form>
        </Reveal>

        {messages.length > 0 && (
          <div style={{ marginTop: 28 }}>
            {messages.map((m, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="message-item">
                  <div className="msg-author">{m.author}</div>
                  <div className="msg-text">{m.text}</div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>

      {/* Countdown */}
      <div className="section-pad" style={{ textAlign: "center", background: "white", borderTop: "1px solid rgba(155,104,129,0.1)" }}>
        <Reveal>
          <div className="section-label">Đếm Ngược</div>
          <div className="section-title" style={{ marginBottom: 4 }}>Thời Gian</div>
        </Reveal>
        <Reveal delay={100}>
          <div className="countdown-row">
            {[
              { n: countdown.days, l: "Ngày" },
              { n: countdown.hours, l: "Giờ" },
              { n: countdown.minutes, l: "Phút" },
              { n: countdown.seconds, l: "Giây" },
            ].map((item, i) => (
              <React.Fragment key={item.l}>
                {i > 0 && <div className="cd-sep">:</div>}
                <div className="cd-item">
                  <div className="cd-num">{pad(item.n)}</div>
                  <div className="cd-lbl">{item.l}</div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </Reveal>
      </div>

      {/* Footer */}
      <div className="footer-section">
        <Reveal>
          <div className="section-label">Trân Trọng Cảm Ơn</div>
          <div className="footer-name">Hoàng Yến</div>
          <div style={{ margin: "16px 0", borderTop: "1px solid rgba(246,201,216,0.2)" }} />
          <div className="footer-date">19 · 09 · 2026</div>
        </Reveal>
      </div>
    </div>
  );
}

// --- Hoang Yen Invitation Page ---
function HoangYenInvitation() {
  const [opened, setOpened] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const musicRef = useRef(null);
  const autoScrollRef = useRef(null);

  // Lấy tên khách mời từ tham số ?to=... trên URL
  const [guestName] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("to") || "";
  });

  /* ---- AUTO SCROLL (giống Nhi) ---- */
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

  // Ngừng cuộn khi người dùng tự tương tác (lăn chuột, chạm màn hình)
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

  // Nút cuộn lên đầu trang
  useEffect(() => {
    function onScroll() {
      const scrollTop = window.scrollY;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setShowScrollTop(scrollTop > docH * 0.25);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleStartOpen = () => {
    if (musicRef.current) {
      musicRef.current.play();
    }
  };

  const handleOpen = () => {
    setOpened(true);
    setShowCard(true);
    // Tự động cuộn mượt sau khi vào thiệp
    setTimeout(startAutoScroll, 1200);
  };

  return (
    <div className="hy-invitation-container" style={{ minHeight: "100%", background: "var(--pale-blush)" }}>
      {/* Nút phát nhạc xoay đĩa */}
      <HYMusicButton ref={musicRef} src="/music/nhac.mp3" />

      {!opened && (
        <EnvelopeCover
          onOpen={handleOpen}
          onStartOpen={handleStartOpen}
          guestName={guestName}
        />
      )}
      {showCard && (
        <div
          style={{
            animation: "fadeSlideIn 0.7s ease forwards",
          }}
        >
          <CardContent guestName={guestName} />
        </div>
      )}

      {/* Nút cuộn lên đầu trang */}
      <button
        className={`hy-scroll-top-btn${showScrollTop ? " show" : ""}`}
        onClick={() => {
          stopAutoScroll();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        title="Lên đầu trang"
      >
        ↑
      </button>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// --- App Root with Routes ---
export default function App() {
  return (
    <BrowserRouter basename="/HoangYen">
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/trash" element={<AdminTrash />} />
        <Route path="/*" element={<HoangYenInvitation />} />
      </Routes>
    </BrowserRouter>
  );
}
