"use client";

import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import { Info } from "lucide-react";
import CustomSelect from "../customComponent/CustomSelect";
import { ProductionTrendsChartProps } from "./types";

export const ProductionTrendsChart: React.FC<ProductionTrendsChartProps> = ({ data, options }) => {
  const [trendsPeriod, setTrendsPeriod] = useState("Yearly");

  const dataMonthly = {
    ...data,
    datasets: data.datasets ? data.datasets.map((ds: any) => ({
      ...ds,
      data: ds.data.map((v: number) => Math.max(0, v / 12))
    })) : []
  };

  const currentData = trendsPeriod === "Yearly" ? data : dataMonthly;

  return (
    <div className="border border-[#E2E8F0] rounded-2xl p-6 mb-8 relative">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 group relative">
          <h3 className="font-bold text-[#1E293B] text-[14px]">Production Trends (Yearly)</h3>
          <Info className="w-4 h-4 text-[#94A3B8] cursor-help" />
          <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-[#1E293B] text-white text-[11px] rounded-lg shadow-lg z-10">
            Shows the yearly trends of production relative to the threshold.
          </div>
        </div>
        <CustomSelect
          value={trendsPeriod}
          onChange={setTrendsPeriod}
          options={["Yearly", "Monthly"]}
          buttonClassName="flex items-center justify-between gap-2 border border-[#E2E8F0] rounded-lg px-3 py-1.5 text-[12px] font-bold text-[#475569] bg-white shadow-none h-auto min-w-[100px]"
        />
      </div>

      <div className="h-[250px] relative w-full mb-6">
        <Line data={currentData} options={options} />
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mt-4 sm:mt-0">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-[4px] bg-[#22C55E]"></div>
          <span className="text-[12px] font-semibold text-[#64748B]">Above Threshold</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-[4px] bg-[#F43F5E]"></div>
          <span className="text-[12px] font-semibold text-[#64748B]">Below Threshold</span>
        </div>
      </div>
    </div>
  );
};
