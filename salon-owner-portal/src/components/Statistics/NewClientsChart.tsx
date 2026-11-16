"use client";

import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { CustomSelect } from "@/components/common/CustomSelect";
import { newChartData } from "./data";

export default function NewClientsChart() {
  const [selectedYear, setSelectedYear] = useState("2026");

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: "index" as const,
    },
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
          label: (context: any) => ` New Clients: ${context.raw}`,
        },
      },
    },
    scales: {
      y: {
        min: 0,
        max: 150,
        ticks: {
          stepSize: 30,
          font: { family: "Manrope", size: 10, weight: 600 as any },
          color: "#94A3B8",
        },
        grid: { color: "#F8FAFC" },
      },
      x: {
        ticks: {
          font: { family: "Manrope", size: 10, weight: 600 as any },
          color: "#94A3B8",
        },
        grid: { display: false },
      },
    },
  };

  const getDynamicChartData = () => {
    let baseData = [...newChartData.datasets[0].data];

    if (selectedYear === "2025") {
      baseData = baseData.map((v) => Math.round(v * 0.8));
    } else if (selectedYear === "2024") {
      baseData = baseData.map((v) => Math.round(v * 0.6));
    }

    return {
      ...newChartData,
      datasets: [
        {
          ...newChartData.datasets[0],
          label: `New Clients (${selectedYear})`,
          data: baseData,
        },
      ],
    };
  };

  return (
    <div className="bg-white p-6 rounded-[20px] border border-[#E2E8F0] shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-bold text-[#1E293B]">New Clients Over Time</h3>
        <CustomSelect
          value={selectedYear}
          onChange={setSelectedYear}
          options={["2026", "2025", "2024"]}
          buttonClassName="w-[100px] !bg-white !border-[#E2E8F0] !text-[#1E293B] !text-xs !font-bold !px-3 !py-[7px] !rounded-lg"
        />
      </div>
      <div className="h-[280px]">
        <Bar data={getDynamicChartData()} options={chartOptions} />
      </div>
    </div>
  );
}
