"use client";

import React from "react";
import { Play, Square, Pencil } from "lucide-react";

interface ShiftTimerCardProps {
  roundNumber: number;
  timerSeconds: number;
  isRunning: boolean;
  onStartShift: () => void;
  onEndShift: () => void;
  onForgotStart: () => void;
}

export const ShiftTimerCard: React.FC<ShiftTimerCardProps> = ({
  roundNumber,
  timerSeconds,
  isRunning,
  onStartShift,
  onEndShift,
  onForgotStart,
}) => {
  // Format seconds to HH:MM:SS
  const formatTimer = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0",
    )}:${String(seconds).padStart(2, "0")}`;
  };

  const getOrdinal = (n: number) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 sm:p-7 font-manrope flex flex-col justify-between min-h-[380px] hover:border-[#CBD5E1] transition-all">
      {/* Top Header */}
      <div>
        <h2 className="text-base sm:text-lg font-bold text-[#1E293B]">
          Start Round {roundNumber}
        </h2>
        <p className="text-xs text-[#94A3B8] font-medium mt-0.5">
          Timer automatico - start &amp; stop
        </p>
      </div>

      {/* Center Timer Display */}
      <div className="my-8 flex flex-col items-center justify-center text-center">
        <div className="text-5xl sm:text-6xl font-extrabold font-mono tracking-wider text-[#A67C52] drop-shadow-sm select-none">
          {formatTimer(timerSeconds)}
        </div>

        {/* Status Line */}
        <div className="mt-4 flex items-center justify-center gap-2">
          {isRunning ? (
            <>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10B981]"></span>
              </span>
              <span className="text-xs sm:text-[13px] font-semibold text-[#10B981]">
                {getOrdinal(roundNumber)} Round in progress...
              </span>
            </>
          ) : (
            <>
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#CBD5E1]" />
              <span className="text-xs sm:text-[13px] font-medium text-[#94A3B8]">
                Ready to start shift
              </span>
            </>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 w-full">
        {isRunning ? (
          <button
            type="button"
            onClick={onEndShift}
            className="w-full flex items-center justify-center gap-2.5 bg-[#DC2626] hover:bg-[#B91C1C] active:scale-[0.99] text-white py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide shadow-md shadow-[#DC2626]/20 transition-all cursor-pointer"
          >
            <Square className="w-4 h-4 fill-white text-white" />
            <span>END OF SHIFT</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onStartShift}
            className="w-full flex items-center justify-center gap-2.5 bg-[#10B981] hover:bg-[#059669] active:scale-[0.99] text-white py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide shadow-md shadow-[#10B981]/20 transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white text-white" />
            <span>START ROUND {roundNumber}</span>
          </button>
        )}

        <button
          type="button"
          onClick={onForgotStart}
          className="w-full flex items-center justify-center gap-2 border border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-[#F8FAFC] text-[#475569] hover:text-[#1E293B] py-3 px-5 rounded-xl font-bold text-xs uppercase tracking-wide transition-all cursor-pointer"
        >
          <Pencil className="w-3.5 h-3.5 text-[#64748B]" />
          <span>I FORGOT TO START THE SHIFT</span>
        </button>
      </div>
    </div>
  );
};

export default ShiftTimerCard;
