import React from "react";

export default function StatCard({ icon, label, value, isDate }) {
  return (
    <div className="bg-white border border-border-solid rounded py-6 px-7 relative overflow-hidden animate-[fadeUp_0.4s_ease_both] after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-gradient-to-r after:from-transparent after:via-gold after:to-transparent">
      <div className="absolute top-5 right-6 text-[1.4rem] opacity-30">{icon}</div>
      <div className="text-[0.7rem] tracking-[0.18em] uppercase text-muted mb-3 font-medium">{label}</div>
      <div 
        className="font-cormorant text-[3rem] font-light text-dark leading-none" 
        style={isDate ? { fontSize: "1.6rem", paddingTop: 8 } : {}}
      >
        {value}
      </div>
    </div>
  );
}
