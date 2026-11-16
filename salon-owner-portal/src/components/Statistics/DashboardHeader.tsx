import React from "react";
import CustomSelect from "../customComponent/CustomSelect";
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
  return (
    <div className="bg-white rounded-[16px] p-4 shadow-sm border border-[#E2E8F0]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-[16px] font-bold text-[#1E293B] font-manrope ml-2">{title}</h1>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <CustomSelect
            value={selected}
            onChange={onSelect}
            options={teamOptions}
            buttonClassName="flex items-center justify-between gap-2 bg-[#EEF2FF] border-none text-[#635BFF] text-[13px] font-bold px-4 py-2.5 rounded-lg w-auto min-w-[120px] shadow-none hover:bg-[#E0E7FF] transition-colors"
          />
          <button className="bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#635BFF] px-4 py-2.5 rounded-lg font-bold text-[13px] flex items-center justify-center gap-2 transition-colors whitespace-nowrap">
            <ActionButtonIcon className="w-4 h-4" />
            {actionButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};
