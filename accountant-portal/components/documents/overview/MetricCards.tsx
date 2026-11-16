import React from "react";
import { statCards } from "./data";

export default function MetricCards() {
  const cardConfig: Record<string, { gradientColor: string; bgClass: string }> = {
    "Employee Notices": { gradientColor: "#F8C209", bgClass: "border-[#F8C209]/20" },
    "Contracts": { gradientColor: "#22c55e", bgClass: "border-[#22c55e]/20" },
    "Owner Documents": { gradientColor: "#635BFF", bgClass: "border-[#635BFF]/20" },
    "Receipts": { gradientColor: "#16CDC7", bgClass: "border-[#16CDC7]/20" },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {statCards.map((card, idx) => {
        const Icon = card.icon;
        const config = cardConfig[card.title] || { gradientColor: "#635BFF", bgClass: "border-[#635BFF]/20" };

        return (
          <div
            key={idx}
            className={`relative flex flex-col justify-between overflow-hidden rounded-2xl border p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${config.bgClass}`}
            style={{
              background: `linear-gradient(180deg, ${config.gradientColor}15 0%, ${config.gradientColor}05 100%)`,
            }}
          >
            {/* Header: Icon + Title */}
            <div className="flex items-center gap-3.5">
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl overflow-hidden shadow-sm text-white"
                style={{ backgroundColor: config.gradientColor }}
              >
                <Icon size={20} />
              </div>
              <span className="text-lg font-semibold text-slate-700 tracking-tight leading-snug">
                {card.title}
              </span>
            </div>

            {/* Content: Value + Action */}
            <div className="mt-8 flex items-end justify-between">
              <h3 className="text-2xl font-semibold tracking-tight text-slate-800 leading-none">
                {card.value}
              </h3>

              <button className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-1.5 rounded-lg text-xs font-semibold tracking-tight transition-colors cursor-pointer shadow-sm">
                View All
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
