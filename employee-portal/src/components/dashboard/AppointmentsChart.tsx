"use client";

import React, { useState, useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { ChevronDown } from "lucide-react";
import CustomExportModal from "@/components/customComponent/CustomExportModal";
import CustomExportButton from "@/components/customComponent/CustomExportButton";
import { ChartOptions } from "chart.js";

const periodData: Record<
  string,
  {
    subtitle: string;
    labels: string[];
    completed: number[];
    cancelled: number[];
    yMax: number;
    stepSize: number;
  }
> = {
  Monthly: {
    subtitle: "Last 12 Months",
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
    completed: [70, 56, 80, 58, 28, 28, 28, 28, 28, 28, 28, 28],
    cancelled: [28, 36, 48, 26, 48, 48, 48, 48, 48, 48, 48, 48],
    yMax: 100,
    stepSize: 20,
  },
  Weekly: {
    subtitle: "Last 7 Days",
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    completed: [14, 18, 16, 22, 28, 32, 10],
    cancelled: [3, 2, 4, 2, 5, 4, 1],
    yMax: 40,
    stepSize: 10,
  },
  Yearly: {
    subtitle: "Last 5 Years",
    labels: ["2021", "2022", "2023", "2024", "2025"],
    completed: [420, 510, 640, 780, 890],
    cancelled: [110, 130, 150, 170, 140],
    yMax: 1000,
    stepSize: 200,
  },
};

export default function AppointmentsChart() {
  const [selectedPeriod, setSelectedPeriod] = useState<"Monthly" | "Weekly" | "Yearly">("Monthly");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const availablePeriods: ("Monthly" | "Weekly" | "Yearly")[] = ["Monthly", "Weekly", "Yearly"];
  const current = periodData[selectedPeriod] || periodData.Monthly;

  const chartData = useMemo(() => {
    return {
      labels: current.labels,
      datasets: [
        {
          label: "Completed",
          data: current.completed,
          backgroundColor: "#635BFF",
          borderRadius: 8,
          barPercentage: 0.6,
          categoryPercentage: 0.5,
        },
        {
          label: "Cancelled",
          data: current.cancelled,
          backgroundColor: "#F43F5E",
          borderRadius: 8,
          barPercentage: 0.6,
          categoryPercentage: 0.5,
        },
      ],
    };
  }, [current]);

  const chartOptions: ChartOptions<"bar"> = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          backgroundColor: "#FFFFFF",
          titleColor: "#1E293B",
          bodyColor: "#64748B",
          borderColor: "#E2E8F0",
          borderWidth: 1,
          padding: 10,
          cornerRadius: 10,
          displayColors: true,
          boxWidth: 8,
          boxHeight: 8,
          titleFont: { size: 12, weight: "bold", family: "'Manrope', sans-serif" },
          bodyFont: { size: 11, weight: "bold", family: "'Manrope', sans-serif" },
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
          min: 0,
          max: current.yMax,
        },
      },
    };
  }, [current]);

  return (
    <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E2E8F0] shadow-sm font-manrope h-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-2 justify-between items-start mb-6">
        <div>
          <h2 className="text-[16px] font-bold text-[#1E293B]">Appointments</h2>
          <p className="text-[12px] text-[#94A3B8] font-medium mt-1">
            {current.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 border border-[#E2E8F0] rounded-lg text-[12px] font-semibold text-[#1E293B] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
            >
              {selectedPeriod} <ChevronDown className="w-3 h-3 text-[#64748B]" />
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
      <div className="flex-1 relative min-h-[250px]">
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* Legend Footer */}
      <div className="flex items-center gap-6 mt-6">
        <div className="flex items-center gap-2 text-[12px] font-semibold text-[#64748B]">
          <div className="w-2.5 h-2.5 rounded-full bg-[#635BFF]" />
          Completed
        </div>
        <div className="flex items-center gap-2 text-[12px] font-semibold text-[#64748B]">
          <div className="w-2.5 h-2.5 rounded-full bg-[#F43F5E]" />
          Cancelled
        </div>
      </div>

      <CustomExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title="Export Appointments Data"
      />
    </div>
  );
}
