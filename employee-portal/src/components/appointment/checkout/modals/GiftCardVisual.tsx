"use client";

import React from "react";
import { GiftCardVisualProps } from "../types";

export default function GiftCardVisual({ card, selected }: GiftCardVisualProps) {
  return (
    <div
      className={`rounded-xl border-2 cursor-pointer transition-all overflow-hidden ${
        selected ? "border-[#635BFF]" : "border-[#EFF4FA]"
      }`}
    >
      <div
        className="h-36 w-full flex flex-col justify-between p-3.5 relative"
        style={{ background: card.bg }}
      >
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded bg-white/25 flex items-center justify-center">
            <span
              style={{
                fontSize: 9,
                color: card.type === "vip" ? "#7a5c1e" : "#fff",
              }}
            >
              M
            </span>
          </div>
          <span
            className="text-xs font-bold"
            style={{
              color: card.type === "vip" ? "rgba(90,60,10,0.8)" : "rgba(255,255,255,0.9)",
            }}
          >
            Your logo
          </span>
        </div>

        {card.type === "colored" ? (
          <div>
            <p className="text-2xl font-extrabold text-white drop-shadow">€ 200</p>
            <p className="text-xs text-white/70">Gift Card</p>
          </div>
        ) : (
          <div className="self-end">
            <div className="w-12 h-12 rounded-full border-2 border-[#c8a04a] bg-[#f0ddb0]/80 flex items-center justify-center">
              <span className="text-xs font-bold text-[#7a5c1e]">VIP</span>
            </div>
          </div>
        )}
      </div>

      <div className="px-3 py-2.5 bg-white">
        <p className="text-sm font-semibold text-[#29343D]">{card.name}</p>
        <p className="text-xs text-[#98A4AE]">{card.code}</p>
      </div>
    </div>
  );
}
export { GiftCardVisual };
