import React from "react";
import { statCardsDemoData } from "./data";

export default function StatCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 font-manrope">
      {statCardsDemoData.map((stat) => (
        <div
          key={stat.id}
          className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E2E8F0] shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[140px] hover:border-[#CBD5E1] transition-all"
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl ${stat.iconBgColor} ${stat.iconColor} flex items-center justify-center shrink-0 shadow-sm`}
            >
              {stat.icon}
            </div>
            <span className="font-semibold text-xs text-[#1E293B] leading-snug">
              {stat.title}
            </span>
          </div>

          <div className="mt-4 flex items-end justify-between">
            <div>
              <div className="text-[28px] font-bold text-[#1E293B] leading-none">
                {stat.value}
              </div>
              {stat.change && (
                <div className="text-[11px] font-semibold text-[#64748B] mt-1.5">
                  {stat.change}
                </div>
              )}
            </div>

            {stat.badge && (
              <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#D1FAE5] text-[#10B981] mb-0.5 whitespace-nowrap">
                {stat.badge}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
