import React from "react";
import { Wallet, Calendar, Tag } from "lucide-react";
import { performanceStatCards } from "./data";

const iconMap: Record<string, React.ElementType> = {
  Wallet,
  Calendar,
  Tag,
};

export function PerformanceStatCards() {
  const colorMap: Record<string, { gradientColor: string; bgClass: string }> = {
    "1": { gradientColor: "#635BFF", bgClass: "border-[#635BFF]/20" },
    "2": { gradientColor: "#10B981", bgClass: "border-[#10B981]/20" },
    "3": { gradientColor: "#F8C209", bgClass: "border-[#F8C209]/20" },
  };

  return (
    <div className="mb-8 mt-2">
      <h2 className="text-[16px] font-bold text-[#1E293B] mb-4">Analytics Overview</h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
        {performanceStatCards.map((card) => {
          const IconComponent = iconMap[card.icon];
          const config = colorMap[card.id] || { gradientColor: "#635BFF", bgClass: "border-[#635BFF]/20" };

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
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl overflow-hidden shadow-sm text-white"
                    style={{ backgroundColor: config.gradientColor }}
                  >
                    {IconComponent && <IconComponent className="w-5 h-5 text-white" />}
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
    </div>
  );
}
