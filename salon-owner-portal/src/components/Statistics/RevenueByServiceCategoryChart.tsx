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

const categories = ["Color", "Treatment", "Package", "Cutting", "Styling"];
const categoryValues = [33400, 16500, 11000, 9000, 4500];

export function RevenueByServiceCategoryChart() {
  const data = {
    labels: categories,
    datasets: [
      {
        data: categoryValues,
        backgroundColor: "#22C55E",
        hoverBackgroundColor: "#16a34a",
        borderRadius: 6,
        barThickness: 16,
      },
    ],
  };

  const options = {
    indexAxis: "y" as const,
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
        titleFont: { family: "Manrope", size: 12, weight: "bold" as any },
        bodyFont: { family: "Manrope", size: 12 },
        callbacks: {
          label: (context: any) => ` Revenue: €${context.raw.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        min: 0,
        max: 34800,
        ticks: {
          stepSize: 8000,
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
      y: {
        ticks: {
          font: { family: "Manrope", size: 11, weight: 600 as any },
          color: "#64748B",
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-[20px] border border-[#E2E8F0] shadow-sm w-full">
      <h3 className="text-sm font-bold text-[#1E293B] mb-6">Revenue by Service Category</h3>
      <div className="h-[240px] w-full">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
