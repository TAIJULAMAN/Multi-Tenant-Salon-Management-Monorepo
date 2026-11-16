"use client";

import React from "react";
import { row1CardsData, row2CardsData } from "./data";

export default function OverviewStatCards() {
  const getCardColor = (iconBg: string) => {
    if (iconBg.includes("F8C209")) return { gradientColor: "#F8C209", bgClass: "border-[#F8C209]/20" };
    if (iconBg.includes("10B981") || iconBg.includes("22C55E")) return { gradientColor: "#10B981", bgClass: "border-[#10B981]/20" };
    if (iconBg.includes("14B8A6") || iconBg.includes("00D0C7")) return { gradientColor: "#14B8A6", bgClass: "border-[#14B8A6]/20" };
    if (iconBg.includes("F43F5E") || iconBg.includes("FF5656")) return { gradientColor: "#F43F5E", bgClass: "border-[#F43F5E]/20" };
    return { gradientColor: "#635BFF", bgClass: "border-[#635BFF]/20" };
  };

  return (
    <div className="space-y-6">
      {/* Row 1: Sparkline Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {row1CardsData.map((card) => {
          const config = getCardColor(card.iconBg);
          return (
            <div
              key={card.id}
              className={`relative flex flex-col justify-between overflow-hidden rounded-2xl border p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${config.bgClass}`}
              style={{
                background: `linear-gradient(180deg, ${config.gradientColor}15 0%, ${config.gradientColor}05 100%)`,
              }}
            >
              <div>
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl overflow-hidden shadow-sm text-white" style={{ backgroundColor: config.gradientColor }}>
                    <card.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg font-semibold text-slate-700 tracking-tight leading-snug">
                    {card.title}
                  </span>
                </div>
                <div className="mt-8">
                  <h3 className="text-2xl font-semibold tracking-tight text-slate-800 leading-none">
                    {card.value}
                  </h3>
                </div>
              </div>
              {card.change && (
                <div className="mt-4 flex flex-col gap-1">
                  <span className="text-xs font-medium text-slate-500">
                    {card.change}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Row 2: Sparkline Stat Cards + Complex Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {row2CardsData.map((card) => {
          const config = getCardColor(card.iconBg);

          if (card.type === "sparkline") {
            return (
              <div
                key={card.id}
                className={`relative flex flex-col justify-between overflow-hidden rounded-2xl border p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${config.bgClass}`}
                style={{
                  background: `linear-gradient(180deg, ${config.gradientColor}15 0%, ${config.gradientColor}05 100%)`,
                }}
              >
                <div>
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl overflow-hidden shadow-sm text-white" style={{ backgroundColor: config.gradientColor }}>
                      <card.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg font-semibold text-slate-700 tracking-tight leading-snug">
                      {card.title}
                    </span>
                  </div>
                  <div className="mt-8">
                    <h3 className="text-2xl font-semibold tracking-tight text-slate-800 leading-none">
                      {card.value}
                    </h3>
                  </div>
                </div>
                {card.change && (
                  <div className="mt-4 flex flex-col gap-1">
                    <span className="text-xs font-medium text-slate-500">
                      {card.change}
                    </span>
                  </div>
                )}
              </div>
            );
          } else if (card.type === "inactive") {
            return (
              <div
                key={card.id}
                className={`relative flex flex-col justify-between overflow-hidden rounded-2xl border p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${config.bgClass}`}
                style={{
                  background: `linear-gradient(180deg, ${config.gradientColor}15 0%, ${config.gradientColor}05 100%)`,
                }}
              >
                <div>
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl overflow-hidden shadow-sm text-white" style={{ backgroundColor: config.gradientColor }}>
                      <card.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg font-semibold text-slate-700 tracking-tight leading-snug">
                      {card.title}
                    </span>
                  </div>
                  <div className="mt-8 flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-semibold tracking-tight text-slate-800 leading-none">
                        {card.valueLeft}
                      </h3>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-1.5">
                        {card.labelLeft}
                      </p>
                    </div>
                    <div className="text-right">
                      <h3 className="text-2xl font-semibold tracking-tight text-[#FF4C6A] leading-none">
                        {card.valueRight}
                      </h3>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-1.5">
                        {card.labelRight}
                      </p>
                    </div>
                  </div>
                </div>
                {card.change && (
                  <div className="mt-4 flex flex-col gap-1">
                    <span className="text-xs font-medium text-slate-500">
                      {card.change}
                    </span>
                  </div>
                )}
              </div>
            );
          } else {
            return (
              <div
                key={card.id}
                className={`relative flex flex-col justify-between overflow-hidden rounded-2xl border p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${config.bgClass}`}
                style={{
                  background: `linear-gradient(180deg, ${config.gradientColor}15 0%, ${config.gradientColor}05 100%)`,
                }}
              >
                <div>
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl overflow-hidden shadow-sm text-white" style={{ backgroundColor: config.gradientColor }}>
                      <card.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg font-semibold text-slate-700 tracking-tight leading-snug">
                      {card.title}
                    </span>
                  </div>
                  <div className="mt-8 flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold tracking-tight text-[#14B8A6] leading-none">
                        {card.valueLeft}
                      </h3>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-1">
                        {card.labelLeft}
                      </p>
                      <p className="text-xs text-slate-600 font-semibold mt-0.5">{card.nameLeft}</p>
                    </div>
                    <div className="text-right">
                      <h3 className="text-xl font-semibold tracking-tight text-[#FF4C6A] leading-none">
                        {card.valueRight}
                      </h3>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-1">
                        {card.labelRight}
                      </p>
                      <p className="text-xs text-slate-600 font-semibold mt-0.5">{card.nameRight}</p>
                    </div>
                  </div>
                </div>
                {card.change && (
                  <div className="mt-4 flex flex-col gap-1">
                    <span className="text-xs font-medium text-slate-500">
                      {card.change}
                    </span>
                  </div>
                )}
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}
