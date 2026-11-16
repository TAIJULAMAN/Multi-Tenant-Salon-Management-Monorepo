"use client";

import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const categories = [
  { name: "Shampoo", count: 385, percent: "30%", color: "#635BFF" },
  { name: "Treatment", count: 153, percent: "12%", color: "#00D0C7" },
  { name: "Conditioner", count: 145, percent: "11%", color: "#10B981" },
  { name: "Tools", count: 320, percent: "25%", color: "#F59E0B" },
  { name: "Color", count: 142, percent: "11%", color: "#F97316" },
  { name: "Styling", count: 141, percent: "11%", color: "#9333EA" },
];

export function StockByCategoryCard() {
  const data = {
    labels: categories.map((c) => c.name),
    datasets: [
      {
        data: categories.map((c) => c.count),
        backgroundColor: categories.map((c) => c.color),
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "72%",
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "white",
        titleColor: "#1E293B",
        bodyColor: "#475569",
        borderColor: "#E2E8F0",
        borderWidth: 1,
        padding: 12,
        titleFont: { family: "Manrope", size: 12, weight: "bold" as any },
        bodyFont: { family: "Manrope", size: 12 },
        callbacks: {
          label: (context: any) => ` ${context.label}: ${context.raw} items`,
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-[20px] border border-[#E2E8F0] shadow-sm flex flex-col justify-between h-full w-full">
      <h3 className="text-sm font-bold text-[#1E293B] mb-4">Stock by Category</h3>

      <div className="h-[180px] relative flex items-center justify-center my-2">
        <Doughnut data={data} options={options} />
      </div>

      <div className="space-y-2 mt-4 pt-4 border-t border-[#F8FAFC]">
        {categories.map((cat) => (
          <div key={cat.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
              <span className="font-semibold text-[#64748B]">{cat.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-bold text-[#1E293B]">{cat.count}</span>
              <span className="font-semibold text-[#94A3B8] w-8 text-right">{cat.percent}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
