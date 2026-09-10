import React, { useEffect, useRef } from "react";

export default function ParticlesCanvas({ active }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const particlesRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    function resize() {
      canvas.width = Math.min(430, window.innerWidth);
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    // Create particles once
    if (!particlesRef.current) {
      const particles = [];
      for (let i = 0; i < 40; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 2 + 0.5,
          vx: (Math.random() - 0.5) * 0.4,
          vy: -(Math.random() * 0.5 + 0.2),
          alpha: Math.random() * 0.6 + 0.2,
          color: `hsl(${38 + Math.random() * 10},70%,${60 + Math.random() * 20}%)`,
        });
      }
      particlesRef.current = particles;
    }

    function animate() {
      const particles = particlesRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      });
      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(animate);
    }

    if (active) {
      animate();
    }

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className={`nhi-particles-canvas${active ? " active" : ""}`}
    />
  );
}
