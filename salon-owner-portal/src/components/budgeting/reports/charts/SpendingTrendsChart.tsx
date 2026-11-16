"use client";

import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
} from "chart.js";
import { MOCK_REPORTS_SPENDING_TRENDS } from "../../data";
import { CustomSelect } from "@/components/common/CustomSelect";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

export function SpendingTrendsChart() {
  const [year, setYear] = useState("2024");
  const dataOffset = year === "2023" ? -400 : year === "2025" ? 350 : 0;

  const data = {
    labels: MOCK_REPORTS_SPENDING_TRENDS.labels,
    datasets: [
      {
        label: "Total Spending",
        data: MOCK_REPORTS_SPENDING_TRENDS.data.map(val => Math.max(1000, val + dataOffset)),
        borderColor: "#635BFF",
        backgroundColor: (context: any) => {
          const ctx = context.chart?.ctx;
          if (!ctx) return "rgba(99, 91, 255, 0.1)";
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "rgba(99, 91, 255, 0.15)");
          gradient.addColorStop(1, "rgba(99, 91, 255, 0)");
          return gradient;
        },
        fill: true,
        tension: 0.4, // smooth curve
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHitRadius: 25,
        pointBackgroundColor: "#635BFF",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
      }
    ]
  };

  const options = {
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
        backgroundColor: "white",
        titleColor: "#1E293B",
        bodyColor: "#64748B",
        borderColor: "#E2E8F0",
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        boxPadding: 4,
        titleFont: { family: "Manrope", size: 12, weight: "bold" as const },
        bodyFont: { family: "Manrope", size: 12 },
        callbacks: {
          title: (context: any) => {
            if (!context || !context.length) return "";
            return `${context[0].label}, ${year}`;
          },
          label: (context: any) => {
            const rawVal = context.raw ?? context.parsed?.y ?? 0;
            return `Total Spending: € ${(Number(rawVal) / 1000).toFixed(1)}k`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: "#94A3B8", font: { family: "Manrope", size: 11 }, padding: 10 }
      },
      y: {
        grid: { display: true, color: "#F8FAFC", drawTicks: false },
        border: { display: false },
        ticks: {
          color: "#94A3B8",
          font: { family: "Manrope", size: 11 },
          callback: (value: any) => `€ ${(value / 1000).toFixed(1)}k`,
          stepSize: 500,
          padding: 10
        },
        min: 1000,
        max: 3500 + (dataOffset > 0 ? 500 : 0)
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg flex flex-col w-full overflow-hidden">
      <div className="flex justify-between items-start sm:items-center mb-6 shrink-0 gap-4">
        <h3 className="text-[14px] font-bold text-[#1E293B]">Spending Trends</h3>
        <CustomSelect
          value={year}
          onChange={setYear}
          options={["2023", "2024", "2025"]}
        />
      </div>
      <div className="w-full overflow-x-auto pb-2">
        <div className="min-w-[600px] h-[300px] w-full">
          <Line data={data} options={options} />
        </div>
      </div>
    </div>
  );
}
