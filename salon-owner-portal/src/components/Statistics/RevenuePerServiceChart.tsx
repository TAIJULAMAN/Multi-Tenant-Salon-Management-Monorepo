"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CustomSelect } from "@/components/common/CustomSelect";
import { RevenuePerServiceChartProps, ServiceRevenue } from "./types";

export const RevenuePerServiceChart: React.FC<RevenuePerServiceChartProps> = ({ page1Data, page2Data }) => {
  const [activePage, setActivePage] = useState(1);
  const [hoveredBar, setHoveredBar] = useState<number | null>(4);
  const [period, setPeriod] = useState("This Month");

  const page1LastMonth = page1Data.map(d => ({ ...d, value: Math.max(1000, d.value - 200) }));
  const page2LastMonth = page2Data.map(d => ({ ...d, value: Math.max(1000, d.value - 200) }));

  const page1ThisYear = page1Data.map(d => ({ ...d, value: Math.min(4000, d.value + 500) }));
  const page2ThisYear = page2Data.map(d => ({ ...d, value: Math.min(4000, d.value + 500) }));

  const currentP1 = period === "This Month" ? page1Data : period === "Last Month" ? page1LastMonth : page1ThisYear;
  const currentP2 = period === "This Month" ? page2Data : period === "Last Month" ? page2LastMonth : page2ThisYear;

  const activeServices = activePage === 1 ? currentP1 : currentP2;
  const getBarHeightPercent = (val: number) => {
    const min = 1000;
    const max = 4000;
    return `${((val - min) / (max - min)) * 100}%`;
  };

  return (
    <div className="bg-white rounded-[16px] border border-[#E2E8F0] shadow-sm p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-[#1E293B] text-[14px]">Revenue per service</h3>
        <CustomSelect
          value={period}
          onChange={setPeriod}
          options={["This Month", "Last Month", "This Year"]}
        />
      </div>

      <div className="relative flex items-end justify-between h-[300px] mt-8 select-none">
        {/* Y Axis Grid Labels */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[10px] font-bold text-[#94A3B8] h-[240px] pointer-events-none">
          <span>€ 4,000</span>
          <span>€ 3,500</span>
          <span>€ 3,000</span>
          <span>€ 2,500</span>
          <span>€ 2,000</span>
          <span>€ 1,500</span>
          <span>€ 1,000</span>
        </div>

        {/* Graph Columns Container */}
        <div className="flex-1 ml-12 sm:ml-16 mr-2 sm:mr-4 flex justify-between items-end h-[240px] relative">
          {/* Background Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between h-full pointer-events-none">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="border-t border-[#F8FAFC] w-full" />
            ))}
          </div>

          {/* Bars */}
          {activeServices.map((service, idx) => {
            const heightPercent = getBarHeightPercent(service.value);
            const isHovered = hoveredBar === idx;

            return (
              <div
                key={idx}
                className="flex flex-col items-center flex-1 group relative h-full justify-end cursor-pointer"
                onMouseEnter={() => setHoveredBar(idx)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                {/* Custom Tooltip matching mock design */}
                {isHovered && (
                  <div className="absolute z-10 bottom-full mb-3 transform -translate-x-1/2 left-1/2 -translate-y-1 bg-white border border-[#E2E8F0] shadow-lg rounded-lg p-3 text-left w-32 sm:w-36 animate-fadeIn pointer-events-none">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#635BFF]" />
                      <span className="text-[10px] font-bold text-[#64748B]">2026</span>
                    </div>
                    <div className="flex justify-between text-xs font-extrabold text-[#1E293B]">
                      <span>Total</span>
                      <span>€ 12,400</span>
                    </div>
                  </div>
                )}

                {/* Vertical Pillar */}
                <div className="w-8 sm:w-10 md:w-14 bg-[#F8FAFC] rounded-lg h-full flex items-end overflow-hidden relative border border-[#F8FAFC]">
                  <div
                    className="w-full bg-[#635BFF] rounded-t-2xl transition-all duration-300 shadow-sm"
                    style={{ height: heightPercent }}
                  />
                </div>

                {/* X Axis Label */}
                <span className="absolute top-full mt-4 text-[8px] sm:text-[10px] font-bold text-[#94A3B8] text-center w-full px-0.5 truncate">
                  {service.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Carousel / Navigation Controls at bottom right */}
      <div className="flex justify-end gap-3 mt-8">
        <button
          type="button"
          onClick={() => setActivePage(1)}
          disabled={activePage === 1}
          className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${activePage === 1
            ? "border-[#F1F5F9] text-[#CBD5E1] cursor-not-allowed"
            : "border-[#E2E8F0] hover:bg-slate-50 text-[#64748B]"
            }`}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => setActivePage(2)}
          disabled={activePage === 2}
          className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${activePage === 2
            ? "border-[#F1F5F9] text-[#CBD5E1] cursor-not-allowed"
            : "border-[#E2E8F0] hover:bg-slate-50 text-[#64748B]"
            }`}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
