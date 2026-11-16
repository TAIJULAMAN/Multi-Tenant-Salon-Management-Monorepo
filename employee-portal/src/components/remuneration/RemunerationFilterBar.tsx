import React from "react";
import { Download } from "lucide-react";
import CustomSelect from "@/components/customComponent/CustomSelect";
import CustomDateRangePicker from "@/components/customComponent/CustomDateRangePicker";
import { YEAR_OPTIONS } from "./data";

interface RemunerationFilterBarProps {
  selectedYear: string;
  onYearChange: (year: string) => void;
  customRange: string;
  onCustomRangeChange: (rangeStr: string, start: Date | null, end: Date | null) => void;
  onClearCustomRange: () => void;
  onExportClick: () => void;
}

export const RemunerationFilterBar: React.FC<RemunerationFilterBarProps> = ({
  selectedYear,
  onYearChange,
  customRange,
  onCustomRangeChange,
  onClearCustomRange,
  onExportClick,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-5 sm:p-6 font-manrope">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 sm:gap-6">
        {/* Left: Title */}
        <h1 className="text-xl sm:text-[22px] font-bold text-[#1E293B] font-manrope shrink-0">
          Remuneration
        </h1>

        {/* Right: The 3 controls opposite Remuneration */}
        <div className="flex flex-wrap items-center justify-start xl:justify-end gap-3 sm:gap-4 w-full xl:w-auto">
          {/* 1. Year Select */}
          <div className="flex items-center gap-2">
            <CustomSelect
              value={selectedYear}
              onChange={onYearChange}
              options={YEAR_OPTIONS}
              className="w-32 sm:w-36"
              buttonClassName="w-full flex items-center justify-between gap-2 bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-lg px-3.5 py-2 text-[12px] font-bold text-[#334155] shadow-sm transition-colors cursor-pointer"
            />
          </div>

          {/* 2. Custom Date Range Picker */}
          <CustomDateRangePicker
            value={customRange}
            onChange={(rangeStr, start, end) => {
              onCustomRangeChange(rangeStr, start || null, end || null);
            }}
            onClear={onClearCustomRange}
            placeholder="Select Date Range"
            align="right"
          />

          {/* 3. Export Data Button */}
          <button
            onClick={onExportClick}
            className="bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#635BFF] px-4 py-2 rounded-lg font-bold text-[13px] flex items-center gap-2 transition-colors cursor-pointer shrink-0"
          >
            <Download className="w-4 h-4" />
            Export Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemunerationFilterBar;
