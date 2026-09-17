import { useState, useEffect } from "react";

export function pad(n) {
  return String(n).padStart(2, "0");
}

export function useCountdown(targetDate, targetTime) {
  const [cd, setCd] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, over: false });
  useEffect(() => {
    const target = new Date(`${targetDate}T${targetTime}:00`).getTime();
    function tick() {
      const diff = target - Date.now();
      if (diff <= 0) { setCd({ days: 0, hours: 0, minutes: 0, seconds: 0, over: true }); return; }
      setCd({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
        over: false,
      });
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate, targetTime]);
  return cd;
}

export function buildCalendar(dateStr) {
  const d = new Date(dateStr);
  const year = d.getFullYear(), month = d.getMonth();
  const eventDay = d.getDate();
  const first = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const offset = (first + 6) % 7; // Mon-first
  const cells = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let i = 1; i <= days; i++) cells.push(i);
  while (cells.length % 7 !== 0) cells.push(null);
  const rows = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
  const weekdays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
  const monthNames = ["Tháng 1","Tháng 2","Tháng 3","Tháng 4","Tháng 5","Tháng 6","Tháng 7","Tháng 8","Tháng 9","Tháng 10","Tháng 11","Tháng 12"];
  const dayOfWeekNames = ["Chủ nhật","Thứ hai","Thứ ba","Thứ tư","Thứ năm","Thứ sáu","Thứ bảy"];
  return { rows, weekdays, eventDay, monthLabel: monthNames[month], year, dayOfWeekLabel: dayOfWeekNames[d.getDay()] };
}
