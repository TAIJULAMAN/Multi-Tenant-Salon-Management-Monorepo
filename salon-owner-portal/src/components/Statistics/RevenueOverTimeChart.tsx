"use client";

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);
import { Line } from "react-chartjs-2";
import { CustomSelect } from "@/components/common/CustomSelect";
import { revenueOverTimeBase } from "./data";
import { useState } from "react";

export default function RevenueOverTimeChart() {
  const [revenueOverTimeFilter, setRevenueOverTimeFilter] = useState("2026");

  const getRevenueOverTimeData = () => {
    const labels = Array.from({ length: 30 }, (_, i) => `Aug ${String(i + 1).padStart(2, "0")}`);
    let baseData = [...revenueOverTimeBase];

    if (revenueOverTimeFilter === "2025") {
      baseData = baseData.map(v => Math.round(v * 0.8));
    } else if (revenueOverTimeFilter === "2024") {
      baseData = baseData.map(v => Math.round(v * 0.6));
    }

    return {
      labels,
      datasets: [
        {
          label: "Revenue",
          data: baseData,
          borderColor: "#635BFF",
          borderWidth: 2,
          tension: 0.4,
          fill: false,
          pointBackgroundColor: "#635BFF",
          pointBorderColor: "#635BFF",
          pointRadius: 0,
          pointHoverRadius: 5,
        },
      ],
    };
  };

  const revenueOverTimeOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: "index" as const,
    },
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          usePointStyle: true,
          pointStyle: "circle" as const,
          boxWidth: 6,
          font: { family: "Manrope", size: 11, weight: 600 as any },
          color: "#64748B",
        },
      },
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
          label: (context: any) => ` Revenue: €${context.raw.toLocaleString()}`,
        },
      },
    },
    scales: {
      y: {
        min: 0,
        ticks: {
          callback: (val: any) => `€${val}`,
          font: { family: "Manrope", size: 10, weight: 600 as any },
          color: "#94A3B8",
        },
        grid: {
          color: "#F8FAFC",
        },
      },
      x: {
        ticks: {
          font: { family: "Manrope", size: 10, weight: 600 as any },
          color: "#94A3B8",
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-[20px] border border-[#E2E8F0] shadow-sm lg:col-span-2">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-bold text-[#1E293B]">Revenue Over Time</h3>
        <CustomSelect
          value={revenueOverTimeFilter}
          onChange={setRevenueOverTimeFilter}
          options={["2026", "2025", "2024"]}
          buttonClassName="!bg-white !border-[#E2E8F0] !text-[#64748B] !text-xs !font-semibold !px-3 !py-1.5 !rounded-lg"
        />
      </div>
      <div className="h-[280px]">
        <Line data={getRevenueOverTimeData()} options={revenueOverTimeOptions} />
      </div>
    </div>
  );
}
