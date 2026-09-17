import React, { useState, useEffect, useRef, useCallback } from 'react';
import './TamStyles.css';
import bgImage from './images/background.jpg';
import buttonImg from './images/buttom.png';
import timeLogoImg from './images/3.png';
import { useCountdown, pad } from './utils';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const EVENT_INFO = {
  grad_name: 'Thanh Tâm',
  event_date: '2026-09-19',
  event_time: '15:30',
  location_name: 'Trường Đại học Nguyễn Tất Thành',
  address: 'Cơ sở Q.12 — 331A-331B Đỗ Mười, An Phú Đông 10, Q.12, TP.HCM',
  lat: 10.859858712011244,
  lng: 106.69462064035187,
  contact_1_name: 'Tâm',
  contact_1_phone: '0393 455 450',
  contact_2_name: 'Nhi',
  contact_2_phone: '0334 259 765',
};

const GraduationInvitation = () => {
  const [isOpening, setIsOpening] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const [isOpened, setIsOpened] = useState(false);

  // Đếm ngược thời gian tới sự kiện
  const countdown = useCountdown(EVENT_INFO.event_date, EVENT_INFO.event_time);

  // Tự động cuộn (Auto Scroll) tương tự như Hoàng Yến
  const autoScrollRef = useRef(null);
  const [scrollPct, setScrollPct] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const stopAutoScroll = useCallback(() => {
    if (autoScrollRef.current) {
      cancelAnimationFrame(autoScrollRef.current);
      autoScrollRef.current = null;
    }
    document.documentElement.style.scrollBehavior = 'smooth';
  }, []);

  const startAutoScroll = useCallback(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    let currentY = window.scrollY;
    function step() {
      currentY += 1.4;
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

  // Ngừng tự động cuộn khi người dùng chạm vào màn hình hoặc cuộn chuột
  useEffect(() => {
    const handler = () => stopAutoScroll();
    ['wheel', 'touchmove', 'mousedown', 'touchstart', 'keydown'].forEach((e) =>
      window.addEventListener(e, handler, { passive: true })
    );
    return () => {
      stopAutoScroll();
      ['wheel', 'touchmove', 'mousedown', 'touchstart', 'keydown'].forEach((e) =>
        window.removeEventListener(e, handler)
      );
    };
  }, [stopAutoScroll]);

  // Bắt đầu tự động cuộn sau khi mở thư
  useEffect(() => {
    if (isOpened) {
      const timer = setTimeout(() => {
        startAutoScroll();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpened, startAutoScroll]);

  // Theo dõi thanh tiến trình cuộn & nút cuộn lên đầu
  useEffect(() => {
    if (!isOpened) return;
    function onScroll() {
      const scrollTop = window.scrollY;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(docH > 0 ? (scrollTop / docH) * 100 : 0);
      setShowScrollTop(scrollTop > docH * 0.2);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isOpened]);

  // Lấy tên khách mời nếu có trên URL (?to=...)
  const [guestName, setGuestName] = useState('');
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const to = params.get('to');
    if (to) {
      setGuestName(to);
      setRsvpName(to);
    }
  }, []);

  // State cho Lời chúc (RSVP)
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpMsg, setRsvpMsg] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  const showToast = (msg) => {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3500);
  };

  // Gửi lời chúc mới
  const handleSubmitWish = async (e) => {
    e.preventDefault();
    if (!rsvpName.trim() || !rsvpMsg.trim()) {
      showToast('⚠️ Vui lòng nhập đầy đủ tên và lời chúc!');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/thanh-tam`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guest_name: rsvpName.trim(),
          message: rsvpMsg.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`✨ Cảm ơn ${rsvpName.trim()} đã gửi lời chúc đến Thanh Tâm! 🎓`);
        setRsvpMsg('');
        if (!guestName) setRsvpName('');
      } else {
        showToast(`❌ ${data.error || 'Lỗi gửi lời chúc'}`);
      }
    } catch {
      showToast(`✨ Cảm ơn ${rsvpName.trim()} đã gửi lời chúc đến Thanh Tâm! 🎓`);
      setRsvpMsg('');
      if (!guestName) setRsvpName('');
    }
  };

  const handleOpenEnvelope = () => {
    if (isOpening) return;

    // Bước 1: Mở nắp và lá thư từ từ đi lên khỏi bao thư (Chậm, mượt mà)
    setIsOpening(true);

    // Bước 2: Sau khi lá thư trồi lên hẳn (2.6s), lá thư bắt đầu phóng to từ từ lên full màn hình
    setTimeout(() => {
      setIsZooming(true);
    }, 2600);

    // Bước 3: Sau khi phóng to hoàn tất (4.6s), chuyển mượt vào toàn bộ nội dung thiệp mời
    setTimeout(() => {
      setIsOpened(true);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 4600);
  };

  return (
    <div className="relative min-h-screen bg-[#fcf8f9] text-gray-800 font-serif">
      {/* Toast thông báo */}
      <div className={`tam-toast ${toastVisible ? 'show' : ''}`}>{toastMsg}</div>

      {/* ========================================================
          1. MÀN HÌNH BÌA PHONG BÌ DẠNG CARD PORTRAIT (BƯỚC ĐẦU)
          ======================================================== */}
      {!isOpened && (
        <div
          className={`tam-intro-overlay cursor-pointer ${isZooming ? 'fade-out' : ''}`}
          onClick={handleOpenEnvelope}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleOpenEnvelope(); }}
        >
          {/* Background mờ bao phủ toàn màn hình máy tính / desktop */}
          <div
            className="tam-intro-blurred-backdrop"
            style={{ backgroundImage: `url(${bgImage})` }}
          />

          {/* Card Portrait Mockup với ảnh background.jpg */}
          <div
            className={`intro-portrait-card ${isZooming ? 'is-zooming' : ''}`}
            style={{ backgroundImage: `url(${bgImage})` }}
          >
            <div className="intro-portrait-overlay"></div>

            {/* Sparkle stars */}
            <span className="sparkle" style={{ top: '15%', right: '18%', animationDelay: '0s' }}>✧</span>
            <span className="sparkle" style={{ top: '22%', left: '16%', animationDelay: '1s' }}>✦</span>
            <span className="sparkle" style={{ bottom: '20%', right: '14%', animationDelay: '1.5s' }}>✧</span>
            <span className="sparkle" style={{ bottom: '26%', left: '18%', animationDelay: '0.5s' }}>✦</span>

            {/* --- TOP: TITLE GRADUATION & INVITATIONS --- */}
            <div className="relative z-10 text-center pt-2">
              <div className="flex items-center justify-center">
                <h1
                  className="text-6xl sm:text-7xl md:text-8xl text-[#5c3746] font-normal leading-[1.1] drop-shadow-sm font-great-vibes"
                  style={{ fontFamily: "'Great Vibes', cursive" }}
                >
                  Graduation
                </h1>
              </div>
              <p
                className="text-[17px] sm:text-[19px] md:text-[21px] tracking-[0.42em] uppercase font-bold mt-1.5 font-cormorant text-[#5c3746]"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", letterSpacing: '0.42em', color: '#5c3746' }}
              >
                INVITATIONS
              </p>
            </div>

            {/* --- MIDDLE: ENVELOPE (RÚT THƯ TỪ TỪ LÊN VÀ PHÓNG TO FULL MÀN HÌNH) --- */}
            <div className="relative z-10 select-none my-auto">
              <div className={`envelope-scene ${isOpening ? 'is-opening' : ''} ${isZooming ? 'is-zooming' : ''}`}>
                <div className="envelope-card">

                  {/* 1. Nắp trên phong bì (Top Flap lật 3D ra sau - Màu #647647) */}
                  <div className="envelope-top-flap">
                    <svg className="envelope-flap-svg w-full h-full" viewBox="0 0 300 108" preserveAspectRatio="none">
                      <path d="M 0 0 L 150 108 L 300 0 Z" fill="#596a3e" />
                      <path d="M 0 0 L 150 108 L 300 0" fill="none" stroke="#738852" strokeWidth="1.5" />
                    </svg>
                  </div>

                  {/* 2. Lá thư bên trong (Bước 1: Trượt từ từ lên | Bước 2: Phóng to full màn hình) */}
                  <div className="envelope-inner-letter">
                    <div
                      className="text-2xl sm:text-3xl text-[#b05d7a] font-normal leading-tight drop-shadow-sm font-respondent"
                      style={{ fontFamily: "'Respondent', 'Alex Brush', cursive", color: '#b05d7a' }}
                    >
                      Thân mời
                    </div>
                    <div className="text-[15px] sm:text-[16px] tracking-wider text-[#5c3746] font-sans font-bold my-0.5" style={{ fontFamily: "'Great Vibes', cursive" }}>
                      {guestName ? guestName : 'Bạn & Gia đình'}
                    </div>
                    <p className="text-[12px] sm:text-[13px] text-[#7a4e61] font-sans leading-snug my-0.5 italic">
                      tới dự lễ tốt nghiệp của
                    </p>
                    <div
                      className="text-3xl sm:text-4xl text-[#b05d7a] font-normal leading-tight drop-shadow-sm mt-0.5 font-pinyon"
                      style={{ fontFamily: "'Pinyon Script', cursive", color: '#b05d7a' }}
                    >
                      Thanh Tâm
                    </div>
                  </div>

                  {/* 3. Túi bao thư phía trước (Trái, Phải, Đáy che phần dưới của lá thư - Màu #647647) */}
                  <div className="envelope-pocket">
                    <svg className="w-full h-full" viewBox="0 0 300 195" preserveAspectRatio="none">
                      {/* Cánh trái */}
                      <path d="M 0 0 L 150 97.5 L 0 195 Z" fill="#6d804f" />
                      {/* Cánh phải */}
                      <path d="M 300 0 L 150 97.5 L 300 195 Z" fill="#647647" />
                      {/* Cánh đáy */}
                      <path d="M 0 195 L 150 97.5 L 300 195 Z" fill="#758b54" />
                      {/* Đường viền nét tinh tế */}
                      <path d="M 0 195 L 150 97.5 L 300 195" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
                    </svg>
                  </div>

                  {/* 4. Nút Open bằng hình ảnh images/buttom.png ở chính tâm */}
                  <div className="envelope-wax-seal seal-pulse" title="Bấm để mở thư">
                    <img
                      src={buttonImg}
                      alt="Open button"
                      className="w-full h-full object-contain filter drop-shadow-md"
                    />
                  </div>

                </div>
              </div>
            </div>

            {/* --- BOTTOM: CLICK INSTRUCTION & NAME --- */}
            <div className="relative z-10 text-center pb-2">
              <p className="text-[11px] tracking-[0.25em] text-[#6d4554] uppercase font-bold font-cormorant" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                ✦ Chạm vào để mở thư ✦
              </p>
              <p
                className="text-xl text-[#8b4d66] font-script mt-0.5"
                style={{ fontFamily: "'Great Vibes', cursive" }}
              >
                ✦ Thanh Tâm ✦
              </p>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================
          2. NỘI DUNG THIỆP MỜI TRONG THƯ
          ======================================================== */}
      {isOpened && (
        <div className="relative min-h-screen overflow-x-hidden invitation-content-fadein pb-12">

          {/* Thanh tiến trình cuộn trang */}
          <div className="tam-scroll-progress">
            <div className="tam-scroll-progress-bar" style={{ width: `${scrollPct}%` }} />
          </div>

          {/* Background ảnh nền làm mờ (Blurred Background) */}
          <div
            className="tam-blurred-bg-wrapper"
            style={{ backgroundImage: `url(${bgImage})` }}
          />

          {/* Container thiệp mời chính */}
          <div className="tam-invitation-container">

            {/* ====================================================
                TẤM THIỆP GIẤY CHÍNH VINTAGE (ĐỒNG NHẤT TOÀN BỘ NỘI DUNG)
                ==================================================== */}
            <div className="tam-paper-card">

              {/* Khung hoa văn viền hồng vintage */}
              <div className="tam-card-inner-frame">

                {/* 1. TIÊU ĐỀ THIỆP MỜI */}
                <div className="text-center pt-2 mb-4">
                  <p className="text-[11px] md:text-xs tracking-[0.25em] text-[#854159] uppercase font-serif-elegant font-bold">
                    YOU'RE INVITED TO
                  </p>

                  <h1
                    className="text-3xl md:text-4xl text-[#6e2f45] font-extrabold tracking-[0.12em] uppercase font-serif-elegant leading-none mt-2 mb-1"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    GRADUATION
                  </h1>

                  <h2
                    className="text-5xl md:text-6xl text-[#b05d7a] font-normal leading-tight font-script mt-2 mb-1 drop-shadow-sm"
                    style={{ fontFamily: "'Alex Brush', 'Brush Script MT', cursive" }}
                  >
                    Thanh Tâm
                  </h2>

                  {/* Chỗ dành riêng cho khách mời (Personalized Guest Badge) */}
                  <div className="mt-3 inline-block bg-[#fdf2f5] border border-pink-200 px-4 py-1.5 rounded-full shadow-sm">
                    <p className="text-[12.5px] font-sans text-pink-700 font-semibold tracking-wide">
                      💌 {guestName ? `Thân mời: ${guestName}` : 'Trân trọng thân mời Bạn & Gia đình'}
                    </p>
                  </div>
                </div>

                {/* 2. ĐOẠN LỜI CHÚC / TÂM THƯ NGẮN GỌN */}
                <div className="px-2 mb-5 text-center">
                  <p
                    className="text-[12.5px] md:text-[13.5px] text-[#4a363f] leading-relaxed italic font-serif"
                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", lineHeight: '1.7' }}
                  >
                    "Chẳng phải phép màu, vậy sao chúng ta gặp nhau! —<br />
                    Cảm ơn những cô bạn xinh xắn, những cô em gái dễ thương và những người anh, người chị đã luôn ở bên cạnh Thanh Tâm suốt những năm tháng qua, mỗi cuộc gặp gỡ đều là một món quà đối với mình và làm nên một thanh xuân rất nhiều niềm vui rực rỡ như vậy.
                    <br />
                    Hy vọng mọi người sẽ có mặt để cùng Thanh Tâm khép lại hành trình đại học bằng những nụ cười, những cái ôm ấm áp và thật nhiều kỷ niệm đẹp nha! ❤️"
                  </p>
                </div>

                {/* 3. TIME LOGO */}
                <div className="flex justify-center my-4">
                  <img
                    src={timeLogoImg}
                    alt="Thời gian & Ngày"
                    className="w-full max-w-[280px] md:max-w-[320px] h-auto object-contain mx-auto drop-shadow-sm"
                  />
                </div>

                {/* 4. THỜI GIAN & ĐỊA ĐIỂM */}
                <div className="text-center mt-4">
                  {/* Thanh ngăn cách với chữ THỨ BẢY */}
                  <div className="flex items-center justify-center gap-2 my-2">
                    <div className="h-[1px] w-12 bg-[#b05d7a]/40"></div>
                    <span className="text-[20px] font-serif tracking-[0.2em] font-bold text-[#b05d7a] uppercase">
                      THỨ BẢY
                    </span>
                    <div className="h-[1px] w-12 bg-[#b05d7a]/40"></div>
                  </div>

                  <p className="text-[17px] font-serif tracking-[0.15em] font-bold text-[#442b36] my-1.5">
                    15:30 – 17:00
                  </p>

                  {/* Khối Địa Điểm & Bản Đồ Google Maps */}
                  <div className="tam-location-card mt-3">
                    <div className="tam-loc-name">📍 {EVENT_INFO.location_name}</div>
                    <div className="tam-map-container">
                      <iframe
                        title="Bản đồ Đại học Nguyễn Tất Thành"
                        src={`https://maps.google.com/maps?q=${EVENT_INFO.lat},${EVENT_INFO.lng}&hl=vi&z=15&output=embed`}
                        loading="lazy"
                      />
                    </div>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${EVENT_INFO.lat},${EVENT_INFO.lng}`}
                      target="_blank"
                      rel="noreferrer"
                      className="tam-btn-direction"
                    >
                      ✦ Chỉ Đường ✦
                    </a>
                  </div>

                  {/* Liên Hệ (Phong cách Hoàng Yến) */}
                  <div className="tam-contact-block">
                    <div className="tam-contact-title">Liên Hệ</div>
                    <div className="tam-contact-text">
                      <div>
                        {EVENT_INFO.contact_1_name}:{' '}
                        <a href={`tel:${EVENT_INFO.contact_1_phone.replace(/\s+/g, '')}`} className="tam-phone-link">
                          {EVENT_INFO.contact_1_phone}
                        </a>
                      </div>
                      {EVENT_INFO.contact_2_name && (
                        <div>
                          {EVENT_INFO.contact_2_name}:{' '}
                          <a href={`tel:${EVENT_INFO.contact_2_phone.replace(/\s+/g, '')}`} className="tam-phone-link">
                            {EVENT_INFO.contact_2_phone}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 5. THỜI GIAN ĐẾM NGƯỢC */}
                <div className="tam-countdown-card">
                  <div className="text-center mb-2">
                    <span className="text-[10px] sm:text-[11px] font-sans font-bold tracking-[0.22em] text-[#a25e77] uppercase">
                      ✦ CÙNG ĐẾM NGƯỢC ✦
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-script text-[#5c3547] mt-0.5" style={{ fontFamily: "'Great Vibes', cursive" }}>
                      Thời Gian Tới Sự Kiện
                    </h3>
                  </div>

                  {countdown.over ? (
                    <div className="text-center py-2 text-xs sm:text-sm text-[#b05d7a] font-sans font-semibold">
                      ✦ Sự kiện đã diễn ra! Cảm ơn bạn đã luôn yêu thương Thanh Tâm ✦
                    </div>
                  ) : (
                    <div className="tam-cd-grid">
                      <div className="tam-cd-box">
                        <span className="tam-cd-num">{pad(countdown.days)}</span>
                        <span className="tam-cd-label">Ngày</span>
                      </div>
                      <span className="tam-cd-colon">:</span>
                      <div className="tam-cd-box">
                        <span className="tam-cd-num">{pad(countdown.hours)}</span>
                        <span className="tam-cd-label">Giờ</span>
                      </div>
                      <span className="tam-cd-colon">:</span>
                      <div className="tam-cd-box">
                        <span className="tam-cd-num">{pad(countdown.minutes)}</span>
                        <span className="tam-cd-label">Phút</span>
                      </div>
                      <span className="tam-cd-colon">:</span>
                      <div className="tam-cd-box">
                        <span className="tam-cd-num">{pad(countdown.seconds)}</span>
                        <span className="tam-cd-label">Giây</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Đường phân cách họa tiết */}
                <div className="flex items-center justify-center gap-3 my-6">
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#eab3c3] to-transparent"></div>
                  <span className="text-sm text-[#b05d7a]">❦</span>
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#eab3c3] to-transparent"></div>
                </div>

                {/* 6. SỔ LƯU BÚT & GỬI LỜI CHÚC (ĐÃ GỘP CHUNG VÀO KHUNG THIỆP) */}
                <div className="tam-inner-rsvp" id="wishes">
                  <div className="text-center mb-2">
                    <div className="tam-section-title-sm">Gửi Lời Yêu Thương</div>
                    <div className="tam-section-title-script">Sổ Lưu Bút</div>
                    <p className="text-xs text-[#664b58] font-sans leading-relaxed px-1">
                      Sự hiện diện và những lời chúc yêu thương của bạn là món quà ý nghĩa nhất dành cho Thanh Tâm trong ngày tốt nghiệp! ❤️
                    </p>
                  </div>

                  {/* Form gửi lời chúc */}
                  <form onSubmit={handleSubmitWish} className="tam-rsvp-form">
                    <input
                      type="text"
                      className="tam-form-control"
                      placeholder="Tên của bạn *"
                      value={rsvpName}
                      onChange={(e) => setRsvpName(e.target.value)}
                      required
                    />
                    <textarea
                      className="tam-form-control"
                      placeholder="Gửi lời chúc mừng tốt nghiệp đến Thanh Tâm... *"
                      value={rsvpMsg}
                      onChange={(e) => setRsvpMsg(e.target.value)}
                      rows={3}
                      wrap="soft"
                      required
                    />
                    <button type="submit" className="tam-btn-submit">
                      Gửi Lời Nhắn ✦
                    </button>
                  </form>
                </div>

                {/* Đường phân cách họa tiết */}
                <div className="flex items-center justify-center gap-3 my-6">
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#eab3c3] to-transparent"></div>
                  <span className="text-sm text-[#b05d7a]">✦</span>
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#eab3c3] to-transparent"></div>
                </div>

                {/* 7. BỨC ẢNH THANK YOU */}
                <div className="tam-thank-section text-center mt-2">
                  <img
                    src="https://res.cloudinary.com/dlxbhq8pw/image/upload/v1789659252/thanksyou_wa23ru.png"
                    alt="Thank You"
                    className="w-full h-auto rounded-xl object-contain shadow-sm"
                    loading="lazy"
                  />
                </div>

              </div>

            </div>

            {/* Nút Cuộn Lên Đầu Trang */}
            <button
              type="button"
              className={`tam-scroll-top-btn ${showScrollTop ? 'show' : ''}`}
              onClick={() => {
                stopAutoScroll();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              title="Cuộn lên đầu trang"
              aria-label="Cuộn lên đầu trang"
            >
              ↑
            </button>

          </div>

        </div>
      )}
    </div>
  );
};

export default GraduationInvitation;



