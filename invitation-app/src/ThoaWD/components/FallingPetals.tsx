import React, { useEffect, useState } from 'react';

interface Petal {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  rotate: number;
  drift: number;
  opacity: number;
  color: string;
}

interface FallingPetalsProps {
  enabled: boolean;
}

export const FallingPetals: React.FC<FallingPetalsProps> = ({ enabled }) => {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    if (!enabled) {
      setPetals([]);
      return;
    }

    const colors = [
      'rgba(192, 132, 252, 0.45)', // pastel purple / lilac
      'rgba(216, 180, 254, 0.55)', // soft lavender
      'rgba(233, 213, 255, 0.6)',  // light lilac
      'rgba(244, 114, 182, 0.35)', // blush rose accent
      'rgba(168, 85, 247, 0.35)',  // soft violet
    ];

    const generated: Petal[] = Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      left: Math.random() * 96,
      size: Math.floor(Math.random() * 9) + 9, // 9px - 18px
      duration: Math.random() * 5 + 6,        // 6s - 11s
      delay: Math.random() * 5,
      rotate: Math.random() * 360,
      drift: (Math.random() - 0.5) * 60,
      opacity: Math.random() * 0.4 + 0.3,
      color: colors[i % colors.length],
    }));

    setPetals(generated);
  }, [enabled]);

  if (!enabled || petals.length === 0) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden z-20"
      aria-hidden="true"
    >
      {petals.map((petal) => (
        <span
          key={petal.id}
          className="absolute block rounded-[50%_0_50%_50%]"
          style={{
            left: `${petal.left}%`,
            top: '-20px',
            width: `${petal.size}px`,
            height: `${petal.size * 1.3}px`,
            backgroundColor: petal.color,
            opacity: petal.opacity,
            transform: `rotate(${petal.rotate}deg)`,
            filter: 'blur(0.4px)',
            animation: `fallDown ${petal.duration}s linear infinite`,
            animationDelay: `${petal.delay}s`,
          }}
        />
      ))}

      <style>{`
        @keyframes fallDown {
          0% {
            transform: translateY(-20px) rotate(0deg) translateX(0px);
            opacity: 0;
          }
          15% {
            opacity: 0.8;
          }
          85% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(105vh) rotate(420deg) translateX(40px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
