import React, { useMemo } from "react";

export default function BokehEffect({ count = 12 }) {
  const bokehs = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const sz = 20 + Math.random() * 60;
      return {
        key: i,
        size: sz,
        left: `${Math.random() * 100}%`,
        bottom: `-${sz}px`,
        duration: `${6 + Math.random() * 8}s`,
        delay: `${Math.random() * 6}s`,
      };
    });
  }, [count]);

  return (
    <div className="nhi-bokeh-wrap">
      {bokehs.map((b) => (
        <div
          key={b.key}
          className="nhi-bokeh"
          style={{
            width: b.size,
            height: b.size,
            left: b.left,
            bottom: b.bottom,
            animationDuration: b.duration,
            animationDelay: b.delay,
          }}
        />
      ))}
    </div>
  );
}
