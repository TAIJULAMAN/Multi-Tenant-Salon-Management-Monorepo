"use client";

import React, { useState } from "react";
import { CustomSelect } from "@/components/common/CustomSelect";
import { stockLevelDataMap } from "./data";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export function StockLevelByCategoryChart() {
  const [period, setPeriod] = useState("This Month");

  const inventoryStockData = stockLevelDataMap[period] || stockLevelDataMap["This Month"];

  return (
    <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm lg:col-span-2">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[14px] font-bold text-[#1E293B]">Stock Level by Category</h3>
        <CustomSelect
          value={period}
          onChange={setPeriod}
          options={["This Month", "Last Month", "This Year"]}
        />
      </div>
      <div className="h-[300px] flex items-center justify-center">
        <Bar
          data={inventoryStockData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
            },
            scales: {
              y: { grid: { color: "#F1F5F9" } },
              x: { grid: { display: false } },
            },
          }}
        />
      </div>
    </div>
  );
}
