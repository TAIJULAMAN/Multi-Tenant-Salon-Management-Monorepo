import React from "react";
import { StatCardProps } from "./types";


export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  IconComponent,
  bgClass,
  iconBgClass = "bg-[#635BFF]",
  badge,
  badgeColor = "bg-[#CCFBF1] text-[#0D9488]",
  subtitle,
  className,
  sparkline,
}) => {
  return (
    <div
      className={`bg-white p-5 sm:p-6 rounded-2xl border border-[#E2E8F0] shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[140px] hover:border-[#CBD5E1] transition-all font-manrope ${
        className || ""
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl ${iconBgClass} flex items-center justify-center text-white shrink-0 shadow-sm`}
          >
            {IconComponent && <IconComponent className="w-5 h-5" />}
          </div>
          <span className="font-semibold text-xs text-[#1E293B] leading-snug">{title}</span>
        </div>
        {badge && (
          <span
            className={`${badgeColor} px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wide shrink-0`}
          >
            {badge}
          </span>
        )}
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <div className="text-[28px] font-bold text-[#1E293B] leading-none">{value}</div>
          {subtitle && (
            <div className="text-[11px] font-semibold text-[#64748B] mt-1.5 whitespace-pre-wrap">
              {subtitle}
            </div>
          )}
          {sparkline && <div className="mt-2">{sparkline}</div>}
        </div>
      </div>
    </div>
  );
};
