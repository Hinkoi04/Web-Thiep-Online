import React from "react";

export default function StatCard({ icon, label, value, isDate = false }) {
  return (
    <div className="bg-white rounded-xl border border-pink-100 p-4 sm:p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-12 h-12 rounded-xl bg-pink-50 border border-pink-200 flex items-center justify-center text-2xl shrink-0">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider font-sans mb-0.5">
          {label}
        </div>
        <div className={`font-bold text-[#4a2e3b] ${isDate ? "text-base sm:text-lg truncate" : "text-2xl sm:text-3xl"}`}>
          {value}
        </div>
      </div>
    </div>
  );
}
