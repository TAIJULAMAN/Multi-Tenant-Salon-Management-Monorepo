"use client";

import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { CustomSelect } from "@/components/common/CustomSelect";
import { InactiveClientsChartProps } from "./types";
import {
  inactiveClientsList,
  filterInactiveClients,
  inactiveChartData,
} from "./data";

export default function InactiveClientsChart({
  filterMode,
  days,
  periodStart,
  periodEnd,
}: InactiveClientsChartProps) {
  const [selectedYear, setSelectedYear] = useState("2026");

  // Calculate dynamic scale factor based on current active filters
  const filteredCount = filterInactiveClients(
    inactiveClientsList,
    filterMode,
    days,
    periodStart,
    periodEnd
  ).length;
  const totalCount = inactiveClientsList.length;
  const scale = totalCount > 0 ? filteredCount / totalCount : 0;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
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
    },
    scales: {
      y: {
        min: 0,
        max: 300,
        ticks: {
          stepSize: 75,
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
    let currentData = [12, 10, 15, 18, 25, 30, 42, 55, 80, 110, 220, 290];
    let previousData = [10, 8, 12, 14, 20, 22, 35, 45, 60, 90, 180, 240];

    if (selectedYear === "2025") {
      currentData = [10, 8, 12, 14, 20, 22, 35, 45, 60, 90, 180, 240];
      previousData = [9, 7, 10, 11, 15, 18, 28, 38, 50, 75, 150, 200];
    } else if (selectedYear === "2024") {
      currentData = [9, 7, 10, 11, 15, 18, 28, 38, 50, 75, 150, 200];
      previousData = [7, 6, 8, 9, 12, 14, 22, 30, 40, 60, 120, 160];
    }

    // Apply scale dynamically
    const scaledCurrent = currentData.map((v) => Math.round(v * scale));
    const scaledPrevious = previousData.map((v) => Math.round(v * scale));

    return {
      ...inactiveChartData,
      datasets: [
        {
          ...inactiveChartData.datasets[0],
          label: `Current Year (${selectedYear})`,
          data: scaledCurrent,
        },
        {
          ...inactiveChartData.datasets[1],
          label: `Previous Year (${parseInt(selectedYear, 10) - 1})`,
          data: scaledPrevious,
        },
      ],
    };
  };

  return (
    <div className="bg-white p-6 rounded-[20px] border border-[#E2E8F0] shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-bold text-[#1E293B]">Inactive Clients</h3>
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
