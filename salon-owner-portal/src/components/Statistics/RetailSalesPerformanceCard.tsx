"use client";

import React, { useState } from "react";
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
import { DollarSign, TrendingUp, ShoppingBag, Info } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

type SalesPeriodType = "Daily" | "Weekly" | "Monthly" | "Yearly";

interface SalesPeriodData {
  labels: string[];
  salesCurve: number[];
  maxScale: number;
  stepSize: number;
  revenue: {
    gross: string;
    net: string;
  };
  profit: {
    marginNet: string;
    marginGross: string;
  };
  sales: {
    itemsSold: string;
    avgPerItem: string;
  };
}

const salesPeriodDataMap: Record<SalesPeriodType, SalesPeriodData> = {
  Daily: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    salesCurve: [120, 240, 380, 510, 980, 1420, 650],
    maxScale: 1600,
    stepSize: 400,
    revenue: {
      gross: "€4300",
      net: "€3524",
    },
    profit: {
      marginNet: "€1448",
      marginGross: "€1767",
    },
    sales: {
      itemsSold: "85",
      avgPerItem: "€50,58",
    },
  },
  Weekly: {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    salesCurve: [1850, 2420, 3100, 2088],
    maxScale: 3500,
    stepSize: 1000,
    revenue: {
      gross: "€9458",
      net: "€7752",
    },
    profit: {
      marginNet: "€3187",
      marginGross: "€3888",
    },
    sales: {
      itemsSold: "188",
      avgPerItem: "€50,31",
    },
  },
  Monthly: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    salesCurve: [0, 0, 0, 0, 150, 1200, 2600, 3600, 2000, 300, 0, 0],
    maxScale: 4000,
    stepSize: 1000,
    revenue: {
      gross: "€9458",
      net: "€7752",
    },
    profit: {
      marginNet: "€3187",
      marginGross: "€3888",
    },
    sales: {
      itemsSold: "188",
      avgPerItem: "€50,31",
    },
  },
  Yearly: {
    labels: ["2022", "2023", "2024", "2025", "2026"],
    salesCurve: [12500, 24800, 31200, 39600, 28500],
    maxScale: 45000,
    stepSize: 15000,
    revenue: {
      gross: "€136600",
      net: "€111967",
    },
    profit: {
      marginNet: "€46020",
      marginGross: "€56144",
    },
    sales: {
      itemsSold: "2715",
      avgPerItem: "€50,31",
    },
  },
};

export function RetailSalesPerformanceCard() {
  const [period, setPeriod] = useState<SalesPeriodType>("Monthly");
  const current = salesPeriodDataMap[period] || salesPeriodDataMap.Monthly;

  const data = {
    labels: current.labels,
    datasets: [
      {
        label: "Sales",
        data: current.salesCurve,
        borderColor: "#635BFF",
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 250);
          gradient.addColorStop(0, "rgba(99, 91, 255, 0.2)");
          gradient.addColorStop(1, "rgba(99, 91, 255, 0.0)");
          return gradient;
        },
        fill: true,
        borderWidth: 2.5,
        tension: 0.45,
        pointRadius: 0,
        pointHitRadius: 30,
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
      mode: "index" as const,
      intersect: false,
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
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
          title: (items: any) => (items.length ? `${items[0].label}` : ""),
          label: (context: any) => ` Retail Sales: €${Number(context.raw).toLocaleString()}`,
        },
      },
    },
    scales: {
      y: {
        min: 0,
        max: current.maxScale,
        ticks: {
          stepSize: current.stepSize,
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
    <div className="bg-white p-4 sm:p-6 rounded-[20px] border border-[#E2E8F0] shadow-sm w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-sm font-bold text-[#1E293B]">Retail Sales Performance</h3>
          <p className="text-[11px] font-semibold text-[#94A3B8] mt-0.5">Sales Period</p>
        </div>
        <div className="inline-flex bg-[#F1F5F9] p-1 rounded-lg self-start sm:self-auto max-w-full overflow-x-auto">
          {(["Daily", "Weekly", "Monthly", "Yearly"] as SalesPeriodType[]).map((tab) => (
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
        {/* Left summary blocks */}
        <div className="w-full lg:col-span-4 space-y-3">
          {/* Revenue */}
          <div className="p-3.5 rounded-xl border border-indigo-100 bg-indigo-50/40">
            <div className="flex items-center justify-between mb-2">
              <div className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase text-[#635BFF] tracking-wider">
                <DollarSign className="w-3 h-3" />
                REVENUE
              </div>
              <div className="group relative">
                <Info className="w-3.5 h-3.5 text-indigo-400 hover:text-indigo-600 cursor-pointer transition-colors" />
                <div className="absolute right-0 bottom-full mb-1.5 hidden group-hover:block z-30 w-48 p-2 bg-[#1E293B] text-white text-[11px] font-medium rounded-lg shadow-xl pointer-events-none transition-all">
                  Gross includes VAT. Net shows earnings excluding VAT.
                </div>
              </div>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#64748B] font-medium">Gross (Incl. VAT)</span>
                <span className="font-extrabold text-sm text-[#635BFF]">{current.revenue.gross}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#64748B] font-medium">Net (Excl. VAT)</span>
                <span className="font-bold text-[#1E293B]">{current.revenue.net}</span>
              </div>
            </div>
          </div>

          {/* Profit */}
          <div className="p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/40">
            <div className="flex items-center justify-between mb-2">
              <div className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase text-emerald-600 tracking-wider">
                <TrendingUp className="w-3 h-3" />
                PROFIT
              </div>
              <div className="group relative">
                <Info className="w-3.5 h-3.5 text-emerald-400 hover:text-emerald-600 cursor-pointer transition-colors" />
                <div className="absolute right-0 bottom-full mb-1.5 hidden group-hover:block z-30 w-48 p-2 bg-[#1E293B] text-white text-[11px] font-medium rounded-lg shadow-xl pointer-events-none transition-all">
                  Profit margins calculated on retail sales after product cost and taxes.
                </div>
              </div>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#64748B] font-medium">Margin (Net)</span>
                <span className="font-extrabold text-sm text-emerald-600">{current.profit.marginNet}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#64748B] font-medium">Margin (Gross)</span>
                <span className="font-bold text-[#1E293B]">{current.profit.marginGross}</span>
              </div>
            </div>
          </div>

          {/* Sales */}
          <div className="p-3.5 rounded-xl border border-amber-100 bg-amber-50/40">
            <div className="flex items-center justify-between mb-2">
              <div className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase text-amber-600 tracking-wider">
                <ShoppingBag className="w-3 h-3" />
                SALES
              </div>
              <div className="group relative">
                <Info className="w-3.5 h-3.5 text-amber-400 hover:text-amber-600 cursor-pointer transition-colors" />
                <div className="absolute right-0 bottom-full mb-1.5 hidden group-hover:block z-30 w-48 p-2 bg-[#1E293B] text-white text-[11px] font-medium rounded-lg shadow-xl pointer-events-none transition-all">
                  Total retail products sold and average revenue per item.
                </div>
              </div>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#64748B] font-medium">Items Sold</span>
                <span className="font-extrabold text-sm text-[#1E293B]">{current.sales.itemsSold}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#64748B] font-medium">Avg. per Item</span>
                <span className="font-bold text-[#1E293B]">{current.sales.avgPerItem}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Bell Curve Chart */}
        <div className="w-full lg:col-span-8 h-[240px] sm:h-[280px]">
          <Line data={data} options={options} />
        </div>
      </div>
    </div>
  );
}
