import React from "react";
import {
  CircleDollarSign,
  CalendarDays,
  LineChart,
  Wallet,
} from "lucide-react";
import { revenueCardsData } from "../revenueData";
import type { RevenueCardData } from "../types";

const iconMap = {
  success: CircleDollarSign,
  primary: CalendarDays,
  danger: LineChart,
  warning: Wallet,
};

const styleMap = {
  success: {
    gradientColor: "#22C55E",
    bgClass: "border-[#22C55E]/20",
  },
  primary: {
    gradientColor: "#635BFF",
    bgClass: "border-[#635BFF]/20",
  },
  danger: {
    gradientColor: "#F43F5E",
    bgClass: "border-[#F43F5E]/20",
  },
  warning: {
    gradientColor: "#F8C209",
    bgClass: "border-[#F8C209]/20",
  },
};

export default function RevenueShareCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {revenueCardsData.map((card: RevenueCardData, index: number) => {
        const Icon = iconMap[card.type];
        const styles = styleMap[card.type];

        return (
          <div
            key={index}
            className={`relative flex flex-col justify-between overflow-hidden rounded-2xl border p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${styles.bgClass}`}
            style={{
              background: `linear-gradient(180deg, ${styles.gradientColor}15 0%, ${styles.gradientColor}05 100%)`,
            }}
          >
            {/* Header: Icon + Title */}
            <div className="flex items-center gap-3.5">
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl overflow-hidden shadow-sm text-white"
                style={{ backgroundColor: styles.gradientColor }}
              >
                <Icon size={20} />
              </div>
              <span className="text-lg font-semibold text-slate-700 tracking-tight leading-snug">
                {card.title}
              </span>
            </div>

            {/* Content: Value + Description */}
            <div className="mt-8">
              <h3 className="text-2xl font-semibold tracking-tight text-slate-800 leading-none">
                € {card.amount.toLocaleString()}
              </h3>

              <div className="mt-4 flex flex-col gap-1">
                <span className="text-xs font-semibold text-slate-700">
                  {card.description}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
