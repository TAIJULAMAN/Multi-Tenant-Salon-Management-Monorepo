import React from "react";
import { StatCardProps } from "./types";

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  IconComponent,
  bgClass,
  iconBgClass = "bg-[#635BFF]",
  badge,
  badgeColor,
  subtitle,
  className,
  sparkline,
}) => {
  // Infer accent color from iconBgClass if possible
  const colorMap: Record<string, { gradientColor: string; borderClass: string; iconBgHex: string }> = {
    "bg-[#635BFF]": { gradientColor: "#635BFF", borderClass: "border-[#635BFF]/20", iconBgHex: "#635BFF" },
    "bg-[#10B981]": { gradientColor: "#10B981", borderClass: "border-[#10B981]/20", iconBgHex: "#10B981" },
    "bg-[#00D0C7]": { gradientColor: "#00D0C7", borderClass: "border-[#00D0C7]/20", iconBgHex: "#00D0C7" },
    "bg-[#2DD4BF]": { gradientColor: "#14B8A6", borderClass: "border-[#14B8A6]/20", iconBgHex: "#14B8A6" },
    "bg-[#14B8A6]": { gradientColor: "#14B8A6", borderClass: "border-[#14B8A6]/20", iconBgHex: "#14B8A6" },
    "bg-[#F97316]": { gradientColor: "#F97316", borderClass: "border-[#F97316]/20", iconBgHex: "#F97316" },
    "bg-[#DB2777]": { gradientColor: "#DB2777", borderClass: "border-[#DB2777]/20", iconBgHex: "#DB2777" },
    "bg-[#475569]": { gradientColor: "#475569", borderClass: "border-[#475569]/20", iconBgHex: "#475569" },
    "bg-[#F8C209]": { gradientColor: "#F8C209", borderClass: "border-[#F8C209]/20", iconBgHex: "#F8C209" },
    "bg-[#FBBF24]": { gradientColor: "#F8C209", borderClass: "border-[#F8C209]/20", iconBgHex: "#F8C209" },
    "bg-[#EAB308]": { gradientColor: "#F8C209", borderClass: "border-[#F8C209]/20", iconBgHex: "#F8C209" },
    "bg-[#F43F5E]": { gradientColor: "#F43F5E", borderClass: "border-[#F43F5E]/20", iconBgHex: "#F43F5E" },
  };

  const detected = colorMap[iconBgClass] || {
    gradientColor: "#635BFF",
    borderClass: "border-[#635BFF]/20",
    iconBgHex: "#635BFF",
  };

  return (
    <div
      className={`relative flex flex-col justify-between overflow-hidden rounded-2xl border p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${detected.borderClass} ${className || ""}`}
      style={{
        background: `linear-gradient(180deg, ${detected.gradientColor}15 0%, ${detected.gradientColor}05 100%)`,
      }}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3.5">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl overflow-hidden shadow-sm text-white"
              style={{ backgroundColor: detected.iconBgHex }}
            >
              <IconComponent className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-slate-700 tracking-tight leading-snug">
              {title}
            </span>
          </div>
          {badge && (
            <span
              className={`${
                badgeColor || "bg-[#22C55E] text-white"
              } px-3 py-1 rounded-full text-xs font-semibold shrink-0 shadow-sm`}
            >
              {badge}
            </span>
          )}
        </div>

        <div className="mt-8">
          <h3 className="text-2xl font-semibold tracking-tight text-slate-800 leading-none">
            {value}
          </h3>
          {sparkline && <div className="mt-2">{sparkline}</div>}
        </div>
      </div>

      {subtitle && (
        <div className="mt-4 flex flex-col gap-1">
          {typeof subtitle === "string" ? (
            <span className="text-xs font-semibold text-slate-700">{subtitle}</span>
          ) : (
            subtitle
          )}
        </div>
      )}
    </div>
  );
};
