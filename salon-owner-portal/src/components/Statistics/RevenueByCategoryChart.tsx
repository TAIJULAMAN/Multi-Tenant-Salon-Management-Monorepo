"use client";

import React, { useState } from "react";
import { CustomSelect } from "@/components/common/CustomSelect";
import { revenueByCategoryDataMap } from "./data";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export function RevenueByCategoryChart() {
  const [period, setPeriod] = useState("This Month");

  const revenueBreakdownData = revenueByCategoryDataMap[period] || revenueByCategoryDataMap["This Month"];

  return (
    <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[14px] font-bold text-[#1E293B]">Revenue by Category</h3>
        <CustomSelect
          value={period}
          onChange={setPeriod}
          options={["This Month", "Last Month", "This Year"]}
        />
      </div>
      <div className="h-[200px] flex items-center justify-center relative">
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0">
          <span className="text-xl font-bold text-[#1E293B]">100%</span>
          <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Categories</span>
        </div>
        <div className="w-full h-full relative z-10">
          <Doughnut
            data={revenueBreakdownData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: {
                  backgroundColor: "white",
                  titleColor: "#1E293B",
                  bodyColor: "#475569",
                  borderColor: "#E2E8F0",
                  borderWidth: 1,
                  padding: 12,
                  bodyFont: { family: "Manrope", size: 12, weight: "bold" as any },
                  displayColors: true,
                  callbacks: {
                    label: (context: any) => ` ${context.raw}%`,
                  },
                },
              },
              cutout: "75%",
            }}
          />
        </div>

      </div>
      <div className="grid grid-cols-2 gap-4 mt-6">
        {revenueBreakdownData.labels.map((label: string, idx: number) => (
          <div key={label} className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: revenueBreakdownData.datasets[0].backgroundColor[idx] }}
            />
            <span className="text-xs font-semibold text-[#64748B] truncate">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
