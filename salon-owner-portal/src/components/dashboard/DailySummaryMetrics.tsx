"use client";

import React from "react";

export default function DailySummaryMetrics() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <div className="p-4 border border-[#E2E8F0] rounded-lg">
        <div className="text-[20px] font-bold text-[#1E293B] mb-1">€ 2,300</div>
        <div className="text-[11px] font-bold text-[#635BFF]">Total received</div>
      </div>
      <div className="p-4 border border-[#E2E8F0] rounded-lg">
        <div className="text-[20px] font-bold text-[#1E293B] mb-1">12</div>
        <div className="text-[11px] font-bold text-[#10B981]">Receipts issued</div>
      </div>
      <div className="p-4 border border-[#E2E8F0] rounded-lg">
        <div className="text-[20px] font-bold text-[#1E293B] mb-1">#R...</div>
        <div className="text-[11px] font-bold text-[#14B8A6]">Last receipt</div>
      </div>
    </div>
  );
}
