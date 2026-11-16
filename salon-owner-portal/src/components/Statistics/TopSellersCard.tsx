"use client";

import React from "react";

const topSellers = [
  { rank: 1, name: "Kerastase Shampoo 1", brand: "Kerastase", price: "€55.03", rankBg: "bg-[#635BFF]" },
  { rank: 2, name: "Kevin Murphy Shampoo 2", brand: "Kevin Murphy", price: "€42.63", rankBg: "bg-[#00D0C7]" },
  { rank: 3, name: "Davines Conditioner 4", brand: "Davines", price: "€33.74", rankBg: "bg-[#F59E0B]" },
  { rank: 4, name: "Kevin Murphy Treatment 6", brand: "Kevin Murphy", price: "€67.89", rankBg: "bg-[#94A3B8]" },
  { rank: 5, name: "L'Oreal Color 7", brand: "L'Oreal", price: "€77.06", rankBg: "bg-[#94A3B8]" },
];

export function TopSellersCard() {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-[20px] border border-[#E2E8F0] shadow-sm flex flex-col justify-between h-full w-full">
      <h3 className="text-sm font-bold text-[#1E293B] mb-4">Top Sellers</h3>

      <div className="divide-y divide-[#F8FAFC]">
        {topSellers.map((item) => (
          <div key={item.rank} className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-7 h-7 rounded-lg ${item.rankBg} text-white font-extrabold text-xs flex items-center justify-center shadow-sm shrink-0`}
              >
                {item.rank}
              </div>
              <div>
                <div className="text-[13px] font-bold text-[#1E293B]">{item.name}</div>
                <div className="text-[11px] font-medium text-[#94A3B8]">{item.brand}</div>
              </div>
            </div>
            <div className="text-[13px] font-bold text-[#1E293B]">{item.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
