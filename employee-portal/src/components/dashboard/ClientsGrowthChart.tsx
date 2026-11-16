"use client";

import React, { useState, useMemo } from "react";
import { Line } from "react-chartjs-2";
import { ChartOptions } from "chart.js";
import { ChevronDown } from "lucide-react";
import CustomExportModal from "@/components/customComponent/CustomExportModal";
import CustomExportButton from "@/components/customComponent/CustomExportButton";

const clientGrowthPeriods: Record<
  string,
  {
    subtitle: string;
    growth: string;
    labels: string[];
    dataset1Label: string;
    dataset1Data: number[];
    dataset2Label: string;
    dataset2Data: number[];
    yMin: number;
    yMax: number;
    stepSize: number;
  }
> = {
  Monthly: {
    subtitle: "Last 12 Months",
    growth: "+15%",
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    dataset1Label: "Mar, 2025",
    dataset1Data: [110, 120, 140, 130, 115, 115, 120, 140, 150, 140, 110, 95],
    dataset2Label: "Mar, 2024",
    dataset2Data: [260, 250, 190, 180, 175, 120, 95, 100, 140, 150, 140, 125],
    yMin: 0,
    yMax: 300,
    stepSize: 50,
  },
  Weekly: {
    subtitle: "Last 7 Days",
    growth: "+8%",
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    dataset1Label: "This Week",
    dataset1Data: [18, 22, 28, 25, 30, 36, 14],
    dataset2Label: "Last Week",
    dataset2Data: [15, 19, 24, 21, 26, 31, 12],
    yMin: 0,
    yMax: 40,
    stepSize: 10,
  },
  Yearly: {
    subtitle: "Last 5 Years",
    growth: "+24%",
    labels: ["2021", "2022", "2023", "2024", "2025"],
    dataset1Label: "Target",
    dataset1Data: [450, 580, 720, 890, 1040],
    dataset2Label: "Actual",
    dataset2Data: [420, 550, 690, 850, 1010],
    yMin: 0,
    yMax: 1200,
    stepSize: 200,
  },
};

export default function ClientsGrowthChart() {
  const [selectedPeriod, setSelectedPeriod] = useState<"Monthly" | "Weekly" | "Yearly">("Monthly");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const availablePeriods: ("Monthly" | "Weekly" | "Yearly")[] = ["Monthly", "Weekly", "Yearly"];
  const current = clientGrowthPeriods[selectedPeriod] || clientGrowthPeriods.Monthly;

  const chartData = useMemo(() => {
    return {
      labels: current.labels,
      datasets: [
        {
          label: current.dataset1Label,
          data: current.dataset1Data,
          borderColor: "#2DD4BF",
          backgroundColor: "#2DD4BF",
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: "#2DD4BF",
          pointHoverRadius: 6,
        },
        {
          label: current.dataset2Label,
          data: current.dataset2Data,
          borderColor: "#635BFF",
          backgroundColor: "#635BFF",
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: "#635BFF",
          pointHoverRadius: 6,
        },
      ],
    };
  }, [current]);

  const options: ChartOptions<"line"> = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false,
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          backgroundColor: "#FFFFFF",
          titleColor: "#1E293B",
          bodyColor: "#1E293B",
          borderColor: "#E2E8F0",
          borderWidth: 1,
          padding: 12,
          cornerRadius: 12,
          boxPadding: 4,
          displayColors: true,
          boxWidth: 8,
          boxHeight: 8,
          usePointStyle: true,
          titleFont: { size: 12, weight: "bold", family: "'Manrope', sans-serif" },
          bodyFont: { size: 11, weight: "bold", family: "'Manrope', sans-serif" },
          callbacks: {
            title: (items) => `${items[0].label}`,
            label: (context) => ` ${context.dataset.label}: ${context.raw}`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: "#94A3B8",
            font: { size: 11, family: "'Manrope', sans-serif" },
          },
        },
        y: {
          grid: { color: "#F1F5F9" },
          border: { display: false },
          ticks: {
            color: "#94A3B8",
            font: { size: 11, family: "'Manrope', sans-serif" },
            stepSize: current.stepSize,
          },
          min: current.yMin,
          max: current.yMax,
        },
      },
    };
  }, [current]);

  return (
    <div className="w-full bg-white p-6 sm:p-7 rounded-2xl border border-[#E2E8F0] shadow-sm font-manrope">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-2 justify-between items-start mb-6">
        <div>
          <h2 className="text-[16px] font-bold text-[#1E293B]">New Clients</h2>
          <p className="text-[12px] text-[#94A3B8] font-medium mt-1">
            {current.subtitle}{" "}
            <span className="text-[#10B981] font-bold">{current.growth}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 border border-[#E2E8F0] rounded-lg text-[12px] font-semibold text-[#1E293B] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
            >
              {selectedPeriod}{" "}
              <ChevronDown className="w-3 h-3 text-[#64748B]" />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-28 bg-white border border-[#E2E8F0] rounded-lg shadow-lg z-20 py-1">
                {availablePeriods.map((period) => (
                  <button
                    key={period}
                    onClick={() => {
                      setSelectedPeriod(period);
                      setIsMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-[12px] hover:bg-[#F8FAFC] transition-colors cursor-pointer ${
                      selectedPeriod === period
                        ? "text-[#635BFF] font-bold"
                        : "text-[#64748B] font-medium"
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            )}
          </div>

          <CustomExportButton
            label="Export Data"
            onClick={() => setIsExportModalOpen(true)}
            variant="outline"
          />
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-[280px] relative mt-2">
        <Line data={chartData} options={options} />
      </div>

      <CustomExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title="Export New Clients Data"
      />
    </div>
  );
}
