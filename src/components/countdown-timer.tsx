"use client";

import { useEffect, useState } from "react";

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Set end time to midnight tonight
    const getEndTime = () => {
      const now = new Date();
      const end = new Date(now);
      end.setHours(23, 59, 59, 999);
      return end.getTime();
    };

    const update = () => {
      const diff = getEndTime() - Date.now();
      if (diff <= 0) return;
      setTimeLeft({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-3">
      <TimeBox value={timeLeft.hours} label="Giờ" />
      <span className="text-2xl font-bold text-foreground/50 animate-countdown-pulse">:</span>
      <TimeBox value={timeLeft.minutes} label="Phút" />
      <span className="text-2xl font-bold text-foreground/50 animate-countdown-pulse">:</span>
      <TimeBox value={timeLeft.seconds} label="Giây" />
    </div>
  );
}

function TimeBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="glass-panel rounded-xl w-20 h-20 flex items-center justify-center border border-border/50 shadow-lg">
        <span className="text-3xl font-bold text-foreground tabular-nums">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-[10px] text-muted-foreground mt-1.5 font-medium uppercase tracking-wider">{label}</span>
    </div>
  );
}
