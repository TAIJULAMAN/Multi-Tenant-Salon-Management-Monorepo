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

interface GeographyNewVsReturningChartProps {
  viewBy?: "regions" | "cities";
}

const regionsData = [
  { name: "Veneto", newClients: 3, returningClients: 62 },
  { name: "Sicilia", newClients: 2, returningClients: 40 },
  { name: "Puglia", newClients: 1, returningClients: 20 },
  { name: "Lazio", newClients: 2, returningClients: 20 },
  { name: "Campania", newClients: 1, returningClients: 20 },
  { name: "Emilia-Romagna", newClients: 2, returningClients: 17 },
  { name: "Marche", newClients: 1, returningClients: 18 },
  { name: "Liguria", newClients: 1, returningClients: 17 },
  { name: "Toscana", newClients: 1, returningClients: 18 },
  { name: "Umbria", newClients: 1, returningClients: 17 },
];

const citiesData = [
  { name: "Milan", newClients: 4, returningClients: 54 },
  { name: "Rome", newClients: 3, returningClients: 45 },
  { name: "Naples", newClients: 2, returningClients: 24 },
  { name: "Palermo", newClients: 2, returningClients: 22 },
  { name: "Florence", newClients: 2, returningClients: 20 },
  { name: "Venice", newClients: 2, returningClients: 19 },
  { name: "Turin", newClients: 1, returningClients: 19 },
  { name: "Bologna", newClients: 1, returningClients: 18 },
  { name: "Verona", newClients: 1, returningClients: 17 },
  { name: "Bari", newClients: 1, returningClients: 16 },
];

export function GeographyNewVsReturningChart({
  viewBy = "regions",
}: GeographyNewVsReturningChartProps) {
  const currentData = viewBy === "regions" ? regionsData : citiesData;
  const unit = viewBy === "regions" ? "Region" : "City";

  const chartData = {
    labels: currentData.map((d) => d.name),
    datasets: [
      {
        label: "New",
        data: currentData.map((d) => d.newClients),
        backgroundColor: "#635BFF",
        hoverBackgroundColor: "#5249E6",
        barThickness: 32,
      },
      {
        label: "Returning",
        data: currentData.map((d) => d.returningClients),
        backgroundColor: "#FF5B79",
        hoverBackgroundColor: "#F43F5E",
        borderRadius: { topLeft: 4, topRight: 4 },
        barThickness: 32,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom" as const,
        labels: {
          usePointStyle: true,
          pointStyle: "rectRounded" as const,
          boxWidth: 10,
          boxHeight: 10,
          padding: 20,
          font: { family: "Manrope", size: 12, weight: "bold" as any },
          color: "#475569",
        },
      },
      tooltip: {
        backgroundColor: "white",
        titleColor: "#1E293B",
        borderColor: "#E2E8F0",
        borderWidth: 1,
        padding: 12,
        titleFont: { family: "Manrope", size: 12, weight: "bold" as any },
        bodyFont: { family: "Manrope", size: 12, weight: "bold" as any },
        callbacks: {
          label: (context: any) => ` ${context.dataset.label}: ${context.raw} clients`,
          afterBody: (context: any) => {
            const dataIndex = context[0].dataIndex;
            const item = currentData[dataIndex];
            const total = item.newClients + item.returningClients;
            return ` Total: ${total} clients`;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          font: { family: "Manrope", size: 10, weight: 600 as any },
          color: "#94A3B8",
          maxRotation: 45,
          minRotation: 45,
        },
        grid: {
          display: false,
        },
      },
      y: {
        stacked: true,
        min: 0,
        max: 80,
        ticks: {
          stepSize: 20,
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
    },
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-[20px] border border-[#E2E8F0] shadow-sm w-full">
      <h3 className="text-sm font-bold text-[#1E293B] mb-6">
        New vs Returning Clients by {unit}
      </h3>
      <div className="h-[280px] sm:h-[320px] w-full">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}
