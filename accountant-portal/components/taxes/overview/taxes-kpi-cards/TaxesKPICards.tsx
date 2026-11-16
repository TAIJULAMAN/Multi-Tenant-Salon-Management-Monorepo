"use client";

import React from "react";
import { getTaxesMetrics, taxesKPICardsConfig } from "./data";

export default function TaxesKPICards() {
  const metrics = getTaxesMetrics();

  const formatValue = (key: string, value: number | string): string => {
    if (key === "totalPaid") {
      return `€${(value as number).toLocaleString()}`;
    }
    if (key === "avgApprovalTime") {
      return `${value} days`;
    }
    return value.toString();
  };

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {taxesKPICardsConfig.map((card, idx) => {
        const rawValue = metrics[card.metricKey as keyof typeof metrics];
        const displayValue = formatValue(card.metricKey, rawValue);
        const Icon = card.icon;

        return (
          <div
            key={idx}
            className={`relative flex flex-col justify-between overflow-hidden rounded-2xl border p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${card.bgClass}`}
            style={{
              background: `linear-gradient(180deg, ${card.gradientColor}15 0%, ${card.gradientColor}05 100%)`,
            }}
          >
            {/* Header: Icon + Title */}
            <div className="flex items-center gap-3.5">
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl overflow-hidden shadow-sm"
                style={{ backgroundColor: card.gradientColor }}
              >
                <Icon className="text-white h-5 w-5" />
              </div>
              <span className="text-lg font-semibold text-slate-700 tracking-tight leading-snug">
                {card.title}
              </span>
            </div>

            {/* Content: Value + Stats */}
            <div className="mt-8">
              <h3 className="text-2xl font-semibold tracking-tight text-slate-800 leading-none">
                {displayValue}
              </h3>

              <div className="mt-4 flex flex-col gap-1">
                <span className="text-xs font-semibold text-slate-700">
                  {card.subtext}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
