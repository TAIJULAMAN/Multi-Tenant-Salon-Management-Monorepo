"use client";

import React, { useState } from "react";
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
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type PeriodType = "Daily" | "Weekly" | "Monthly" | "Yearly";

interface PeriodData {
  labels: string[];
  usageData: number[];
  restockData: number[];
  maxScale: number;
  stepSize: number;
  restock: {
    qty: string;
    costExclVat: string;
    costInclVat: string;
  };
  usage: {
    qty: string;
    costExclVat: string;
    costInclVat: string;
  };
}

const periodDataMap: Record<PeriodType, PeriodData> = {
  Daily: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    usageData: [15, 22, 18, 30, 45, 28, 12],
    restockData: [120, 0, 450, 0, 800, 310, 0],
    maxScale: 1000,
    stepSize: 250,
    restock: {
      qty: "1680",
      costExclVat: "€40.656",
      costInclVat: "€49.600",
    },
    usage: {
      qty: "170",
      costExclVat: "€0",
      costInclVat: "€0",
    },
  },
  Weekly: {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    usageData: [40, 52, 48, 30],
    restockData: [950, 1420, 1530, 780],
    maxScale: 1800,
    stepSize: 450,
    restock: {
      qty: "4680",
      costExclVat: "€113.344",
      costInclVat: "€138.280",
    },
    usage: {
      qty: "170",
      costExclVat: "€0",
      costInclVat: "€0",
    },
  },
  Monthly: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    usageData: [0, 0, 0, 0, 0, 80, 110, 120, 100, 0, 0, 0],
    restockData: [0, 0, 0, 0, 0, 850, 1500, 1520, 720, 0, 0, 0],
    maxScale: 1800,
    stepSize: 450,
    restock: {
      qty: "4680",
      costExclVat: "€113.344",
      costInclVat: "€138.280",
    },
    usage: {
      qty: "410",
      costExclVat: "€0",
      costInclVat: "€0",
    },
  },
  Yearly: {
    labels: ["2022", "2023", "2024", "2025", "2026"],
    usageData: [280, 340, 390, 420, 170],
    restockData: [3200, 4100, 4800, 5100, 4680],
    maxScale: 6000,
    stepSize: 1500,
    restock: {
      qty: "21880",
      costExclVat: "€529.936",
      costInclVat: "€646.522",
    },
    usage: {
      qty: "1600",
      costExclVat: "€0",
      costInclVat: "€0",
    },
  },
};

export function InternalUsageRestockCard() {
  const [period, setPeriod] = useState<PeriodType>("Monthly");
  const current = periodDataMap[period] || periodDataMap.Monthly;

  const data = {
    labels: current.labels,
    datasets: [
      {
        label: "Internal Usage",
        data: current.usageData,
        backgroundColor: "#FF5B79",
        hoverBackgroundColor: "#e84e6b",
        borderRadius: 4,
        barThickness: period === "Daily" || period === "Weekly" ? 20 : 12,
      },
      {
        label: "Restock (Load)",
        data: current.restockData,
        backgroundColor: "#22C55E",
        hoverBackgroundColor: "#16a34a",
        borderRadius: 4,
        barThickness: period === "Daily" || period === "Weekly" ? 20 : 12,
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
      },
    },
    scales: {
      y: {
        min: 0,
        max: current.maxScale,
        ticks: {
          stepSize: current.stepSize,
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
    <div className="bg-white p-4 sm:p-6 rounded-[20px] border border-[#E2E8F0] shadow-sm w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-sm font-bold text-[#1E293B]">Internal Usage & Restock Analysis</h3>
          <p className="text-[11px] font-semibold text-[#94A3B8] mt-0.5">Analysis Period</p>
        </div>
        <div className="inline-flex bg-[#F1F5F9] p-1 rounded-lg self-start sm:self-auto max-w-full overflow-x-auto">
          {(["Daily", "Weekly", "Monthly", "Yearly"] as PeriodType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setPeriod(tab)}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                period === tab
                  ? "bg-[#635BFF] text-white shadow-sm"
                  : "text-[#64748B] hover:text-[#1E293B]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left metrics cards */}
        <div className="w-full lg:col-span-4 space-y-4">
          {/* Restock Load Card */}
          <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/40">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-700 tracking-wider mb-3">
              <ArrowDownLeft className="w-3 h-3" />
              RESTOCK (LOAD)
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#64748B] font-medium">Qty Loaded</span>
                <span className="text-lg font-extrabold text-[#1E293B]">{current.restock.qty}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#64748B] font-medium">Cost Excl. VAT</span>
                <span className="font-bold text-[#1E293B]">{current.restock.costExclVat}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#64748B] font-medium">Cost Incl. VAT</span>
                <span className="font-bold text-emerald-600">{current.restock.costInclVat}</span>
              </div>
            </div>
          </div>

          {/* Usage Unload Card */}
          <div className="p-4 rounded-xl border border-rose-100 bg-rose-50/40">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-rose-100 text-rose-700 tracking-wider mb-3">
              <ArrowUpRight className="w-3 h-3" />
              USAGE (UNLOAD)
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#64748B] font-medium">Qty Used</span>
                <span className="text-lg font-extrabold text-[#1E293B]">{current.usage.qty}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#64748B] font-medium">Cost Excl. VAT</span>
                <span className="font-bold text-[#1E293B]">{current.usage.costExclVat}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#64748B] font-medium">Cost Incl. VAT</span>
                <span className="font-bold text-[#EF4444]">{current.usage.costInclVat}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Chart */}
        <div className="w-full lg:col-span-8 h-[240px] sm:h-[280px]">
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  );
}
