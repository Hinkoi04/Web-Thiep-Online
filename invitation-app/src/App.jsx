import React from 'react';

const CARDS = [
  {
    href: '/Nhi/',
    emoji: '🎓',
    name: 'Nhi',
    desc: 'Thư mời tốt nghiệp',
    date: '2026',
    accent: '#c9a96e',
  },
  {
    href: '/HoangYen/',
    emoji: '🎓',
    name: 'Hoàng Yến',
    desc: 'Lễ Tốt Nghiệp · 19/09/2026',
    date: '2026',
    accent: '#c9a96e',
  },
];

export default function App() {
  return (
    <div style={pageStyle}>
      <div style={glowStyle} />
      <p style={subtitleStyle}>✦ THIỆP MỜI ✦</p>
      <h1 style={titleStyle}>Hệ Thống Thiệp Mời</h1>
      <div style={lineStyle} />
      <p style={descStyle}>Chọn một thiệp để xem</p>

      <div style={gridStyle}>
        {CARDS.map((card) => (
          <a key={card.href} href={card.href} style={cardBase} className="hy-landing-card">
            <div style={{ fontSize: '2.5rem', marginBottom: 14 }}>{card.emoji}</div>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.6rem', letterSpacing: 4, textTransform: 'uppercase', color: card.accent, marginBottom: 10, opacity: 0.85 }}>
              Thiệp Tốt Nghiệp
            </div>
            <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 'clamp(1.4rem, 4vw, 2rem)', color: '#f0e6d3', lineHeight: 1.2, marginBottom: 10 }}>
              {card.name}
            </div>
            <div style={{ width: 40, height: 1, background: `linear-gradient(90deg, transparent, ${card.accent}, transparent)`, margin: '0 auto 12px' }} />
            <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.72rem', color: '#a89070', letterSpacing: 1 }}>
              {card.desc}
            </div>
          </a>
        ))}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Outfit:wght@300;400;500;600;700&display=swap');
        body { margin: 0; background: #0e0b07; }
        .hy-landing-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .hy-landing-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 50px rgba(201,169,110,0.2) !important;
          border-color: rgba(201,169,110,0.4) !important;
        }
      `}</style>
    </div>
  );
}

const pageStyle = {
  minHeight: '100vh',
  background: 'radial-gradient(ellipse at 50% 0%, #1f1508 0%, #0e0b07 60%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '60px 20px',
  position: 'relative',
  overflow: 'hidden',
};

const glowStyle = {
  position: 'absolute',
  top: 0,
  left: '50%',
  transform: 'translateX(-50%)',
  width: 600,
  height: 300,
  background: 'radial-gradient(ellipse, rgba(201,169,110,0.12) 0%, transparent 70%)',
  pointerEvents: 'none',
};

const subtitleStyle = {
  fontFamily: 'Outfit, sans-serif',
  fontSize: '0.6rem',
  letterSpacing: 6,
  color: '#c9a96e',
  textTransform: 'uppercase',
  marginBottom: 16,
  opacity: 0.7,
};

const titleStyle = {
  fontFamily: '"Cormorant Garamond", serif',
  fontSize: 'clamp(2rem, 6vw, 3.2rem)',
  fontWeight: 300,
  color: '#f0e6d3',
  margin: '0 0 16px',
  letterSpacing: 1,
};

const lineStyle = {
  width: 80,
  height: 1,
  background: 'linear-gradient(90deg, transparent, #c9a96e, transparent)',
  margin: '0 auto 20px',
};

const descStyle = {
  fontFamily: 'Outfit, sans-serif',
  fontSize: '0.82rem',
  color: '#7a6a50',
  marginBottom: 48,
  letterSpacing: 1,
};

const gridStyle = {
  display: 'flex',
  gap: 24,
  flexWrap: 'wrap',
  justifyContent: 'center',
};

const cardBase = {
  display: 'block',
  padding: '36px 30px',
  background: 'linear-gradient(160deg, rgba(255,255,255,0.04) 0%, rgba(201,169,110,0.03) 100%)',
  border: '1px solid rgba(201,169,110,0.18)',
  borderRadius: 16,
  textDecoration: 'none',
  width: 200,
  textAlign: 'center',
  boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
  backdropFilter: 'blur(8px)',
  cursor: 'pointer',
};
