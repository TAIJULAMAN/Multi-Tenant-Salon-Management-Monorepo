import React from "react";
import { statCardsDemoData } from "./data";

export default function StatCards() {
  const colorMap: Record<number, { gradientColor: string; bgClass: string }> = {
    1: { gradientColor: "#635BFF", bgClass: "border-[#635BFF]/20" },
    2: { gradientColor: "#F8C209", bgClass: "border-[#F8C209]/20" },
    3: { gradientColor: "#16CDC7", bgClass: "border-[#16CDC7]/20" },
    4: { gradientColor: "#10B981", bgClass: "border-[#10B981]/20" },
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {statCardsDemoData.map((stat) => {
        const config = colorMap[stat.id] || { gradientColor: "#635BFF", bgClass: "border-[#635BFF]/20" };

        return (
          <div
            key={stat.id}
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
                {React.cloneElement(stat.icon as React.ReactElement<{ className?: string }>, {
                  className: "w-5 h-5 text-white",
                })}
              </div>
              <span className="text-lg font-semibold text-slate-700 tracking-tight leading-snug">
                {stat.title}
              </span>
            </div>

            {/* Content: Value + Change */}
            <div className="mt-8">
              <h3 className="text-2xl font-semibold tracking-tight text-slate-800 leading-none">
                {stat.value}
              </h3>
              {stat.change && (
                <div className="mt-4 flex flex-col gap-1">
                  <span className="text-xs font-medium text-slate-500">
                    {stat.change}
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
