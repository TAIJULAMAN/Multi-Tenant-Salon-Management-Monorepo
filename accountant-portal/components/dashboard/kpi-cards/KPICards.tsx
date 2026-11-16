"use client";

import React from "react";
import Image from "next/image";
import { kpiDataBySalon, defaultKpiData } from "./data";

interface KPICardsProps {
  selectedSalon: string;
}

export default function KPICards({ selectedSalon }: KPICardsProps) {
  const stats = kpiDataBySalon[selectedSalon] || defaultKpiData;

  const iconConfig: Record<string, { src: string; alt: string; gradientColor: string; bgClass: string }> = {
    salaries: {
      src: "/icons/SalariesPendingApproval.svg",
      alt: "Salaries Pending Approval",
      gradientColor: "#F8C209",
      bgClass: "border-[#F8C209]/20",
    },
    taxes: {
      src: "/icons/TaxesPendingApproval.svg",
      alt: "Taxes Pending Approval",
      gradientColor: "#16CDC7",
      bgClass: "border-[#16CDC7]/20",
    },
    deadlines: {
      src: "/icons/UpcomingDeadlines.svg",
      alt: "Upcoming Deadlines",
      gradientColor: "#635BFF",
      bgClass: "border-[#635BFF]/20",
    },
    warnings: {
      src: "/icons/BudgetWarnings.svg",
      alt: "Budget Warnings",
      gradientColor: "#FF6692",
      bgClass: "border-[#FF6692]/20",
    },
  };

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, idx) => {
        const config = iconConfig[stat.iconType] || {
          src: "/icons/SalariesPendingApproval.svg",
          alt: stat.title,
          gradientColor: "#635BFF",
          bgClass: "border-[#635BFF]/20",
        };

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
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl overflow-hidden shadow-sm"
                style={{ backgroundColor: config.gradientColor }}
              >
                <Image
                  src={config.src}
                  alt={config.alt}
                  width={24}
                  height={24}
                />
              </div>
              <span className="text-lg font-semibold text-slate-700 tracking-tight leading-snug">
                {stat.title}
              </span>
            </div>

            {/* Content: Value + Stats */}
            <div className="mt-8">
              <h3 className="text-2xl font-semibold tracking-tight text-slate-800 leading-none">
                {stat.value}
              </h3>

              <div className="mt-4 flex flex-col gap-1">
                <span className="text-xs font-semibold text-slate-700">
                  {stat.subtext}
                </span>
                {stat.change && (
                  <span className="text-xs font-medium text-slate-500">
                    {stat.change}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
