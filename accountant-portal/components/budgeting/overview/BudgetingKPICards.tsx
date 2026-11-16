"use client";

import React from "react";
import {
  Wallet,
  TrendingUp,
  CreditCard,
  Euro,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { kpiCardsData } from "./data";

export default function BudgetingKPICards() {
  const getIcon = (type: string) => {
    switch (type) {
      case "purple":
        return <Wallet size={20} className="text-white" />;
      case "pink":
        return <TrendingUp size={20} className="text-white" />;
      case "teal":
        return <CreditCard size={20} className="text-white" />;
      case "yellow":
        return <Euro size={20} className="text-white" />;
      default:
        return <Wallet size={20} className="text-white" />;
    }
  };

  const getConfig = (type: string) => {
    switch (type) {
      case "purple":
        return { gradientColor: "#635BFF", bgClass: "border-[#635BFF]/20" };
      case "pink":
        return { gradientColor: "#FF6692", bgClass: "border-[#FF6692]/20" };
      case "teal":
        return { gradientColor: "#16CDC7", bgClass: "border-[#16CDC7]/20" };
      case "yellow":
        return { gradientColor: "#F8C209", bgClass: "border-[#F8C209]/20" };
      default:
        return { gradientColor: "#635BFF", bgClass: "border-[#635BFF]/20" };
    }
  };

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {kpiCardsData.map((card, idx) => {
        const config = getConfig(card.colorType);
        const isUp = card.trendType === "up";
        const isDown = card.trendType === "down";

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
                {getIcon(card.colorType)}
              </div>
              <span className="text-lg font-semibold text-slate-700 tracking-tight leading-snug">
                {card.title}
              </span>
            </div>

            {/* Content: Value + Stats */}
            <div className="mt-8">
              <h3 className="text-2xl font-semibold tracking-tight text-slate-800 leading-none">
                {card.value}
              </h3>

              <div className="mt-4 flex flex-col gap-1">
                {card.trendType !== "neutral" ? (
                  <>
                    <span className="text-xs font-semibold">
                      {isUp && (
                        <span className="flex items-center gap-0.5 text-kpi-teal-text">
                          <ArrowUpRight size={14} className="shrink-0" />
                          {card.trend}
                        </span>
                      )}
                      {isDown && (
                        <span className="flex items-center gap-0.5 text-status-high-text">
                          <ArrowDownRight size={14} className="shrink-0" />
                          {card.trend}
                        </span>
                      )}
                    </span>
                    {card.subtitle && (
                      <span className="text-xs font-medium text-slate-500">
                        {card.subtitle}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-xs font-semibold text-slate-700 truncate block">
                    {card.trend}
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
