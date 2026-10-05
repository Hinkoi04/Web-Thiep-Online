import { useState, useEffect, useRef, useCallback } from 'react';
import './Mau2.css';
import { initialWeddingInfo } from './data/weddingData';
import type { WeddingInfo } from './types';
import { weddingAudio } from './utils/audioPlayer';
import { WeddingEnvelopeCover } from './components/WeddingEnvelopeCover';
import { CoverScreen } from './components/screens/CoverScreen';
import { InvitationDetailsScreen } from './components/screens/InvitationDetailsScreen';
import { ScheduleScreen } from './components/screens/ScheduleScreen';
import { LoveStoryScreen } from './components/screens/LoveStoryScreen';
import { GalleryScreen } from './components/screens/GalleryScreen';
import { GuestbookScreen } from './components/screens/GuestbookScreen';
import { NavigationTabBar } from './components/NavigationTabBar';
import type { ScreenId } from './components/NavigationTabBar';
import { FallingPetals } from './components/FallingPetals';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';

export interface Mau2Props {
  defaultOpened?: boolean;
}

export default function Mau2({ defaultOpened = false }: Mau2Props) {
  const [opened, setOpened] = useState(defaultOpened);
  const [weddingInfo, setWeddingInfo] = useState<WeddingInfo>(initialWeddingInfo);
  const [activeSection, setActiveSection] = useState<ScreenId>('cover');
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [petalsEnabled, setPetalsEnabled] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);

  // Sync music state with audio player
  useEffect(() => {
    weddingAudio.setCallback((playing) => {
      setIsPlayingMusic(playing);
    });
    return () => {
      weddingAudio.pause();
    };
  }, []);

  // Parse custom guest from URL search params (e.g. ?guest=Anh+Hoang)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const guestParam = params.get('guest');
    if (guestParam) {
      setWeddingInfo((prev) => ({
        ...prev,
        guestName: decodeURIComponent(guestParam),
      }));
    }
  }, []);

  // Lock background scroll when cover is not opened yet
  useEffect(() => {
    if (!opened) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      const preventScroll = (e: Event) => {
        e.preventDefault();
      };

      window.addEventListener('wheel', preventScroll, { passive: false });
      window.addEventListener('touchmove', preventScroll, { passive: false });

      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
        window.removeEventListener('wheel', preventScroll);
        window.removeEventListener('touchmove', preventScroll);
      };
    }
  }, [opened]);

  const isAutoScrollingRef = useRef<boolean>(false);
  const autoScrollRafRef = useRef<number | null>(null);

  // Stop auto-scroll function
  const stopAutoScroll = useCallback(() => {
    if (isAutoScrollingRef.current) {
      isAutoScrollingRef.current = false;
      if (autoScrollRafRef.current !== null) {
        cancelAnimationFrame(autoScrollRafRef.current);
        autoScrollRafRef.current = null;
      }
    }
  }, []);

  // Listen for ANY user interaction to immediately stop auto-scroll
  useEffect(() => {
    const handleUserInteraction = () => {
      stopAutoScroll();
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

  // Handle Envelope Open Done & Start Smooth Continuous Auto-Scroll to the bottom
  const handleEnvelopeDone = useCallback(() => {
    setOpened(true);
    weddingAudio.play();

    // Start auto-scroll down smoothly after envelope transition
    setTimeout(() => {
      isAutoScrollingRef.current = true;
      let lastTime: number | null = null;
      // Scroll speed: ~55 pixels per second (smooth and readable)
      const scrollSpeed = 0.07;

      const scrollLoop = (time: number) => {
        if (!isAutoScrollingRef.current) return;

        if (lastTime !== null) {
          const delta = time - lastTime;
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
    }, 800);
  }, [stopAutoScroll]);

  // Track active section on scroll
  useEffect(() => {
    if (!opened) return;
    const handleScroll = () => {
      const sectionIds: ScreenId[] = ['cover', 'invitation', 'schedule', 'story', 'gallery', 'guestbook'];
      const scrollPos = window.scrollY + 200;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(`section-${sectionIds[i]}`);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sectionIds[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [opened]);

  // Smooth scroll to target section
  const scrollToSection = (sectionId: ScreenId) => {
    stopAutoScroll();
    setActiveSection(sectionId);
    const el = document.getElementById(`section-${sectionId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const toggleMusic = () => {
    weddingAudio.toggle();
  };

  return (
    <div className="w-full min-h-screen bg-[#181122] flex justify-center selection:bg-purple-200">
      <div
        ref={containerRef}
        className={`relative w-full max-w-[450px] font-sans text-[#300f47] bg-[#faf6fe] shadow-[0_0_80px_rgba(0,0,0,0.6)] border-x border-[#3b1554]/15 ${
          !opened ? 'h-[100dvh] overflow-hidden' : 'min-h-screen pb-24 overflow-x-hidden'
        }`}
      >
        {/* ── INTERACTIVE OPENING ENVELOPE COVER ── */}
        {!opened && (
          <WeddingEnvelopeCover
            guestName={weddingInfo.guestName}
            onDone={handleEnvelopeDone}
          />
        )}

        {/* Falling Petals Particle Layer */}
        <FallingPetals enabled={petalsEnabled} />

        {/* Floating Quick Action Controls (Top Right of mobile frame) */}
        <div className="fixed top-4 left-1/2 -translate-x-1/2 w-full max-w-[450px] z-40 pointer-events-none px-3 sm:px-4 flex justify-end">
          <div className="flex items-center gap-2 pointer-events-auto">
            {/* Petals Toggle Pill */}
            <button
              onClick={() => setPetalsEnabled(!petalsEnabled)}
              className={`p-2 rounded-full backdrop-blur-md shadow-md border transition-all cursor-pointer ${
                petalsEnabled
                  ? 'bg-white/90 text-purple-600 border-purple-200'
                  : 'bg-white/70 text-slate-400 border-slate-200 hover:text-slate-600'
              }`}
              title={petalsEnabled ? 'Tắt hiệu ứng cánh hoa' : 'Bật hiệu ứng cánh hoa'}
              aria-label="Bật/Tắt cánh hoa"
            >
              <Sparkles className="w-4 h-4" />
            </button>

            {/* Music Toggle Pill */}
            <button
              onClick={toggleMusic}
              className={`p-2 rounded-full backdrop-blur-md shadow-md border transition-all cursor-pointer ${
                isPlayingMusic
                  ? 'bg-[#4a1d6d] text-amber-200 border-[#6b2a9e] animate-spin-slow'
                  : 'bg-white/90 text-slate-600 border-slate-200 hover:bg-white'
              }`}
              title={isPlayingMusic ? 'Tắt nhạc nền' : 'Bật nhạc đám cưới'}
              aria-label="Bật/Tắt nhạc cưới"
            >
              {isPlayingMusic ? (
                <Volume2 className="w-4 h-4 text-amber-300" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* ── SECTION 1: COVER SCREEN ── */}
        <section id="section-cover" className="relative w-full min-h-[100dvh] flex flex-col">
          <CoverScreen
            weddingInfo={weddingInfo}
            onExploreClick={() => scrollToSection('invitation')}
            isPlayingMusic={isPlayingMusic}
            onToggleMusic={toggleMusic}
          />
        </section>

        {/* ── SECTION 2: INVITATION DETAILS ── */}
        <section id="section-invitation" className="relative w-full border-t border-[#e2d3f2]">
          <InvitationDetailsScreen
            weddingInfo={weddingInfo}
            onGoToSchedule={() => scrollToSection('schedule')}
            onGoToGuestbook={() => scrollToSection('guestbook')}
          />
        </section>

        {/* ── SECTION 3: WEDDING SCHEDULE ── */}
        <section id="section-schedule" className="relative w-full border-t border-[#e2d3f2]">
          <ScheduleScreen />
        </section>

        {/* ── SECTION 4: LOVE STORY & COUNTDOWN ── */}
        <section id="section-story" className="relative w-full border-t border-[#e2d3f2]">
          <LoveStoryScreen targetDate={weddingInfo.weddingDate} />
        </section>

        {/* ── SECTION 5: PHOTO GALLERY ── */}
        <section id="section-gallery" className="relative w-full border-t border-[#e2d3f2]">
          <GalleryScreen />
        </section>

        {/* ── SECTION 6: GUESTBOOK ── */}
        <section id="section-guestbook" className="relative w-full border-t border-[#e2d3f2]">
          <GuestbookScreen />
        </section>

        {/* Romantic Footer */}
        <footer className="w-full py-10 text-center bg-[#f4eafc] border-t border-[#e2d3f2] text-xs text-purple-700 space-y-2">
          <div className="font-calligraphy text-3xl text-[#3b1554]">
            {weddingInfo.groomName} & {weddingInfo.brideName}
          </div>
          <p className="text-xs text-[#7c4a9e] font-serif tracking-wider">
            28 · 03 · 2026 — Trân trọng cảm ơn quý khách
          </p>
        </footer>

        {/* Fixed Floating Bottom Tab Bar Navigation */}
        <NavigationTabBar
          activeScreen={activeSection}
          onSelectScreen={(screenId) => scrollToSection(screenId)}
        />
      </div>
    </div>
  );
}
