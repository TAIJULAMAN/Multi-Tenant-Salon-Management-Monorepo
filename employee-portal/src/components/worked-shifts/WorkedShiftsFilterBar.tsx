import React from "react";
import { Download, Plus } from "lucide-react";
import CustomSelect from "@/components/customComponent/CustomSelect";
import CustomDateRangePicker from "@/components/customComponent/CustomDateRangePicker";
import { MONTHS, YEARS } from "./data";

interface WorkedShiftsFilterBarProps {
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  selectedYear: string;
  onYearChange: (year: string) => void;
  customRange: string;
  onCustomRangeChange: (rangeStr: string, start: Date | null, end: Date | null) => void;
  onClearCustomRange: () => void;
  onExportClick: () => void;
  onAddShiftClick: () => void;
}

export const WorkedShiftsFilterBar: React.FC<WorkedShiftsFilterBarProps> = ({
  selectedMonth,
  onMonthChange,
  selectedYear,
  onYearChange,
  customRange,
  onCustomRangeChange,
  onClearCustomRange,
  onExportClick,
  onAddShiftClick,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-5 sm:p-6 font-manrope">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 sm:gap-6">
        {/* Left: Title */}
        <h1 className="text-xl sm:text-[22px] font-bold text-[#1E293B] shrink-0">
          Worked Shifts
        </h1>

        {/* Right: The controls opposite Worked Shifts */}
        <div className="flex flex-wrap items-center justify-start xl:justify-end gap-3 sm:gap-4 w-full xl:w-auto">
          {/* 1. Period: Month & Year */}
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-bold text-[#64748B] shrink-0">
              Period
            </span>
            <div className="flex items-center gap-1.5">
              <CustomSelect
                value={selectedMonth}
                onChange={onMonthChange}
                options={MONTHS}
                className="w-32"
                buttonClassName="w-full flex items-center justify-between gap-2 bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-lg px-3 py-1.5 text-[12px] font-bold text-[#1E293B] shadow-sm transition-colors cursor-pointer"
              />

              <CustomSelect
                value={selectedYear}
                onChange={onYearChange}
                options={YEARS}
                className="w-24"
                buttonClassName="w-full flex items-center justify-between gap-2 bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-lg px-3 py-1.5 text-[12px] font-bold text-[#1E293B] shadow-sm transition-colors cursor-pointer"
              />
            </div>
          </div>

          {/* 2. Custom Range */}
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-bold text-[#64748B] whitespace-nowrap shrink-0">
              Custom Range
            </span>
            <CustomDateRangePicker
              value={customRange}
              onChange={(rangeStr, start, end) => {
                onCustomRangeChange(rangeStr, start || null, end || null);
              }}
              onClear={onClearCustomRange}
              className="w-48 sm:w-56"
              buttonClassName="w-full flex items-center justify-between gap-2 bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-lg px-3 py-1.5 text-[12px] font-bold text-[#1E293B] shadow-sm transition-colors cursor-pointer"
            />
          </div>

          {/* 3. Export button */}
          <button
            onClick={onExportClick}
            className="flex items-center gap-2 bg-white border border-[#E2E8F0] hover:bg-slate-50 text-[#1E293B] px-3.5 py-1.5 rounded-lg text-[12px] font-bold transition-all shadow-sm cursor-pointer whitespace-nowrap shrink-0"
          >
            <Download className="w-4 h-4 text-[#64748B]" />
            <span>Export</span>
          </button>

          {/* 4. Add Shift button */}
          <button
            onClick={onAddShiftClick}
            className="flex items-center gap-2 bg-[#635BFF] hover:bg-[#5249f0] text-white px-3.5 py-1.5 rounded-lg text-[12px] font-bold transition-all shadow-sm cursor-pointer whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Add Shift</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkedShiftsFilterBar;
