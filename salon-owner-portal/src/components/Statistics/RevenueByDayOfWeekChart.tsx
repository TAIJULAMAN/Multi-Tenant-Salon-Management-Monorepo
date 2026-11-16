"use client";

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const dayValues = [5200, 5000, 5100, 4900, 7100, 3800, 9800];

export function RevenueByDayOfWeekChart() {
  const data = {
    labels: days,
    datasets: [
      {
        label: "Revenue",
        data: dayValues,
        backgroundColor: "#00D0C7",
        hoverBackgroundColor: "#00b8b0",
        borderRadius: 4,
        barThickness: 28,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          usePointStyle: true,
          pointStyle: "rect" as const,
          boxWidth: 8,
          boxHeight: 8,
          font: { family: "Manrope", size: 11, weight: 600 as any },
          color: "#00D0C7",
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
        max: 10000,
        ticks: {
          stepSize: 2500,
          callback: (val: any) => `€${val}`,
          font: { family: "Manrope", size: 10, weight: 600 as any },
          color: "#94A3B8",
        },
        grid: {
          color: "#F8FAFC",
        },
        border: {
          dash: [4, 4],
          display: false,
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
    <div className="bg-white p-6 rounded-[20px] border border-[#E2E8F0] shadow-sm w-full">
      <h3 className="text-sm font-bold text-[#1E293B] mb-6">Revenue by Day of Week</h3>
      <div className="h-[280px] w-full">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
