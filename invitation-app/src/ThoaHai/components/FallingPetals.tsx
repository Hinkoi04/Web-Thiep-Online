import React, { useEffect, useRef } from 'react';

interface FallingPetalsProps {
  enabled: boolean;
}

export const FallingPetals: React.FC<FallingPetalsProps> = ({ enabled }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled || !containerRef.current) return;
    const container = containerRef.current;

    // Beige / warm tone petals
    const petalColors = [
      'rgba(225,203,180,0.7)',
      'rgba(210,185,158,0.65)',
      'rgba(240,220,195,0.6)',
      'rgba(200,165,130,0.5)',
      'rgba(255,235,210,0.6)',
    ];

    const petals: HTMLDivElement[] = [];

    const createPetal = () => {
      const petal = document.createElement('div');
      const size = 6 + Math.random() * 10;
      petal.style.cssText = `
        position: fixed;
        width: ${size}px;
        height: ${size * 1.3}px;
        background: ${petalColors[Math.floor(Math.random() * petalColors.length)]};
        border-radius: 50% 0 50% 0;
        left: ${Math.random() * 100}vw;
        top: -20px;
        pointer-events: none;
        z-index: 5;
        animation: th-petalFall ${4 + Math.random() * 6}s linear ${Math.random() * 4}s forwards;
        transform: rotate(${Math.random() * 360}deg);
      `;
      container.appendChild(petal);
      petals.push(petal);
      setTimeout(() => {
        if (petal.parentNode) petal.parentNode.removeChild(petal);
        const idx = petals.indexOf(petal);
        if (idx > -1) petals.splice(idx, 1);
      }, 10000);
    };

    const interval = setInterval(createPetal, 500);
    for (let i = 0; i < 5; i++) setTimeout(createPetal, i * 200);

    return () => {
      clearInterval(interval);
      petals.forEach((p) => { if (p.parentNode) p.parentNode.removeChild(p); });
    };
  }, [enabled]);

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-5" aria-hidden="true" />;
};
