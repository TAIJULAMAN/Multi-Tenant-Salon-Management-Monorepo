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

interface GeographyClientsAndTicketChartsProps {
  viewBy?: "regions" | "cities";
}

const regionsData = [
  { name: "Veneto", clients: 65, avgTicket: 137.87 },
  { name: "Sicilia", clients: 42, avgTicket: 146.30 },
  { name: "Puglia", clients: 21, avgTicket: 142.70 },
  { name: "Lazio", clients: 22, avgTicket: 138.21 },
  { name: "Campania", clients: 21, avgTicket: 141.85 },
  { name: "Emilia-Romagna", clients: 19, avgTicket: 145.47 },
  { name: "Marche", clients: 19, avgTicket: 142.52 },
  { name: "Liguria", clients: 18, avgTicket: 148.27 },
  { name: "Toscana", clients: 19, avgTicket: 137.39 },
  { name: "Umbria", clients: 18, avgTicket: 142.33 },
];

const citiesData = [
  { name: "Milan", clients: 58, avgTicket: 148.50 },
  { name: "Rome", clients: 48, avgTicket: 142.20 },
  { name: "Naples", clients: 26, avgTicket: 139.80 },
  { name: "Palermo", clients: 24, avgTicket: 144.10 },
  { name: "Florence", clients: 22, avgTicket: 145.60 },
  { name: "Venice", clients: 21, avgTicket: 147.20 },
  { name: "Turin", clients: 20, avgTicket: 138.90 },
  { name: "Bologna", clients: 19, avgTicket: 143.40 },
  { name: "Verona", clients: 18, avgTicket: 141.70 },
  { name: "Bari", clients: 17, avgTicket: 136.50 },
];

export function GeographyClientsAndTicketCharts({ viewBy = "regions" }: GeographyClientsAndTicketChartsProps) {
  const currentData = viewBy === "regions" ? regionsData : citiesData;
  const unit = viewBy === "regions" ? "Region" : "City";

  // 1. Clients Chart Data
  const clientsChartData = {
    labels: currentData.map((d) => d.name),
    datasets: [
      {
        label: "Clients",
        data: currentData.map((d) => d.clients),
        backgroundColor: "#00D0C7",
        hoverBackgroundColor: "#00B8B0",
        borderRadius: 4,
        barThickness: 16,
      },
    ],
  };

  const clientsChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "white",
        titleColor: "#1E293B",
        bodyColor: "#00D0C7",
        borderColor: "#E2E8F0",
        borderWidth: 1,
        padding: 12,
        titleFont: { family: "Manrope", size: 12, weight: "bold" as any },
        bodyFont: { family: "Manrope", size: 12, weight: "bold" as any },
        callbacks: {
          label: (context: any) => ` Clients: ${context.raw}`,
        },
      },
    },
    scales: {
      y: {
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
      x: {
        ticks: {
          font: { family: "Manrope", size: 9, weight: 600 as any },
          color: "#94A3B8",
          maxRotation: 45,
          minRotation: 45,
        },
        grid: {
          display: false,
        },
      },
    },
  };

  // 2. Avg Ticket Chart Data
  const avgTicketChartData = {
    labels: currentData.map((d) => d.name),
    datasets: [
      {
        label: "Avg Ticket",
        data: currentData.map((d) => d.avgTicket),
        backgroundColor: "#22C55E",
        hoverBackgroundColor: "#16A34A",
        borderRadius: 4,
        barThickness: 16,
      },
    ],
  };

  const avgTicketChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "white",
        titleColor: "#1E293B",
        bodyColor: "#22C55E",
        borderColor: "#E2E8F0",
        borderWidth: 1,
        padding: 12,
        titleFont: { family: "Manrope", size: 12, weight: "bold" as any },
        bodyFont: { family: "Manrope", size: 12, weight: "bold" as any },
        callbacks: {
          label: (context: any) => ` Avg Ticket: €${Number(context.raw).toFixed(2)}`,
        },
      },
    },
    scales: {
      y: {
        min: 0,
        max: 160,
        ticks: {
          stepSize: 40,
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
          font: { family: "Manrope", size: 9, weight: 600 as any },
          color: "#94A3B8",
          maxRotation: 45,
          minRotation: 45,
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
      {/* 1. Clients Chart */}
      <div className="bg-white p-4 sm:p-6 rounded-[20px] border border-[#E2E8F0] shadow-sm flex flex-col justify-between w-full">
        <h3 className="text-sm font-bold text-[#1E293B] mb-6">Clients by {unit}</h3>
        <div className="h-[240px] sm:h-[270px] w-full">
          <Bar data={clientsChartData} options={clientsChartOptions} />
        </div>
      </div>

      {/* 2. Avg Ticket Chart */}
      <div className="bg-white p-4 sm:p-6 rounded-[20px] border border-[#E2E8F0] shadow-sm flex flex-col justify-between w-full">
        <h3 className="text-sm font-bold text-[#1E293B] mb-6">Avg Ticket by {unit}</h3>
        <div className="h-[240px] sm:h-[270px] w-full">
          <Bar data={avgTicketChartData} options={avgTicketChartOptions} />
        </div>
      </div>
    </div>
  );
}
