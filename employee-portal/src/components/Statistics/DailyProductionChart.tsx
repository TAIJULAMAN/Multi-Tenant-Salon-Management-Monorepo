"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Bar } from "react-chartjs-2";
import CustomSelect from "../customComponent/CustomSelect";
import { DailyProductionChartProps } from "./types";

export const DailyProductionChart: React.FC<DailyProductionChartProps> = ({ data, options }) => {
  const [productionPeriod, setProductionPeriod] = useState("Monthly");

  const dataWeekly = {
    ...data,
    datasets: data.datasets ? data.datasets.map((ds: any) => ({
      ...ds,
      data: ds.data.map((v: number) => Math.max(0, v / 4))
    })) : []
  };

  const currentData = productionPeriod === "Monthly" ? data : dataWeekly;

  return (
    <div className="border border-[#E2E8F0] rounded-2xl p-6 mb-8 relative">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="font-bold text-[#1E293B] text-[14px]">Daily Production (Monthly)</h3>
          <div className="mt-4">
            <div className="text-[#64748B] text-[11px] font-bold mb-2">Production Status</div>
            <div className="bg-[#DCFCE7] text-[#22C55E] px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wide inline-block">
              Above Threshold
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <div className="mb-4">
            <CustomSelect
              value={productionPeriod}
              onChange={setProductionPeriod}
              options={["Monthly", "Weekly"]}
              buttonClassName="flex items-center justify-between gap-2 border border-[#E2E8F0] rounded-lg px-3 py-1.5 text-[12px] font-bold text-[#475569] bg-white shadow-none h-auto min-w-[100px]"
            />
          </div>
          <div className="text-right hidden sm:block">
            <div className="text-[#22C55E] font-black text-[16px]">€ 12,500</div>
            <div className="text-[#94A3B8] font-bold text-[10px] uppercase tracking-wide mt-1">
              Threshold: € 5,000
            </div>
          </div>
        </div>
      </div>

      <div className="h-[300px] relative w-full">
        <Bar data={currentData} options={options} />
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mt-4">
        <div className="text-[#94A3B8] text-[11px] font-medium leading-relaxed">
          <div>Threshold Calculation: Turnover x 0.2 = € 3,500</div>
          <div>Monthly Salary: € 4,000</div>
        </div>
        <div className="flex gap-2">
          <button className="w-8 h-8 rounded-full border border-[#E2E8F0] flex items-center justify-center text-[#94A3B8] hover:bg-[#F8FAFC] transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 rounded-full border border-[#E2E8F0] flex items-center justify-center text-[#635BFF] hover:bg-[#EEF2FF] transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
