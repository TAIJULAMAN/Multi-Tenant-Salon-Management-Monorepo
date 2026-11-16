import React from "react";
import TeamDropdown from "@/components/appointment/TeamDropdown";
import { Download } from "lucide-react";
import { DashboardHeaderProps } from "./types";

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  title, 
  teamOptions, 
  selected, 
  onSelect,
  actionButtonText = "Export Statistics",
  ActionButtonIcon = Download
}) => {
  const selectedArray = Array.isArray(selected)
    ? selected
    : selected === "All Team"
    ? ["all"]
    : [selected];

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-[#E2E8F0]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-[16px] sm:text-[18px] font-bold text-[#1E293B] font-manrope ml-1">
          {title}
        </h1>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <TeamDropdown
            selected={selectedArray}
            onChange={(vals) => onSelect(vals.includes("all") ? "All Team" : vals[0] || "All Team")}
          />
          <button className="bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#635BFF] px-4 py-2.5 rounded-lg font-bold text-[13px] flex items-center justify-center gap-2 transition-colors whitespace-nowrap cursor-pointer">
            <ActionButtonIcon className="w-4 h-4" />
            {actionButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};
