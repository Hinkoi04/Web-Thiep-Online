import type { WeddingInfo } from '../../types';
import { weddingImages } from '../../data/weddingData';
import { useInView } from '../../hooks/useInView';

interface CoverScreenProps {
  weddingInfo: WeddingInfo;
  isOpened?: boolean;
  onExploreClick?: () => void;
}

export const CoverScreen: React.FC<CoverScreenProps> = ({
  weddingInfo,
  isOpened = false,
}) => {
  const { ref: heroRef, isInView: heroInView } = useInView({ threshold: 0.05, enabled: isOpened });
  const { ref: quoteRef, isInView: quoteInView } = useInView({ threshold: 0.08, enabled: isOpened });
  const { ref: stripRef, isInView: stripInView } = useInView({ threshold: 0.08, enabled: isOpened });
  const { ref: calRef, isInView: calInView } = useInView({ threshold: 0.08, enabled: isOpened });
  const { ref: parentsRef, isInView: parentsInView } = useInView({ threshold: 0.08, enabled: isOpened });

  // October 2026: 1/10/2026 is Thursday (THU)
  // Calendar row array (Monday = col 0)
  const calendarRows = [
    [null, null, null, 1, 2, 3, 4],
    [5, 6, 7, 8, 9, 10, 11],
    [12, 13, 14, 15, 16, 17, 18],
    [19, 20, 21, 22, 23, 24, 25],
    [26, 27, 28, 29, 30, 31, null],
  ];

  return (
    <div className="relative w-full flex flex-col bg-[#faf5ee] text-[#3d2c1e] select-none overflow-hidden">
      {/* ── 1. HERO PHOTO OVERLAY (SAVE THE DATE) ── */}
      <div
        ref={heroRef}
        className={`relative w-full overflow-hidden th-reveal-init th-reveal-scale ${heroInView ? 'th-reveal-active' : ''
          }`}
      >
        <div className="relative w-full" style={{ height: '66vh', minHeight: '500px', maxHeight: '660px' }}>
          <img
            src={weddingImages.coverPhoto}
            alt="Ảnh cưới Hoàng Hải & Yến Thoa"
            className="w-full h-full object-cover object-[center_20%]"
            loading="eager"
          />
          {/* Soft dark overlay for contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-black/25 pointer-events-none" />

          {/* Typography "SAVE the DATE" dạng hình ảnh HoangHaiYenThoa.png */}
          <div className="absolute bottom-8 left-5 right-5 z-20 text-white text-left overflow-hidden">
            {/* Hình SAVE the DATE xuất hiện mượt mà */}
            <div
              className={`transition-all duration-[2800ms] cubic-bezier(0.16, 1, 0.3, 1) ${heroInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'
                }`}
              style={{
                transitionDelay: heroInView ? '400ms' : '0ms',
              }}
            >
              <img
                src="/thoahai/name/HoangHaiYenThoa.png"
                alt="Save the Date"
                className="w-48 sm:w-56 max-w-[75vw] h-auto object-contain select-none pointer-events-none drop-shadow-[0_4px_14px_rgba(0,0,0,0.85)]"
              />
            </div>

            {/* Tên Chú Rể & Cô Dâu: chạy từ dưới lên chậm rãi */}
            <div
              className={`th-font-calligraphy text-3xl sm:text-4xl mt-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] text-white font-normal transition-all duration-[3200ms] cubic-bezier(0.16, 1, 0.3, 1) ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              style={{
                fontFamily: "'Pinyon Script', cursive",
                transitionDelay: heroInView ? '1400ms' : '0ms',
              }}
            >
              {weddingInfo.groomName} &amp; {weddingInfo.brideName}
            </div>
          </div>

          {/* Bottom fade into pure beige */}
          <div
            className="absolute inset-x-0 bottom-0 pointer-events-none"
            style={{
              height: '4.5rem',
              background: 'linear-gradient(to top, #faf5ee 0%, rgba(250,245,238,0.7) 45%, transparent 100%)',
            }}
          />
        </div>
      </div>

      {/* ── 2. MONOGRAM & ENGLISH QUOTE ── */}
      <div
        ref={quoteRef}
        className="pt-6 pb-4 px-6 text-center space-y-3 bg-[#faf5ee] overflow-hidden"
      >
        {/* Logo H&T hiện lên từ từ */}
        <div
          className={`flex justify-center items-center transition-all duration-[2600ms] cubic-bezier(0.16, 1, 0.3, 1) ${quoteInView ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`}
          style={{ transitionDelay: quoteInView ? '200ms' : '0ms' }}
        >
          <div className="relative flex items-center justify-center">
            <img
              src="https://res.cloudinary.com/dlxbhq8pw/image/upload/v1791993243/copy_of_logoht_wx0cth.png"
              alt="Logo H&T"
              className="w-20 sm:w-24 h-auto object-contain select-none pointer-events-none drop-shadow-xs"
            />
          </div>
        </div>

        {/* Điểm hoa Hoa1 giữa Monogram và Trích dẫn */}
        <div
          className={`flex justify-center items-center my-0.5 transition-all duration-[2400ms] cubic-bezier(0.16, 1, 0.3, 1) ${quoteInView ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}
          style={{ transitionDelay: quoteInView ? '500ms' : '0ms' }}
        >
          <img
            src="/thoahai/Hoa1.png"
            alt="hoa điểm"
            className="w-11 h-auto object-contain opacity-90 drop-shadow-xs pointer-events-none select-none"
          />
        </div>

        {/* English quote: chạy từ dưới lên */}
        <p
          className={`text-xs sm:text-[13px] leading-relaxed max-w-xs mx-auto italic transition-all duration-[2800ms] cubic-bezier(0.16, 1, 0.3, 1) ${quoteInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          style={{
            color: '#4a4039',
            fontFamily: "'Playfair Display', Georgia, serif",
            transitionDelay: quoteInView ? '800ms' : '0ms',
          }}
        >
          Một lời hẹn ước, một hành trình mới <br /> và một ngày thật đặc biệt.
        </p>
      </div>

      {/* ── 3. THREE PHOTOS WITH NUMBERS (29 · 10 · 26) ── */}
      <div
        ref={stripRef}
        className="px-3 py-3 bg-[#faf5ee] overflow-hidden"
      >
        <div className="grid grid-cols-3 gap-1.5 overflow-hidden">
          {/* Photo 1 (chạy vào từ bên trái) */}
          <div
            className={`relative overflow-hidden rounded-md shadow-xs transition-all duration-[2600ms] cubic-bezier(0.16, 1, 0.3, 1) ${stripInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
              }`}
            style={{
              aspectRatio: '3/4',
              background: '#f0e8dc',
              transitionDelay: stripInView ? '200ms' : '0ms',
            }}
          >
            <img
              src={weddingImages.stripPhotos[0]}
              alt="Ảnh cưới 1"
              className="w-full h-full object-cover object-center"
              loading="lazy"
            />
          </div>

          {/* Photo 2 (hiện lên từ dưới lên) */}
          <div
            className={`relative overflow-hidden rounded-md shadow-xs transition-all duration-[2600ms] cubic-bezier(0.16, 1, 0.3, 1) ${stripInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
              }`}
            style={{
              aspectRatio: '3/4',
              background: '#f0e8dc',
              transitionDelay: stripInView ? '500ms' : '0ms',
            }}
          >
            <img
              src={weddingImages.stripPhotos[1]}
              alt="Ảnh cưới 2"
              className="w-full h-full object-cover object-center"
              loading="lazy"
            />
          </div>

          {/* Photo 3 (chạy vào từ bên phải) */}
          <div
            className={`relative overflow-hidden rounded-md shadow-xs transition-all duration-[2600ms] cubic-bezier(0.16, 1, 0.3, 1) ${stripInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
              }`}
            style={{
              aspectRatio: '3/4',
              background: '#f0e8dc',
              transitionDelay: stripInView ? '800ms' : '0ms',
            }}
          >
            <img
              src={weddingImages.stripPhotos[2]}
              alt="Ảnh cưới 3"
              className="w-full h-full object-cover object-center"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      {/* ── 4. OCTOBER CALENDAR (KHUNG LỊCH XUẤT HIỆN TRƯỚC, SAU ĐÓ CÁC NGÀY HIỂN THỊ TỪ TỪ) ── */}
      <div
        ref={calRef}
        className="px-5 pt-3 pb-4 bg-[#faf5ee] text-center"
      >
        <div className="relative max-w-[325px] mx-auto">
          {/* Điểm hoa Hoa5 ở góc trên khung lịch */}
          <img
            src="/thoahai/Hoa5.png"
            alt="hoa điểm lịch"
            className="absolute -top-5 -right-3 w-12 h-auto pointer-events-none select-none opacity-85 z-10 drop-shadow-xs"
          />

          {/* Khung lịch viền thanh lịch xuất hiện trước */}
          <div
            className={`w-full p-4 sm:p-5 rounded-2xl border border-[#d8c7b3] bg-[#f5ede3]/60 shadow-xs transition-all duration-[2000ms] cubic-bezier(0.16, 1, 0.3, 1) ${calInView ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-6'
              }`}
          >
            {/* Title: October in Pinyon Script */}
            <h3
              className={`text-4xl sm:text-5xl font-normal mb-2.5 transition-all duration-[2200ms] cubic-bezier(0.16, 1, 0.3, 1) ${calInView ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'
                }`}
              style={{ color: '#1a1a1a', fontFamily: "'Pinyon Script', cursive" }}
            >
              October
            </h3>

            {/* Weekday headers: MON - SUN */}
            <div
              className={`grid grid-cols-7 gap-1 text-[11px] font-medium tracking-wider mb-3 text-[#6d5a49] border-b border-[#d8c7b3]/70 pb-2 transition-all duration-[1800ms] delay-200 cubic-bezier(0.16, 1, 0.3, 1) ${calInView ? 'opacity-100' : 'opacity-0'
                }`}
            >
              <span>MON</span>
              <span>TUE</span>
              <span>WED</span>
              <span>THU</span>
              <span>FRI</span>
              <span>SAT</span>
              <span>SUN</span>
            </div>

            {/* Calendar Grid: Các ngày xuất hiện từ từ sau khi khung lịch đã hiển thị */}
            <div className="grid grid-cols-7 gap-y-2 gap-x-1 text-xs">
              {calendarRows.flat().map((day, idx) => {
                if (day === null) {
                  return <div key={idx} className="h-7 w-7 mx-auto" />;
                }
                const isEventDay = day === 29;
                const staggerDelay = calInView ? `${700 + day * 65}ms` : '0ms';

                return (
                  <div
                    key={idx}
                    className={`h-7 w-7 mx-auto flex items-center justify-center transition-all duration-[1200ms] cubic-bezier(0.16, 1, 0.3, 1) ${calInView
                      ? 'opacity-100 scale-100 translate-y-0'
                      : 'opacity-0 scale-50 translate-y-2'
                      }`}
                    style={{ transitionDelay: staggerDelay }}
                  >
                    {isEventDay ? (
                      <div
                        className="relative w-7 h-7 flex items-center justify-center animate-pulse"
                        title="Ngày diễn ra đám cưới: 29/10/2026"
                      >
                        {/* Red heart icon */}
                        <svg viewBox="0 0 24 24" className="w-7 h-7 absolute inset-0 text-[#d32f2f] drop-shadow-xs" fill="currentColor">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                        <span className="relative z-10 text-[10px] font-bold text-white leading-none mt-0.5">
                          29
                        </span>
                      </div>
                    ) : (
                      <span className="text-[#333333] font-normal">{day}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── 5. PARENTS SECTION (TỪNG DÒNG CHẠY VÀO XEN KẼ NHAU & ĐIỂM HOA) ── */}
      <div
        ref={parentsRef}
        className="px-5 pt-1 pb-6 bg-[#faf5ee] text-center overflow-hidden"
      >
        {/* Điểm hoa Hoa6 (nhánh hoa trái tim) */}
        <div
          className={`transition-all duration-[2000ms] cubic-bezier(0.16, 1, 0.3, 1) ${parentsInView ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}
        >
          <img
            src="/thoahai/Hoa6.png"
            alt="hoa điểm"
            className="w-10 h-auto mx-auto object-contain my-2 opacity-90 drop-shadow-xs pointer-events-none select-none"
          />
        </div>

        {/* Parents 2 Columns with line-by-line alternating entrance */}
        <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto text-center pt-2 overflow-hidden">
          {/* CỘT NHÀ GÁI (BÊN TRÁI) */}
          <div className="space-y-1.5 overflow-hidden">
            {/* Dòng 1: Tiêu đề NHÀ GÁI (chạy từ trái vào) */}
            <h4
              className={`text-xs font-bold uppercase tracking-widest transition-all duration-[2400ms] cubic-bezier(0.16, 1, 0.3, 1) ${parentsInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
                }`}
              style={{
                color: '#1a1a1a',
                fontFamily: "'Playfair Display', serif",
                transitionDelay: parentsInView ? '200ms' : '0ms',
              }}
            >
              NHÀ GÁI
            </h4>

            {/* Dòng 2: Ba (chạy từ trái vào, chừa dòng nếu rỗng) */}
            <p
              className={`text-xs leading-snug transition-all duration-[2400ms] cubic-bezier(0.16, 1, 0.3, 1) min-h-[1.15rem] ${parentsInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
                }`}
              style={{
                color: '#4a4039',
                transitionDelay: parentsInView ? '800ms' : '0ms',
              }}
            >
              {weddingInfo.brideParents.father ? `Ba: ${weddingInfo.brideParents.father}` : '\u00A0'}
            </p>

            {/* Dòng 3: Mẹ (chạy từ trái vào, chừa dòng nếu rỗng) */}
            <p
              className={`text-xs leading-snug transition-all duration-[2400ms] cubic-bezier(0.16, 1, 0.3, 1) min-h-[1.15rem] ${parentsInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
                }`}
              style={{
                color: '#4a4039',
                transitionDelay: parentsInView ? '1400ms' : '0ms',
              }}
            >
              {weddingInfo.brideParents.mother ? `Mẹ: ${weddingInfo.brideParents.mother}` : '\u00A0'}
            </p>

            {/* Dòng 4: Địa chỉ Nhà Gái */}
            <p
              className={`text-[11px] text-[#6d5a49] italic transition-all duration-[2400ms] cubic-bezier(0.16, 1, 0.3, 1) ${parentsInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
                }`}
              style={{
                transitionDelay: parentsInView ? '1800ms' : '0ms',
              }}
            >
              Xã An Phú, Quảng Ngãi
            </p>
          </div>

          {/* CỘT NHÀ TRAI (BÊN PHẢI) */}
          <div className="space-y-1.5 overflow-hidden">
            {/* Dòng 1: Tiêu đề NHÀ TRAI (chạy từ phải vào) */}
            <h4
              className={`text-xs font-bold uppercase tracking-widest transition-all duration-[2400ms] cubic-bezier(0.16, 1, 0.3, 1) ${parentsInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
                }`}
              style={{
                color: '#1a1a1a',
                fontFamily: "'Playfair Display', serif",
                transitionDelay: parentsInView ? '500ms' : '0ms',
              }}
            >
              NHÀ TRAI
            </h4>

            {/* Dòng 2: Ba (nếu rỗng thì vẫn chừa dòng trống để cân đối) */}
            <p
              className={`text-xs leading-snug transition-all duration-[2400ms] cubic-bezier(0.16, 1, 0.3, 1) min-h-[1.15rem] ${parentsInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
                }`}
              style={{
                color: '#4a4039',
                transitionDelay: parentsInView ? '1100ms' : '0ms',
              }}
            >
              {weddingInfo.groomParents.father ? `Ba: ${weddingInfo.groomParents.father}` : '\u00A0'}
            </p>

            {/* Dòng 3: Mẹ (chạy từ phải vào, chừa dòng nếu rỗng) */}
            <p
              className={`text-xs leading-snug transition-all duration-[2400ms] cubic-bezier(0.16, 1, 0.3, 1) min-h-[1.15rem] ${parentsInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
                }`}
              style={{
                color: '#4a4039',
                transitionDelay: parentsInView ? '1700ms' : '0ms',
              }}
            >
              {weddingInfo.groomParents.mother ? `Mẹ: ${weddingInfo.groomParents.mother}` : '\u00A0'}
            </p>

            {/* Dòng 4: Địa chỉ Nhà Trai */}
            <p
              className={`text-[11px] text-[#6d5a49] italic transition-all duration-[2400ms] cubic-bezier(0.16, 1, 0.3, 1) ${parentsInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
                }`}
              style={{
                transitionDelay: parentsInView ? '2100ms' : '0ms',
              }}
            >
              Xã An Phú, Quảng Ngãi
            </p>
          </div>
        </div>

        {/* Điểm hoa Hoa2 (dải hoa thân cao) ở chân trang bìa */}
        <div className="flex justify-center pt-5 pb-1">
          <img
            src="/thoahai/Hoa2.png"
            alt="hoa điểm chân trang bìa"
            className="w-28 h-auto object-contain opacity-80 pointer-events-none select-none"
          />
        </div>
      </div>
    </div>
  );
};
