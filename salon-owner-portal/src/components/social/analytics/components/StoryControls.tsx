"use client";

import React from "react";
import { Search } from "lucide-react";
import { StoryControlsProps } from "../../types";

export function StoryControls({
  search,
  setSearch,
  setCurrentPage,
}: StoryControlsProps) {
  return (
    <div className="pb-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 shrink-0">
      <div className="relative w-full sm:w-64">
        <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full h-10 pl-9 pr-4 rounded-lg border border-[#E2E8F0] focus:outline-none focus:border-[#635BFF] transition-colors text-sm text-[#1E293B]"
        />
      </div>
    </div>
  );
}
