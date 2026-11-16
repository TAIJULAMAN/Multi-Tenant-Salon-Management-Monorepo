"use client";

import React, { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { CustomSelect } from "@/components/common/CustomSelect";
import { RevenuePerCategoryChartProps } from "./types";

export const RevenuePerCategoryChart: React.FC<RevenuePerCategoryChartProps> = ({ data, options }) => {
  const [period, setPeriod] = useState("This Month");

  const dataLastMonth = {
    ...data,
    datasets: data.datasets ? data.datasets.map((ds: any) => ({
      ...ds,
      data: ds.data.map((v: number) => Math.max(0, v - 5))
    })) : []
  };

  const dataThisYear = {
    ...data,
    datasets: data.datasets ? data.datasets.map((ds: any) => ({
      ...ds,
      data: ds.data.map((v: number) => v + 10)
    })) : []
  };

  const currentData = period === "This Month" ? data : period === "Last Month" ? dataLastMonth : dataThisYear;

  return (
    <div className="bg-white rounded-[16px] border border-[#E2E8F0] shadow-sm p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-[#1E293B] text-[14px]">Revenue per Category</h3>
        <CustomSelect
          value={period}
          onChange={setPeriod}
          options={["This Month", "Last Month", "This Year"]}
        />
      </div>

      <div className="relative w-full h-[180px] flex items-center justify-center mt-2">
        {/* Doughnut Canvas container */}
        <div className="w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] absolute -bottom-16 sm:-bottom-24">
          <Doughnut data={currentData} options={options} />
        </div>

        {/* Center Gauge Text */}
        <div className="text-center absolute z-10 bottom-6">
          <div className="text-2xl font-black text-[#1E293B] font-manrope">€ 10,000</div>
          <div className="text-[10px] font-bold text-[#94A3B8] tracking-wider mt-0.5">Total Revenue</div>
        </div>
      </div>

      {/* Legends */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-3 gap-x-4 mt-6 pt-4 text-[11px] font-bold text-[#64748B]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#635BFF] shrink-0" />
          <span className="truncate">Category 1</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#06B6D4] shrink-0" />
          <span className="truncate">Category 2</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FBBF24] shrink-0" />
          <span className="truncate">Category 3</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2DD4BF] shrink-0" />
          <span className="truncate">Category 4</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#EC4899] shrink-0" />
          <span className="truncate">Category 5</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] shrink-0" />
          <span className="truncate">Category 6</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#1E293B] shrink-0" />
          <span className="truncate">Category 7</span>
        </div>
      </div>
    </div>
  );
};
