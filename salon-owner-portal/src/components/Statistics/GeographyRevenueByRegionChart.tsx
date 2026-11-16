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

interface GeographyRevenueByRegionChartProps {
  viewBy?: "regions" | "cities";
}

const regionsData = [
  { name: "Veneto", revenue: 75720.75 },
  { name: "Sicilia", revenue: 57494.80 },
  { name: "Puglia", revenue: 28967.50 },
  { name: "Lazio", revenue: 28885.00 },
  { name: "Campania", revenue: 27944.85 },
  { name: "Emilia-Romagna", revenue: 27784.65 },
  { name: "Marche", revenue: 24370.30 },
  { name: "Liguria", revenue: 23574.35 },
  { name: "Toscana", revenue: 23082.05 },
  { name: "Umbria", revenue: 22345.15 },
];

const citiesData = [
  { name: "Milan", revenue: 68400.00 },
  { name: "Rome", revenue: 59200.00 },
  { name: "Naples", revenue: 34800.00 },
  { name: "Palermo", revenue: 31200.00 },
  { name: "Florence", revenue: 29500.00 },
  { name: "Venice", revenue: 28900.00 },
  { name: "Turin", revenue: 26100.00 },
  { name: "Bologna", revenue: 24800.00 },
  { name: "Verona", revenue: 23400.00 },
  { name: "Bari", revenue: 21900.00 },
];

export function GeographyRevenueByRegionChart({ viewBy = "regions" }: GeographyRevenueByRegionChartProps) {
  const currentData = viewBy === "regions" ? regionsData : citiesData;
  const title = viewBy === "regions" ? "Revenue by Region" : "Revenue by City";

  const data = {
    labels: currentData.map((d) => d.name),
    datasets: [
      {
        label: "Revenue",
        data: currentData.map((d) => d.revenue),
        backgroundColor: "#635BFF",
        hoverBackgroundColor: "#5249E6",
        borderRadius: 6,
        barThickness: 12,
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
        bodyColor: "#635BFF",
        borderColor: "#E2E8F0",
        borderWidth: 1,
        padding: 12,
        boxPadding: 4,
        titleFont: { family: "Manrope", size: 12, weight: "bold" as any },
        bodyFont: { family: "Manrope", size: 12, weight: "bold" as any },
        callbacks: {
          label: (context: any) => ` Revenue: €${Number(context.raw).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        },
      },
    },
    scales: {
      x: {
        min: 0,
        max: 80000,
        ticks: {
          stepSize: 20000,
          callback: (val: any) => `€${Number(val).toLocaleString("de-DE")}`,
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
          color: "#475569",
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-[20px] border border-[#E2E8F0] shadow-sm w-full">
      <h3 className="text-sm font-bold text-[#1E293B] mb-6">{title}</h3>
      <div className="h-[340px] sm:h-[380px] w-full">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
