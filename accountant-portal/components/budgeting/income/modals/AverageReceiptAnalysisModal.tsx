"use client";

import React from "react";
import { X } from "lucide-react";
import { Chart as MixedChart } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from "chart.js";

// Ensure Chart.js components are registered
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export interface AverageReceiptAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  averageReceipt: number;
}

export function AverageReceiptAnalysisModal({
  isOpen,
  onClose,
  averageReceipt,
}: AverageReceiptAnalysisModalProps) {
  if (!isOpen) return null;

  // Chart dataset matching double bars + media line
  const chartData: ChartData<"bar" | "line"> = {
    labels: [
      "May 2024",
      "Jun 2024",
      "Jul 2024",
      "Aug 2024",
      "Sep 2024",
      "Oct 2024",
    ],
    datasets: [
      {
        type: "bar" as const,
        label: "Minimum",
        data: [38, 38, 38, 38, 38, 38],
        backgroundColor: "#fcc419", // yellow
        borderRadius: 3,
        borderSkipped: false,
        barThickness: 10,
      },
      {
        type: "bar" as const,
        label: "Maximum",
        data: [67, 67, 67, 67, 67, 67],
        backgroundColor: "#0ca678", // green
        borderRadius: 3,
        borderSkipped: false,
        barThickness: 10,
      },
      {
        type: "line" as const,
        label: "Media",
        data: [20, 32, 45, 36, 42, 45],
        borderColor: "#5c60f5", // blue
        borderWidth: 2,
        tension: 0.4,
        fill: false,
        pointBackgroundColor: "#ffffff",
        pointBorderColor: "#5c60f5",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions: ChartOptions<"bar" | "line"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          color: "#94a3b8",
          font: { size: 9, weight: 700 },
        },
      },
      y: {
        min: 0,
        max: 120,
        grid: { color: "#f8fafc" },
        border: { display: false },
        ticks: {
          stepSize: 30,
          color: "#94a3b8",
          font: { size: 9, weight: 700 },
          callback: (val: string | number) => `€ ${val}`,
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1e293b",
        padding: 8,
        cornerRadius: 6,
      },
    },
  };

  const monthlyDetails = [
    { period: "May 2024", media: 28, min: 28, max: 28, service: "Hair Cut" },
    { period: "Jun 2024", media: 42, min: 28, max: 28, service: "Hair Cut" },
    { period: "Jul 2024", media: 40, min: 28, max: 28, service: "Hair Cut" },
    { period: "Aug 2024", media: 38, min: 28, max: 28, service: "Hair Cut" },
    { period: "Sep 2024", media: 45, min: 28, max: 28, service: "Hair Cut" },
    { period: "Oct 2024", media: 45, min: 28, max: 28, service: "Hair Cut" },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm p-4 flex justify-center items-start sm:items-center py-6 sm:py-10 animate-in fade-in">
      <div className="bg-white max-w-4xl w-full rounded-2xl border border-slate-100 shadow-2xl p-6 relative flex flex-col gap-6 animate-in zoom-in-95 duration-200 my-auto">
        {/* Header */}
        <div className="flex items-start justify-between text-left">
          <div>
            <h2 className="text-base font-black text-slate-800 tracking-tight">
              Average Receipt Analysis
            </h2>
            <p className="text-xs font-bold text-slate-400 mt-0.5">
              Historical trend and detailed statistics
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-left">
          <div className="bg-[#f0f2ff]/30 border border-[#d0ebff] rounded-xl p-4">
            <h4 className="text-2xl font-black text-[#5c60f5]">
              €{" "}
              {averageReceipt.toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </h4>
            <span className="text-[10px] font-bold text-slate-400 mt-1 block">
              Current Receipt
            </span>
          </div>
          <div className="bg-[#e6fcf5]/30 border border-[#c3fae8] rounded-xl p-4">
            <h4 className="text-2xl font-black text-[#0ca678]">€ 67</h4>
            <span className="text-[10px] font-bold text-slate-400 mt-1 block">
              Maximum Period
            </span>
          </div>
          <div className="bg-[#fff0f6]/30 border border-[#ffdeeb] rounded-xl p-4">
            <h4 className="text-2xl font-black text-[#e64980]">€ 50</h4>
            <span className="text-[10px] font-bold text-slate-400 mt-1 block">
              Minimum Period
            </span>
          </div>
          <div className="bg-[#e0f2fe]/30 border border-[#bae6fd] rounded-xl p-4">
            <h4 className="text-2xl font-black text-[#0284c7]">+15.5%</h4>
            <span className="text-[10px] font-bold text-slate-400 mt-1 block">
              Trend
            </span>
          </div>
        </div>

        {/* Chart Area */}
        <div className="border border-slate-100 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-slate-800 text-left">
              Average Receipt Trend
            </h3>
            <div className="border border-slate-200 bg-white text-slate-700 text-[10px] font-bold px-3 py-1 rounded-lg">
              Last 3 months
            </div>
          </div>

          <div className="h-64 w-full relative">
            <MixedChart type="bar" data={chartData} options={chartOptions} />
          </div>

          {/* Legends */}
          <div className="flex justify-center gap-5 pt-2">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600">
              <span className="h-2.5 w-2.5 rounded-full bg-[#fcc419]" />
              <span>Minimum</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600">
              <span className="h-2.5 w-2.5 rounded-full bg-[#0ca678]" />
              <span>Maximum</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600">
              <span className="h-0.5 w-4 bg-[#5c60f5] relative flex items-center justify-center">
                <span className="h-2 w-2 rounded-full bg-[#5c60f5]" />
              </span>
              <span>Media</span>
            </div>
          </div>
        </div>

        {/* Table Area */}
        <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-100 overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f8fafc] border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-700 whitespace-nowrap">
                    Period
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-700 whitespace-nowrap">
                    Media
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-700 whitespace-nowrap">
                    Minimum
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-700 whitespace-nowrap">
                    Maximum
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-700 whitespace-nowrap">
                    N. Transactions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {monthlyDetails.map((item, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-3.5 text-xs font-semibold text-slate-500 whitespace-nowrap">
                      {item.period}
                    </td>
                    <td className="px-6 py-3.5 whitespace-nowrap">
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-lg border bg-[#e8f4fd] text-[#1971c2] border-[#d0ebff]/50">
                        € {item.media}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 whitespace-nowrap">
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-lg border bg-amber-50 text-amber-600 border-amber-100/50">
                        € {item.min}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 whitespace-nowrap">
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-lg border bg-emerald-50 text-emerald-600 border-emerald-100/50">
                        € {item.max}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-xs font-bold text-slate-500 whitespace-nowrap">
                      {item.service}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
