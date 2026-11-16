"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Bar } from "react-chartjs-2";
import { PaymentsPerYearChartProps } from "./types";

export const PaymentsPerYearChart: React.FC<PaymentsPerYearChartProps> = ({ data, options }) => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  const totalItems = data?.labels?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedData = {
    ...data,
    labels: data.labels?.slice((page - 1) * itemsPerPage, page * itemsPerPage),
    datasets: data.datasets?.map((ds: any) => ({
      ...ds,
      data: ds.data?.slice((page - 1) * itemsPerPage, page * itemsPerPage)
    }))
  };

  const handlePrev = () => setPage(p => Math.max(1, p - 1));
  const handleNext = () => setPage(p => Math.min(totalPages, p + 1));

  return (
    <div className="border border-[#E2E8F0] rounded-[16px] p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h3 className="font-bold text-[#1E293B] text-[14px]">Payments per Year</h3>
        <div className="hidden sm:flex flex-col items-end opacity-0 pointer-events-none">
          {/* Spacer to match layout height if needed, hidden */}
          <span className="text-xs">spacer</span>
        </div>
      </div>

      {/* Left Y Axis Custom Labels Overlay */}
      <div className="relative h-[280px]">
        <div className="ml-10 h-full w-[calc(100%-40px)]">
          <Bar data={paginatedData} options={options} />
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button 
          onClick={handlePrev}
          disabled={page === 1}
          className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${page === 1 ? 'border-[#F1F5F9] text-[#CBD5E1] cursor-not-allowed' : 'border-[#E2E8F0] text-[#94A3B8] hover:bg-[#F8FAFC]'}`}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button 
          onClick={handleNext}
          disabled={page === totalPages || totalPages === 0}
          className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${page === totalPages || totalPages === 0 ? 'border-[#F1F5F9] text-[#CBD5E1] cursor-not-allowed' : 'border-[#E2E8F0] text-[#635BFF] hover:bg-[#EEF2FF]'}`}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
