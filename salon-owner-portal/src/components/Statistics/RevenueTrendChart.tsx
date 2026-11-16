"use client";

import React, { useState } from "react";
import { CustomSelect } from "@/components/common/CustomSelect";
import { revenueTrendDataMap } from "./data";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export function RevenueTrendChart() {
  const [period, setPeriod] = useState("This Month");

  const revenueTrendData =
    revenueTrendDataMap[period] || revenueTrendDataMap["This Month"];

  return (
    <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm lg:col-span-2 font-manrope">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[14px] font-bold text-[#1E293B]">Revenue Trend</h3>
        <CustomSelect
          value={period}
          onChange={setPeriod}
          options={["This Month", "Last Month", "This Year"]}
        />
      </div>
      <div className="h-[300px] flex items-center justify-center">
        <Line
          data={revenueTrendData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
              mode: "index" as const,
              intersect: false,
            },
            plugins: {
              legend: { display: false },
              tooltip: {
                enabled: true,
                backgroundColor: "#1E293B",
                titleColor: "#FFFFFF",
                bodyColor: "#FFFFFF",
                padding: 10,
                cornerRadius: 8,
                callbacks: {
                  label: (context: any) =>
                    `Revenue: € ${context.raw.toLocaleString()}`,
                },
              },
            },
            scales: {
              y: {
                grid: { color: "#F1F5F9" },
                ticks: {
                  color: "#94A3B8",
                  font: { family: "Manrope", size: 11 },
                  callback: (value: any) =>
                    value >= 1000 ? `€ ${(value / 1000).toFixed(0)}k` : `€ ${value}`,
                },
              },
              x: {
                grid: { display: false },
                ticks: {
                  color: "#94A3B8",
                  font: { family: "Manrope", size: 11 },
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
}
