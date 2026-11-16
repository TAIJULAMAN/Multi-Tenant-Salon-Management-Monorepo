import React from "react";
import { FileText, Calendar, CalendarX } from "lucide-react";
import { metricData } from "./data";

export default function ContractMetricCards() {
  const cards = [
    {
      title: "Active Contracts",
      value: metricData.activeContracts,
      icon: FileText,
      gradientColor: "#22c55e",
      bgClass: "border-[#22c55e]/20",
    },
    {
      title: "Expiring Soon",
      value: metricData.expiringSoon,
      icon: Calendar,
      gradientColor: "#F8C209",
      bgClass: "border-[#F8C209]/20",
    },
    {
      title: "Expired",
      value: metricData.expired,
      icon: CalendarX,
      gradientColor: "#f43f5e",
      bgClass: "border-[#f43f5e]/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {cards.map((card, idx) => {
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
                <Icon size={20} className="text-white" />
              </div>
              <span className="text-lg font-semibold text-slate-700 tracking-tight leading-snug">
                {card.title}
              </span>
            </div>

            {/* Content: Value */}
            <div className="mt-8">
              <h3 className="text-2xl font-semibold tracking-tight text-slate-800 leading-none">
                {card.value}
              </h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}
