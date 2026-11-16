"use client";

import React from "react";
import { newClientsList, newCardsConfig } from "./data";

export default function NewClientsCards() {
  const totalCount = newClientsList.length;
  const acquisitionRev = newClientsList.reduce((sum, c) => sum + c.totalSpent, 0);
  const avgTicket = totalCount > 0
    ? newClientsList.reduce((sum, c) => sum + c.avgTicket, 0) / totalCount
    : 0;

  const getCardValue = (id: string) => {
    switch (id) {
      case "new-count":
        return totalCount.toString();
      case "acquisition-rev":
        return `€${acquisitionRev.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      case "avg-ticket":
        return `€${avgTicket.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      case "top-source":
        return "Instagram";
      default:
        return "";
    }
  };

  const colorMap: Record<string, { gradientColor: string; bgClass: string }> = {
    "new-count": { gradientColor: "#635BFF", bgClass: "border-[#635BFF]/20" },
    "acquisition-rev": { gradientColor: "#10B981", bgClass: "border-[#10B981]/20" },
    "avg-ticket": { gradientColor: "#14B8A6", bgClass: "border-[#14B8A6]/20" },
    "top-source": { gradientColor: "#DB2777", bgClass: "border-[#DB2777]/20" },
  };

  const cards = newCardsConfig.map((card) => ({
    ...card,
    value: getCardValue(card.id),
    ...(colorMap[card.id] || { gradientColor: "#635BFF", bgClass: "border-[#635BFF]/20" }),
  }));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((card) => (
        <div
          key={card.id}
          className={`relative flex flex-col justify-between overflow-hidden rounded-2xl border p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${card.bgClass}`}
          style={{
            background: `linear-gradient(180deg, ${card.gradientColor}15 0%, ${card.gradientColor}05 100%)`,
          }}
        >
          <div>
            <div className="flex items-center gap-3.5 mb-4">
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl overflow-hidden shadow-sm text-white"
                style={{ backgroundColor: card.gradientColor }}
              >
                <card.icon className="w-5 h-5 text-white" />
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
      ))}
    </div>
  );
}
