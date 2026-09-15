import React from "react";

export default function StatCard({ icon, label, value, isDate }) {
  return (
    <div className="bg-white border border-border-solid rounded-xl py-4 px-5 sm:py-5 sm:px-6 relative overflow-hidden shadow-xs animate-[fadeUp_0.4s_ease_both] after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-gradient-to-r after:from-transparent after:via-gold after:to-transparent">
      <div className="absolute top-4 right-5 text-xl sm:text-2xl opacity-30 select-none">
        {icon}
      </div>
      <div className="text-[0.65rem] sm:text-[0.7rem] tracking-[0.15em] uppercase text-muted mb-2 sm:mb-2.5 font-medium">
        {label}
      </div>
      <div
        className="font-cormorant text-2xl sm:text-3xl md:text-[2.6rem] font-medium text-dark leading-none"
        style={isDate ? { fontSize: "1.35rem", paddingTop: 4 } : {}}
      >
        {value}
      </div>
    </div>
  );
}
