"use client";

import React from "react";
import { Search, ChevronDown, Plus } from "lucide-react";

interface ReceiptsFilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  activeMethod: string;
  onMethodChange: (value: string) => void;
  dateRange: string;
  onDateRangeChange: (value: string) => void;
  onAddReceipt: () => void;
}

export const ReceiptsFilterBar: React.FC<ReceiptsFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  activeMethod,
  onMethodChange,
  dateRange,
  onDateRangeChange,
  onAddReceipt,
}) => {
  return (
    <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm border border-[#E2E8F0]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-xl font-bold text-[#1E293B]">Receipts</h1>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          {/* Search Bar */}
          <div className="relative max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search by client or email..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#E2E8F0] text-[13px] text-[#1E293B] font-medium focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 focus:border-[#635BFF] transition-all placeholder:text-[#94A3B8]"
            />
          </div>

          {/* Method Filter Select */}
          <div className="relative w-full sm:w-[150px]">
            <select
              value={activeMethod}
              onChange={(e) => onMethodChange(e.target.value)}
              className="w-full appearance-none bg-white border border-[#E2E8F0] text-[#475569] text-[13px] font-bold px-4 py-2.5 rounded-lg pr-10 outline-none cursor-pointer hover:bg-[#F8FAFC] transition-colors"
            >
              <option value="All">All Methods</option>
              <option value="Cash">Cash</option>
              <option value="Card Terminal">Card Terminal</option>
              <option value="Gift Card">Gift Card</option>
              <option value="Online P.">Online P.</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#94A3B8]">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>

          {/* Date Range Select */}
          <div className="relative w-full sm:w-[150px]">
            <select
              value={dateRange}
              onChange={(e) => onDateRangeChange(e.target.value)}
              className="w-full appearance-none bg-white border border-[#E2E8F0] text-[#475569] text-[13px] font-bold px-4 py-2.5 rounded-lg pr-10 outline-none cursor-pointer hover:bg-[#F8FAFC] transition-colors"
            >
              <option value="All Time">All Time</option>
              <option value="Today">Today</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#94A3B8]">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>

          <button
            onClick={onAddReceipt}
            className="bg-[#635BFF] hover:bg-[#524be0] text-white px-5 py-2.5 rounded-lg font-bold text-[13px] flex justify-center items-center gap-2 transition-colors shadow-sm shadow-[#635BFF]/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Receipt</span>
          </button>
        </div>
      </div>
    </div>
  );
};
