"use client";

import React from "react";
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
import { Line } from "react-chartjs-2";

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

const labels = [
  "Aug 13", "Aug 14", "Aug 15", "Aug 16", "Aug 17", "Aug 18", "Aug 19", "Aug 20", "Aug 21", "Aug 22",
  "Aug 23", "Aug 24", "Aug 25", "Aug 26", "Aug 27", "Aug 28", "Aug 29", "Aug 30", "Aug 31", "Sep 01",
  "Sep 02", "Sep 03", "Sep 04", "Sep 05", "Sep 06", "Sep 07", "Sep 08", "Sep 09", "Sep 10", "Sep 12"
];

const revenueValues = [
  1400, 850, 2050, 1900, 1850, 1600, 1400, 1850, 750, 2600,
  1800, 1450, 1650, 1750, 1400, 1380, 1300, 1480, 1550, 1580,
  1850, 1880, 1400, 2200, 1500, 1580, 1620, 1250, 1600, 2100
];

export function RevenueOverTimeFullChart() {
  const data = {
    labels,
    datasets: [
      {
        label: "Revenue",
        data: revenueValues,
        borderColor: "#635BFF",
        borderWidth: 2.5,
        tension: 0.42,
        fill: false,
        pointBackgroundColor: "#635BFF",
        pointBorderColor: "#FFFFFF",
        pointBorderWidth: 2,
        pointRadius: 0,
        pointHitRadius: 25,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: "#635BFF",
        pointHoverBorderColor: "#FFFFFF",
        pointHoverBorderWidth: 2,
      },
    ],
  };

  const options = {
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
          pointStyle: "rectRot" as const,
          boxWidth: 8,
          boxHeight: 8,
          font: { family: "Manrope", size: 11, weight: 600 as any },
          color: "#635BFF",
        },
      },
      tooltip: {
        backgroundColor: "white",
        titleColor: "#1E293B",
        bodyColor: "#635BFF",
        borderColor: "#E2E8F0",
        borderWidth: 1,
        padding: 12,
        boxPadding: 4,
        titleFont: { family: "Manrope", size: 12, weight: "bold" as any },
        bodyFont: { family: "Manrope", size: 12, weight: "bold" as any },
        callbacks: {
          title: (items: any) => (items.length ? items[0].label : ""),
          label: (context: any) => ` Revenue: €${Number(context.raw).toLocaleString()}`,
        },
      },
    },
    scales: {
      y: {
        min: 0,
        max: 2800,
        ticks: {
          stepSize: 700,
          callback: (val: any) => `€${val}`,
          font: { family: "Manrope", size: 10, weight: 600 as any },
          color: "#94A3B8",
        },
        grid: {
          color: "#F1F5F9",
        },
        border: {
          dash: [4, 4],
          display: false,
        },
      },
      x: {
        ticks: {
          font: { family: "Manrope", size: 9, weight: 600 as any },
          color: "#94A3B8",
          autoSkip: true,
          maxTicksLimit: 12,
          maxRotation: 0,
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-[20px] border border-[#E2E8F0] shadow-sm w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-4 sm:mb-6">
        <h3 className="text-sm font-bold text-[#1E293B]">Revenue Over Time</h3>
        <span className="text-[11px] font-semibold text-[#94A3B8]">Daily breakdown</span>
      </div>
      <div className="h-[240px] sm:h-[300px] w-full">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
