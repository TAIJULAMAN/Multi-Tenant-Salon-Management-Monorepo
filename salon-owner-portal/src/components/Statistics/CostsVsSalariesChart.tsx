"use client";

import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import { CustomSelect } from "@/components/common/CustomSelect";
import { CostsVsSalariesChartProps } from "./types";

export const CostsVsSalariesChart: React.FC<CostsVsSalariesChartProps> = ({ data, options }) => {
  const [period, setPeriod] = useState("This Year");

  const dataLastYear = {
    ...data,
    datasets: data.datasets ? data.datasets.map((ds: any) => ({
      ...ds,
      data: ds.data.map((v: number) => Math.max(0, v - 5000))
    })) : []
  };

  const dataAllTime = {
    ...data,
    datasets: data.datasets ? data.datasets.map((ds: any) => ({
      ...ds,
      data: ds.data.map((v: number) => v * 3)
    })) : []
  };

  const currentData = period === "This Year" ? data : period === "Last Year" ? dataLastYear : dataAllTime;

  return (
    <div className="bg-white rounded-[16px] border border-[#E2E8F0] shadow-sm p-6 md:p-8">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <h3 className="font-bold text-[#1E293B] text-[14px]">Costs vs Salaries</h3>
          <CustomSelect
            value={period}
            onChange={setPeriod}
            options={["This Year", "Last Year", "All Time"]}
          />
        </div>

        {/* Custom chart legend badges matching mockup */}
        <div className="flex items-center gap-4 text-xs font-bold text-[#64748B]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#14B8A6]" />
            <span>Salaries</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#635BFF]" />
            <span>Costs</span>
          </div>
        </div>
      </div>

      {/* Line Chart container */}
      <div className="h-[280px] relative w-full mt-4 select-none">
        <Line data={currentData} options={options} />
      </div>
    </div>
  );
};
