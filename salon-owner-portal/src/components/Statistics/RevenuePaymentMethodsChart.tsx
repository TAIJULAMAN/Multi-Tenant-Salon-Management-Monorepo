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

const methods = ["Satispay", "Bancomat", "Carta", "Contanti"];
const methodValues = [12400, 9600, 10100, 8300];

export function RevenuePaymentMethodsChart() {
  const data = {
    labels: methods,
    datasets: [
      {
        data: methodValues,
        backgroundColor: "#FF5B79",
        hoverBackgroundColor: "#e84e6b",
        borderRadius: 4,
        barThickness: 20,
      },
    ],
  };

  const options = {
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
          label: (context: any) => ` Amount: €${context.raw.toLocaleString()}`,
        },
      },
    },
    scales: {
      y: {
        min: 0,
        max: 14000,
        ticks: {
          stepSize: 3500,
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
    <div className="bg-white p-6 rounded-[20px] border border-[#E2E8F0] shadow-sm">
      <h3 className="text-sm font-bold text-[#1E293B] mb-6">Payment Methods</h3>
      <div className="h-[250px]">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
