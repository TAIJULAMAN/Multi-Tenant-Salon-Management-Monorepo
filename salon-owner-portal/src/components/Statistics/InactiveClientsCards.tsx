"use client";

import React from "react";
import { InactiveClientsCardsProps } from "./types";
import {
  inactiveClientsList,
  filterInactiveClients,
  getDaysAgo,
  inactiveCardsConfig,
} from "./data";

export default function InactiveClientsCards({
  filterMode,
  days,
  periodStart,
  periodEnd,
}: InactiveClientsCardsProps) {
  const filteredClients = filterInactiveClients(
    inactiveClientsList,
    filterMode,
    days,
    periodStart,
    periodEnd
  );

  const totalCount = filteredClients.length;
  const avgDays = totalCount > 0
    ? Math.round(filteredClients.reduce((sum, c) => sum + getDaysAgo(c.lastVisit), 0) / totalCount)
    : 0;
  const lostRev = totalCount * 575;
  const avgTicket = totalCount > 0
    ? filteredClients.reduce((sum, c) => sum + c.avgTicket, 0) / totalCount
    : 0;

  const getCardValue = (id: string) => {
    switch (id) {
      case "inactive-count":
        return totalCount.toString();
      case "lost-revenue":
        return `€${lostRev.toLocaleString()}`;
      case "avg-ticket":
        return `€${avgTicket.toFixed(2)}`;
      case "days-since-visit":
        return avgDays.toString();
      default:
        return "";
    }
  };

  const colorMap: Record<string, { gradientColor: string; bgClass: string }> = {
    "inactive-count": { gradientColor: "#F43F5E", bgClass: "border-[#F43F5E]/20" },
    "lost-revenue": { gradientColor: "#F8C209", bgClass: "border-[#F8C209]/20" },
    "avg-ticket": { gradientColor: "#10B981", bgClass: "border-[#10B981]/20" },
    "days-since-visit": { gradientColor: "#635BFF", bgClass: "border-[#635BFF]/20" },
  };

  const dynamicCards = inactiveCardsConfig.map((card) => ({
    ...card,
    value: getCardValue(card.id),
    ...(colorMap[card.id] || { gradientColor: "#635BFF", bgClass: "border-[#635BFF]/20" }),
  }));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {dynamicCards.map((card) => (
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
