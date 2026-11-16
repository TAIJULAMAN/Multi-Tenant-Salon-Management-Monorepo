"use client";

import React from "react";
import { Plus, Download } from "lucide-react";

interface StockFilterHeaderProps {
  activeCategory: string;
  onCategoryChange: (value: string) => void;
  activeStatus: string;
  onStatusChange: (value: string) => void;
  onAddMovement: () => void;
}

export default function StockFilterHeader({
  activeCategory,
  onCategoryChange,
  activeStatus,
  onStatusChange,
  onAddMovement,
}: StockFilterHeaderProps) {
  return (
    <div className="bg-white rounded-lg p-8 shadow-sm border border-[#E2E8F0] space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-xl font-bold text-[#1E293B] font-manrope">
          Stock In / Stock Out
        </h1>
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full md:w-auto">
          <select
            value={activeCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full md:w-auto bg-white border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-[13px] font-bold text-[#475569] outline-none cursor-pointer hover:bg-[#F8FAFC] transition-colors"
          >
            <option value="All">All Categories</option>
            <option value="Category 1">Category 1</option>
            <option value="Category 2">Category 2</option>
            <option value="Category 3">Category 3</option>
          </select>
          <select
            value={activeStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full md:w-auto bg-white border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-[13px] font-bold text-[#475569] outline-none cursor-pointer hover:bg-[#F8FAFC] transition-colors"
          >
            <option value="All">All Status</option>
            <option value="In Stock">In Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
          <button className="w-full md:w-auto justify-center bg-[#E0E7FF] hover:bg-[#c7d2fe] text-[#635BFF] px-5 py-2.5 rounded-lg font-bold text-[13px] flex items-center gap-2 transition-colors whitespace-nowrap">
            <Download className="w-4 h-4" />
            Export Data
          </button>
          <button
            onClick={onAddMovement}
            className="w-full md:w-auto justify-center bg-[#635BFF] hover:bg-[#524be0] text-white px-5 py-2.5 rounded-lg font-bold text-[13px] flex items-center gap-2 transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add Movement
          </button>
        </div>
      </div>
    </div>
  );
}
