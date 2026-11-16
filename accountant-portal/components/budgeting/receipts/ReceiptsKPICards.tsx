import React from "react";
import { Wallet, BarChart3, FileText, Users } from "lucide-react";
import { receiptsKpis } from "./data";

export default function ReceiptsKPICards() {
  const cards = [
    {
      title: "Total",
      value: `€ ${receiptsKpis.total}`,
      icon: Wallet,
      gradientColor: "#16CDC7",
      borderClass: "border-[#16CDC7]/20",
    },
    {
      title: "Media",
      value: `€ ${receiptsKpis.media}`,
      icon: BarChart3,
      gradientColor: "#635BFF",
      borderClass: "border-[#635BFF]/20",
    },
    {
      title: "Receipts",
      value: String(receiptsKpis.receiptsCount),
      icon: FileText,
      gradientColor: "#FF6692",
      borderClass: "border-[#FF6692]/20",
    },
    {
      title: "Unique Customers",
      value: String(receiptsKpis.uniqueCustomers),
      icon: Users,
      gradientColor: "#F8C209",
      borderClass: "border-[#F8C209]/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`relative flex flex-col justify-between overflow-hidden rounded-2xl border p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${card.borderClass}`}
            style={{
              background: `linear-gradient(180deg, ${card.gradientColor}15 0%, ${card.gradientColor}05 100%)`,
            }}
          >
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
