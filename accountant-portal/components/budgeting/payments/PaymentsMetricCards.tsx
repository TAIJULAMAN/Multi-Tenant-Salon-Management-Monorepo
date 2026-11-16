import React from "react";
import { metricCards as cards } from "./data";

export default function PaymentsMetricCards() {
  const colorMap: Record<number, { gradientColor: string; bgClass: string }> = {
    0: { gradientColor: "#635BFF", bgClass: "border-[#635BFF]/20" },
    1: { gradientColor: "#10b981", bgClass: "border-[#10b981]/20" },
    2: { gradientColor: "#F8C209", bgClass: "border-[#F8C209]/20" },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        const color = colorMap[idx] || { gradientColor: "#635BFF", bgClass: "border-[#635BFF]/20" };

        return (
          <div
            key={idx}
            className={`relative flex flex-col justify-between overflow-hidden rounded-2xl border p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${color.bgClass}`}
            style={{
              background: `linear-gradient(180deg, ${color.gradientColor}15 0%, ${color.gradientColor}05 100%)`,
            }}
          >
            {/* Header: Icon + Title */}
            <div className="flex items-center gap-3.5">
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl overflow-hidden shadow-sm"
                style={{ backgroundColor: color.gradientColor }}
              >
                <Icon size={20} className="text-white" />
              </div>
              <span className="text-lg font-semibold text-slate-700 tracking-tight leading-snug">
                {card.title}
              </span>
            </div>

            {/* Content: Value + Subtitle */}
            <div className="mt-8">
              <h3 className="text-2xl font-semibold tracking-tight text-slate-800 leading-none">
                {card.value}
              </h3>

              <div className="mt-4 flex flex-col gap-1">
                <span className="text-xs font-semibold text-slate-700">
                  {card.subtitle}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
