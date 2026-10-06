"use client";

import React, { useState, useEffect } from "react";
import { Clock, AlertTriangle } from "lucide-react";

interface ElectionCountdownProps {
  endTime: string;
  onExpire?: () => void;
}

export function ElectionCountdown({ endTime, onExpire }: ElectionCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false });

  useEffect(() => {
    function calculate() {
      const difference = new Date(endTime).getTime() - Date.now();
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        if (onExpire) onExpire();
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    }

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [endTime, onExpire]);

  if (timeLeft.isExpired) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
        <AlertTriangle className="w-4 h-4" />
        <span>Voting Window Has Concluded</span>
      </div>
    );
  }

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className="flex items-center gap-2 text-center">
      <div className="flex items-center gap-1.5 text-xs text-slate-400 mr-1">
        <Clock className="w-3.5 h-3.5 text-blue-400" />
        <span className="font-semibold text-slate-300">Ends in:</span>
      </div>
      <div className="flex items-center gap-1 font-mono text-xs">
        <div className="bg-slate-900 border border-slate-800 px-2 py-1 rounded-lg">
          <span className="text-white font-bold">{pad(timeLeft.days)}</span>
          <span className="text-[9px] text-slate-500 ml-0.5">D</span>
        </div>
        <span className="text-slate-600 font-bold">:</span>
        <div className="bg-slate-900 border border-slate-800 px-2 py-1 rounded-lg">
          <span className="text-white font-bold">{pad(timeLeft.hours)}</span>
          <span className="text-[9px] text-slate-500 ml-0.5">H</span>
        </div>
        <span className="text-slate-600 font-bold">:</span>
        <div className="bg-slate-900 border border-slate-800 px-2 py-1 rounded-lg">
          <span className="text-white font-bold">{pad(timeLeft.minutes)}</span>
          <span className="text-[9px] text-slate-500 ml-0.5">M</span>
        </div>
        <span className="text-slate-600 font-bold">:</span>
        <div className="bg-slate-900 border border-slate-800 px-2 py-1 rounded-lg">
          <span className="text-blue-400 font-bold">{pad(timeLeft.seconds)}</span>
          <span className="text-[9px] text-slate-500 ml-0.5">S</span>
        </div>
      </div>
    </div>
  );
}
