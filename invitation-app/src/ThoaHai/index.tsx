import { useState, useEffect, useRef, useCallback } from 'react';
import './ThoaHai.css';
import { initialWeddingInfo } from './data/weddingData';
import type { WeddingInfo } from './types';
import { weddingAudio } from './utils/audioPlayer';
import { WeddingEnvelopeCover } from './components/WeddingEnvelopeCover';
import { CoverScreen } from './components/screens/CoverScreen';
import { InvitationDetailsScreen } from './components/screens/InvitationDetailsScreen';
import { ScheduleScreen } from './components/screens/ScheduleScreen';
import { CountdownScreen } from './components/screens/CountdownScreen';
import { GalleryScreen } from './components/screens/GalleryScreen';
import { GuestbookScreen } from './components/screens/GuestbookScreen';
import { NavigationTabBar } from './components/NavigationTabBar';
import type { ScreenId } from './components/NavigationTabBar';
import { FallingPetals } from './components/FallingPetals';
import { Volume2, VolumeX, Sparkles, ChevronUp, ChevronsDown, Pause } from 'lucide-react';

export interface ThoaHaiProps {
  defaultOpened?: boolean;
}

// Trích xuất tên khách mời từ URL (?to=..., ?guest=..., ?name=..., ?n=...)
const getGuestNameFromUrl = (): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    const params = new URLSearchParams(window.location.search);
    const paramName = params.get('to') || params.get('guest') || params.get('name') || params.get('n');
    if (paramName && paramName.trim()) return paramName.trim();

    if (window.location.hash && window.location.hash.includes('?')) {
      const hashQuery = window.location.hash.split('?')[1];
      const hashParams = new URLSearchParams(hashQuery);
      const hashName = hashParams.get('to') || hashParams.get('guest') || hashParams.get('name') || hashParams.get('n');
      if (hashName && hashName.trim()) return hashName.trim();
    }

    const fullUrl = window.location.href;
    const pathMatch = fullUrl.match(/(?:[/?&#])(?:to|guest|name|n)[=/]([^/?&#]+)/i);
    if (pathMatch && pathMatch[1]) {
      const rawVal = decodeURIComponent(pathMatch[1].replace(/\+/g, ' ')).trim();
      if (rawVal) return rawVal;
    }
  } catch (e) {
    console.error('Error parsing guest name from URL', e);
  }
  return null;
};

export default function ThoaHai({ defaultOpened = false }: ThoaHaiProps) {
  const [opened, setOpened] = useState(() => {
    if (defaultOpened) return true;
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      if (p.get('open') === '1' || p.get('opened') === 'true') return true;
    }
    return false;
  });
  const [weddingInfo, setWeddingInfo] = useState<WeddingInfo>(() => {
    const fromUrl = getGuestNameFromUrl();
    if (fromUrl) return { ...initialWeddingInfo, guestName: fromUrl };
    return initialWeddingInfo;
  });
  const [activeSection, setActiveSection] = useState<ScreenId>('cover');
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [petalsEnabled, setPetalsEnabled] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const isAutoScrollingRef = useRef<boolean>(false);
  const autoScrollRafRef = useRef<number | null>(null);

  // Sync music state
  useEffect(() => {
    weddingAudio.setCallback((playing) => setIsPlayingMusic(playing));
    return () => { weddingAudio.pause(); };
  }, []);

  // Parse guest name from URL
  useEffect(() => {
    const fromUrl = getGuestNameFromUrl();
    if (fromUrl) setWeddingInfo((prev) => ({ ...prev, guestName: fromUrl }));
  }, []);

  // Track scroll for showScrollTop button
  useEffect(() => {
    const onScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Update page title
  useEffect(() => {
    const guestN = weddingInfo.guestName;
    const isGeneric = !guestN || guestN === 'Anh/ Chị & Người thương';
    document.title = isGeneric
      ? 'Thiệp Cưới — Thanh Hải & Yến Thoa · 29.10.2026'
      : `Thiệp Cưới Thanh Hải & Yến Thoa · Kính gửi ${guestN}`;
  }, [weddingInfo.guestName]);

  // Stop auto-scroll cleanly - instantly releases control to user's hand
  const stopAutoScroll = useCallback(() => {
    if (isAutoScrollingRef.current) {
      isAutoScrollingRef.current = false;
      setIsAutoScrolling(false);
      if (autoScrollRafRef.current !== null) {
        cancelAnimationFrame(autoScrollRafRef.current);
        autoScrollRafRef.current = null;
      }
    }
  }, []);

  // Khóa cuộn trang khi đang ở bìa thư
  useEffect(() => {
    if (!opened) {
      document.body.style.overflow = 'hidden';
      window.scrollTo(0, 0);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [opened]);

  // Smooth continuous auto-scroll down (delta-based, frame-rate independent, nhịp điệu chậm rãi 35px/s)
  const startAutoScroll = useCallback(() => {
    if (isAutoScrollingRef.current) return;
    isAutoScrollingRef.current = true;
    setIsAutoScrolling(true);

    // Bắt đầu phát nhạc ngay khi cuộn bắt đầu
    if (!weddingAudio.getIsPlaying()) {
      try {
        weddingAudio.play();
        setIsPlayingMusic(true);
      } catch (e) {
        console.warn('Audio play error on scroll start:', e);
      }
    }

    let lastTime: number | null = null;
    const scrollSpeed = 0.040; // Chậm rãi, thư thái để người xem kịp ngắm nhìn các hiệu ứng chữ xuất hiện ở giữa màn hình

    const scrollLoop = (time: number) => {
      if (!isAutoScrollingRef.current) return;

      if (lastTime !== null) {
        const delta = Math.min(time - lastTime, 50);
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        if (window.scrollY >= maxScroll - 4) {
          stopAutoScroll();
          return;
        }
        window.scrollBy(0, delta * scrollSpeed);
      }
      lastTime = time;
      autoScrollRafRef.current = requestAnimationFrame(scrollLoop);
    };

    autoScrollRafRef.current = requestAnimationFrame(scrollLoop);
  }, [stopAutoScroll]);

  const toggleAutoScroll = useCallback(() => {
    if (isAutoScrollingRef.current) {
      stopAutoScroll();
    } else {
      startAutoScroll();
    }
  }, [startAutoScroll, stopAutoScroll]);

  // Immediately stop auto-scroll on ANY manual user interaction
  useEffect(() => {
    const handleUserInteraction = () => {
      if (isAutoScrollingRef.current) {
        stopAutoScroll();
      }
    };

    window.addEventListener('wheel', handleUserInteraction, { passive: true });
    window.addEventListener('touchstart', handleUserInteraction, { passive: true });
    window.addEventListener('touchmove', handleUserInteraction, { passive: true });
    window.addEventListener('pointerdown', handleUserInteraction, { passive: true });
    window.addEventListener('mousedown', handleUserInteraction, { passive: true });
    window.addEventListener('keydown', handleUserInteraction, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
      window.removeEventListener('touchmove', handleUserInteraction);
      window.removeEventListener('pointerdown', handleUserInteraction);
      window.removeEventListener('mousedown', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
    };
  }, [stopAutoScroll]);

  const handleEnvelopeDone = useCallback(() => {
    setOpened(true);
  }, []);

  // Tự động cuộn và bật nhạc sau khi nội dung đã hiện rõ (delay 2000ms sau khi mở bìa)
  useEffect(() => {
    if (opened) {
      const timer = setTimeout(() => {
        startAutoScroll();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [opened, startAutoScroll]);

  // Nếu người dùng chủ động cuộn tay trước khi tự động cuộn kích hoạt, nhạc cũng sẽ bắt đầu
  useEffect(() => {
    if (!opened) return;
    const playOnScroll = () => {
      if (!weddingAudio.getIsPlaying()) {
        try {
          weddingAudio.play();
          setIsPlayingMusic(true);
        } catch (e) {
          console.warn('Manual scroll music start error:', e);
        }
      }
    };
    window.addEventListener('scroll', playOnScroll, { passive: true, once: true });
    return () => window.removeEventListener('scroll', playOnScroll);
  }, [opened]);

  // Track active section on scroll
  useEffect(() => {
    if (!opened) return;
    const handleScroll = () => {
      const sectionIds: ScreenId[] = ['cover', 'invitation', 'schedule', 'countdown', 'gallery', 'guestbook'];
      const scrollPos = window.scrollY + 200;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(`section-${sectionIds[i]}`);
        if (el && el.offsetTop <= scrollPos) { setActiveSection(sectionIds[i]); break; }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [opened]);

  // Jump to section if ?s= param exists
  useEffect(() => {
    if (!opened) return;
    const sParam = new URLSearchParams(window.location.search).get('s');
    if (sParam) {
      setTimeout(() => {
        const el = document.getElementById(`section-${sParam}`);
        if (el) el.scrollIntoView({ behavior: 'auto', block: 'start' });
      }, 50);
    }
  }, [opened]);

  const scrollToSection = (sectionId: ScreenId) => {
    stopAutoScroll();
    setActiveSection(sectionId);
    const el = document.getElementById(`section-${sectionId}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const toggleMusic = () => weddingAudio.toggle();

  return (
    <div className="w-full min-h-screen flex justify-center selection:bg-amber-100"
      style={{ background: '#f5eee6' }}>
      {/* ── COVER (Fixed Fullscreen Overlay giống HoangYen) ── */}
      {!opened && (
        <WeddingEnvelopeCover
          guestName={weddingInfo.guestName}
          onDone={handleEnvelopeDone}
        />
      )}

      <div
        ref={containerRef}
        className={`relative w-full max-w-[450px] th-font-sans bg-[#faf5ee] shadow-[0_10px_40px_rgba(0,0,0,0.06)] border-x min-h-screen pb-24 overflow-x-hidden ${
          opened ? 'th-content-reveal' : 'opacity-0'
        }`}
        style={{ borderColor: 'rgba(178,148,110,0.2)', color: '#3d2c1e' }}
      >

        {/* Falling Petals */}
        <FallingPetals enabled={petalsEnabled} />

        {/* ── FLOATING CONTROLS (top right - vertical stack) ── */}
        <div className="fixed top-4 left-1/2 -translate-x-1/2 w-full max-w-[450px] z-40 pointer-events-none px-3 sm:px-4 flex justify-end">
          <div className="flex flex-col items-center gap-2.5 pointer-events-auto">
            {/* Auto-scroll Toggle */}
            <button
              onClick={toggleAutoScroll}
              className="p-2 rounded-full backdrop-blur-md shadow-md border transition-all cursor-pointer flex items-center justify-center"
              style={isAutoScrolling
                ? { background: 'rgba(26,26,26,0.9)', color: '#ffffff', borderColor: 'rgba(255,255,255,0.6)' }
                : { background: 'rgba(250,245,238,0.92)', color: '#1a1a1a', borderColor: 'rgba(225,203,180,0.6)' }
              }
              title={isAutoScrolling ? 'Tạm dừng tự động cuộn' : 'Bật tự động cuộn'}
              aria-label="Bật/Tắt tự động cuộn"
            >
              {isAutoScrolling ? <Pause className="w-4 h-4 animate-pulse" /> : <ChevronsDown className="w-4 h-4 animate-bounce" />}
            </button>

            {/* Petals Toggle */}
            <button
              onClick={() => setPetalsEnabled(!petalsEnabled)}
              className="p-2 rounded-full backdrop-blur-md shadow-md border transition-all cursor-pointer"
              style={petalsEnabled
                ? { background: 'rgba(250,245,238,0.92)', color: '#8c7355', borderColor: 'rgba(225,203,180,0.6)' }
                : { background: 'rgba(250,245,238,0.7)', color: '#b0a090', borderColor: 'rgba(200,185,165,0.4)' }
              }
              title={petalsEnabled ? 'Tắt hiệu ứng cánh hoa' : 'Bật hiệu ứng cánh hoa'}
              aria-label="Bật/Tắt cánh hoa"
            >
              <Sparkles className="w-4 h-4" />
            </button>

            {/* Music Toggle */}
            <button
              onClick={toggleMusic}
              className="p-2 rounded-full backdrop-blur-md shadow-md border transition-all cursor-pointer"
              style={isPlayingMusic
                ? { background: 'rgba(26,26,26,0.85)', color: '#ffffff', borderColor: 'rgba(255,255,255,0.5)' }
                : { background: 'rgba(250,245,238,0.92)', color: '#4a4039', borderColor: 'rgba(225,203,180,0.5)' }
              }
              title={isPlayingMusic ? 'Tắt nhạc nền' : 'Bật nhạc đám cưới'}
              aria-label="Bật/Tắt nhạc cưới"
            >
              {isPlayingMusic ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* ── SECTION 1: BÌA THIỆP ── */}
        <section id="section-cover" className="relative w-full min-h-[100dvh] flex flex-col">
          <CoverScreen
            weddingInfo={weddingInfo}
            onExploreClick={() => scrollToSection('invitation')}
          />
        </section>

        {/* ── SECTION 2: LỜI NGỎ ── */}
        <section id="section-invitation" className="relative w-full border-t" style={{ borderColor: 'rgba(215,195,175,0.45)' }}>
          <InvitationDetailsScreen
            weddingInfo={weddingInfo}
            onGoToSchedule={() => scrollToSection('schedule')}
            onGoToGuestbook={() => scrollToSection('guestbook')}
          />
        </section>

        {/* ── SECTION 3: LỊCH TRÌNH ── */}
        <section id="section-schedule" className="relative w-full border-t" style={{ borderColor: 'rgba(215,195,175,0.45)' }}>
          <ScheduleScreen />
        </section>

        {/* ── SECTION 4: ĐẾM NGƯỢC ── */}
        <section id="section-countdown" className="relative w-full border-t" style={{ borderColor: 'rgba(215,195,175,0.45)' }}>
          <CountdownScreen targetDate={weddingInfo.weddingDate} />
        </section>

        {/* ── SECTION 5: ALBUM ẢNH ── */}
        <section id="section-gallery" className="relative w-full border-t" style={{ borderColor: 'rgba(215,195,175,0.45)' }}>
          <GalleryScreen />
        </section>

        {/* ── SECTION 6: SỔ LƯU BÚT ── */}
        <section id="section-guestbook" className="relative w-full border-t" style={{ borderColor: 'rgba(215,195,175,0.45)' }}>
          <GuestbookScreen guestName={weddingInfo.guestName} />
        </section>

        {/* ── FOOTER ── */}
        <footer className="w-full py-10 text-center border-t text-xs space-y-2 bg-[#f5ede3]/40"
          style={{ borderColor: 'rgba(215,195,175,0.45)', color: '#6d5a49' }}>
          <img
            src="/thoahai/Hoa7.png"
            alt="hoa điểm"
            className="w-9 h-auto mx-auto mb-1.5 opacity-80 pointer-events-none select-none drop-shadow-xs"
          />
          <div className="th-font-calligraphy text-3xl" style={{ color: '#1a1a1a' }}>
            {weddingInfo.groomName} &amp; {weddingInfo.brideName}
          </div>
          <p className="text-xs th-font-serif tracking-wider" style={{ color: '#4a4039' }}>
            29 · 10 · 2026 — Trân trọng cảm ơn quý khách
          </p>
        </footer>

        {/* ── NÚT CUỘN LÊN ĐẦU TRANG (MŨI TÊN TRỞ VỀ ĐẦU) ── */}
        <button
          onClick={() => {
            stopAutoScroll();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`th-scroll-top-btn ${showScrollTop ? 'show' : ''}`}
          title="Lên đầu trang"
          aria-label="Cuộn lên đầu trang"
        >
          <ChevronUp className="w-5 h-5 text-[#2b241e]" />
        </button>

        {/* ── NAVIGATION TAB BAR ── */}
        <NavigationTabBar
          activeScreen={activeSection}
          onSelectScreen={(screenId) => scrollToSection(screenId)}
        />
      </div>

    </div>
  );
}
