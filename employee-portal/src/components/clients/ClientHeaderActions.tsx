"use client";

import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import CustomSearch from "@/components/customComponent/CustomSearch";

interface ClientHeaderActionsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCount: number;
  onMassDeleteClick: () => void;
  onAddClientClick: () => void;
}

export default function ClientHeaderActions({
  searchQuery,
  onSearchChange,
  selectedCount,
  onMassDeleteClick,
  onAddClientClick,
}: ClientHeaderActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
      <div className="w-full sm:w-56">
        <CustomSearch
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Search client..."
        />
      </div>

      {selectedCount > 0 && (
        <button
          type="button"
          onClick={onMassDeleteClick}
          className="w-full sm:w-auto justify-center bg-[#FFE4E8] hover:bg-[#FCD5DC] text-[#FF4D6D] px-5 py-2 rounded-xl font-bold text-[13px] flex items-center gap-2 transition-colors shrink-0 cursor-pointer shadow-sm shadow-[#FF4D6D]/10"
        >
          Mass Deletion
        </button>
      )}

      <Link
        href="/clients/import"
        className="w-full sm:w-auto justify-center bg-white border-2 border-[#E0E7FF] hover:bg-[#F8F9FE] text-[#635BFF] px-4 py-1.5 rounded-lg font-bold text-[13px] flex items-center gap-2 transition-colors shrink-0"
      >
        Import Clients
      </Link>

      <button
        type="button"
        onClick={onAddClientClick}
        className="w-full sm:w-auto justify-center bg-[#635BFF] hover:bg-[#524be0] text-white px-4 py-2 rounded-lg font-bold text-[13px] flex items-center gap-2 transition-colors shadow-sm shadow-[#635BFF]/20 shrink-0 cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        Add Client
      </button>
    </div>
  );
}
